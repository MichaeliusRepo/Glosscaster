
import express from "express";
import cors from "cors";
import fs from "fs/promises";
import path from "path";
import os from "os";
import { LaunchStatServer } from "./websocket-server.js";
import { MockFileSystemService } from "./mockFileSystemService.js";

export const app = express();
const port = 4000;

// Use mock filesystem for demo/production, real filesystem for development
const USE_MOCK_FILESYSTEM = process.env.NODE_ENV === 'production' || process.env.USE_MOCK_FILESYSTEM === 'true';

app.use(cors());
app.use(express.json());

// Get available drives (Windows-specific)
app.get("/api/drives", async (req, res) => {
    try {
        if (USE_MOCK_FILESYSTEM) {
            // Use mock filesystem
            const drives = MockFileSystemService.getDrives();
            res.json(drives);
        } else if (os.platform() === "win32") {
            // Get available drives on Windows
            const drives = [];
            for (let i = 65; i <= 90; i++) { // A-Z
                const driveLetter = String.fromCharCode(i);
                const drivePath = `${driveLetter}:\\`;
                try {
                    await fs.access(drivePath);
                    drives.push({
                        name: drivePath,
                        path: drivePath,
                        type: "drive"
                    });
                } catch {
                    // Drive not available, skip
                }
            }
            res.json(drives);
        } else {
            // For Unix-like systems, start from root
            res.json([{ name: "/", path: "/", type: "drive" }]);
        }
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
});

// Enhanced endpoint: list contents of directory with more details
app.get("/api/list", async (req, res) => {
    const dir = (req.query.dir as string) || ".";
    const showHidden = req.query.showHidden === 'true'; // Add parameter to show/hide system files
    
    try {
        if (USE_MOCK_FILESYSTEM) {
            // Use mock filesystem
            console.log(`Accessing mock directory: ${dir}`);
            const result = MockFileSystemService.getDirectoryContents(dir);
            
            // Apply filtering for hidden files if needed
            if (!showHidden) {
                result.items = result.items.filter(item => {
                    // Skip hidden files (starting with .)
                    if (item.name.startsWith('.')) return false;
                    
                    // Skip common Windows system items
                    const skipList = [
                        '$Recycle.Bin', 'System Volume Information', 'pagefile.sys', 
                        'hiberfil.sys', 'swapfile.sys', 'Config.Msi', 'Recovery',
                        'ProgramData', 'Documents and Settings', '$WINDOWS.~BT'
                    ];
                    
                    return !skipList.includes(item.name);
                });
            }
            
            res.json(result);
            return;
        }
        
        // Real filesystem logic
        const normalizedPath = path.resolve(dir);
        console.log(`Accessing directory: ${normalizedPath}`);
        
        // Check if the path exists and is accessible
        await fs.access(normalizedPath);
        
        const entries = await fs.readdir(normalizedPath, { withFileTypes: true });
        
        // Filter out hidden files and system files unless explicitly requested
        const filteredEntries = showHidden ? entries : entries.filter(entry => {
            // Skip hidden files (starting with .)
            if (entry.name.startsWith('.')) return false;
            
            // Skip common Windows system items
            const skipList = [
                '$Recycle.Bin', 'System Volume Information', 'pagefile.sys', 
                'hiberfil.sys', 'swapfile.sys', 'Config.Msi', 'Recovery',
                'ProgramData', 'Documents and Settings', '$WINDOWS.~BT'
            ];
            
            return !skipList.includes(entry.name);
        });
        const items = await Promise.all(
            filteredEntries.map(async (entry) => {
                const fullPath = path.join(normalizedPath, entry.name);
                try {
                    const stats = await fs.stat(fullPath);
                    return {
                        name: entry.name,
                        path: fullPath,
                        type: entry.isDirectory() ? "directory" : "file",
                        size: entry.isFile() ? stats.size : null,
                        modified: stats.mtime,
                        extension: entry.isFile() ? path.extname(entry.name) : null
                    };
                } catch (statError) {
                    // If we can't access the file, return basic info
                    return {
                        name: entry.name,
                        path: fullPath,
                        type: entry.isDirectory() ? "directory" : "file",
                        size: null,
                        modified: null,
                        extension: entry.isFile() ? path.extname(entry.name) : null,
                        error: "Access denied"
                    };
                }
            })
        );
        
        res.json({
            path: normalizedPath,
            items: items
        });
        
    } catch (err) {
        const error = err as NodeJS.ErrnoException;
        let errorMessage = error.message;
        
        // Provide more user-friendly error messages
        if (error.code === 'ENOENT') {
            errorMessage = "Directory not found";
        } else if (error.code === 'EACCES' || error.code === 'EPERM') {
            errorMessage = "Access denied - insufficient permissions";
        } else if (error.code === 'ENOTDIR') {
            errorMessage = "Path is not a directory";
        }
        
        res.status(500).json({ 
            error: errorMessage,
            code: error.code,
            path: dir 
        });
    }
});




app.listen(port, () => console.log(`Backend running on port ${port}`));

LaunchStatServer();
