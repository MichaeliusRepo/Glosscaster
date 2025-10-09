import { useState } from 'react';
import { getDrives, listFiles } from '../util/api';
import type { DirectoryInfo } from '../util/FileExplorerLib';

export function useFileExplorer() {
    const [navigationIndex, setNavigationIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [directoryInfo, setDirectoryInfo] = useState<DirectoryInfo[]>([]);

    const currentDirectory = directoryInfo[directoryInfo.length - 1];
    const currentPath = currentDirectory?.path ?? '';
    const currentFiles = currentDirectory?.files ?? [];

    const loadDrives = async () => {
        try {
            setLoading(true);
            const driveDirectoryInfo: DirectoryInfo = { 
                depth: 0, 
                name: 'Drives', 
                path: '', 
                files: await getDrives(), 
                indexNumber: 0 
            };

            setDirectoryInfo(prev => 
                prev.length === 0 
                    ? [driveDirectoryInfo]
                    : [driveDirectoryInfo, ...prev.slice(1)]
            );
        } catch (err) {
            console.error('Failed to load drives:', (err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    const enterDirectory = async (path: string) => {
        try {
            setLoading(true);
            const response = await listFiles(path);
            const files = Array.isArray(response) ? response : response.items || [];
            const actualPath = response.path || path;

            setDirectoryInfo(prev => {
                const updated = [...prev];
                if (updated.length > 0) {
                    updated[updated.length - 1].indexNumber = navigationIndex;
                }
                updated.push({
                    depth: updated.length,
                    name: actualPath.split('\\').pop() || '',
                    path: actualPath,
                    files,
                    indexNumber: 0
                });
                return updated;
            });

            setNavigationIndex(0);
        } catch (err) {
            console.error('Failed to access path:', (err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    const exitDirectory = () => {
        const parentDirectory = directoryInfo[directoryInfo.length - 2];
        if (parentDirectory) {
            setNavigationIndex(parentDirectory.indexNumber);
            setDirectoryInfo(prev => prev.slice(0, -1));
        }
    };

    return {
        navigationIndex,
        setNavigationIndex,
        loading,
        directoryInfo,
        currentPath,
        currentFiles,
        loadDrives,
        enterDirectory,
        exitDirectory
    };
}