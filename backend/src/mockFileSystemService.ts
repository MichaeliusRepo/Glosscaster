import mockData from './mockFileSystem.json';

interface MockFileItem {
    name: string;
    path: string;
    type: 'file' | 'directory' | 'drive';
    size?: number;
    extension?: string;
    modified?: string;
    children?: Record<string, MockFileItem>;
}

interface MockFileSystem {
    drives: Array<{ name: string; path: string; type: string }>;
    filesystem: Record<string, MockFileItem>;
}

const mockFileSystem: MockFileSystem = mockData as MockFileSystem;

export class MockFileSystemService {
    /**
     * Get available drives
     */
    static getDrives() {
        return mockFileSystem.drives;
    }

    /**
     * Get directory contents for a given path
     */
    static getDirectoryContents(dirPath: string) {
        // Handle root drives
        if (dirPath === '' || dirPath === '.') {
            return {
                path: '',
                items: this.getDrives()
            };
        }

        // Normalize path (replace forward slashes with backslashes for Windows-style paths)
        const normalizedPath = dirPath.replace(/\//g, '\\');
        
        // Find the item in the mock filesystem
        const item = this.findItemByPath(normalizedPath);
        
        if (!item) {
            throw new Error(`Directory not found: ${dirPath}`);
        }

        if (item.type !== 'directory' && item.type !== 'drive') {
            throw new Error(`Path is not a directory: ${dirPath}`);
        }

        // Convert children to array format
        const items = item.children ? Object.values(item.children).map(child => ({
            name: child.name,
            path: child.path,
            type: child.type,
            size: child.size || null,
            modified: child.modified ? new Date(child.modified) : null,
            extension: child.extension || null
        })) : [];

        return {
            path: normalizedPath,
            items: items
        };
    }

    /**
     * Find an item by its path in the mock filesystem
     */
    private static findItemByPath(path: string): MockFileItem | null {
        // Handle drive root (e.g., "C:" or "D:")
        if (path.match(/^[A-Z]:$/)) {
            return mockFileSystem.filesystem[path] || null;
        }

        // Split path into parts
        const parts = path.split('\\').filter(part => part !== '');
        
        if (parts.length === 0) {
            return null;
        }

        // Start from the drive
        const driveLetter = parts[0];
        if (!driveLetter) {
            return null;
        }
        
        let currentItem: MockFileItem | undefined = mockFileSystem.filesystem[driveLetter];
        
        if (!currentItem) {
            return null;
        }

        // Traverse the path
        for (let i = 1; i < parts.length; i++) {
            const partName = parts[i];
            if (!partName || !currentItem || !currentItem.children || !(partName in currentItem.children)) {
                return null;
            }
            currentItem = currentItem.children[partName];
        }

        return currentItem || null;
    }

    /**
     * Check if a path exists in the mock filesystem
     */
    static pathExists(path: string): boolean {
        if (path === '' || path === '.') {
            return true; // Root always exists
        }
        return this.findItemByPath(path.replace(/\//g, '\\')) !== null;
    }

    /**
     * Get file/directory stats
     */
    static getStats(path: string) {
        const item = this.findItemByPath(path.replace(/\//g, '\\'));
        if (!item) {
            throw new Error(`Path not found: ${path}`);
        }

        return {
            isDirectory: () => item.type === 'directory' || item.type === 'drive',
            isFile: () => item.type === 'file',
            size: item.size || 0,
            mtime: item.modified ? new Date(item.modified) : new Date()
        };
    }
}