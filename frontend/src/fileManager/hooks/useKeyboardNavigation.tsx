import { useEffect } from 'react';
import { ActiveMenu, items } from '../util/FileExplorerLib';

interface UseKeyboardNavigationProps {
    loading: boolean;
    activeMenu: keyof typeof ActiveMenu;
    selectedIndex: number;
    navigationIndex: number;
    currentPath: string;
    currentFiles: any[];
    directoryInfo: any[];
    setSelectedIndex: (value: number | ((prev: number) => number)) => void;
    setActiveMenu: (menu: keyof typeof ActiveMenu) => void;
    setCameraY: (value: number | ((prev: number) => number)) => void;
    setNavigationIndex: (value: number | ((prev: number) => number)) => void;
    loadDrives: () => void;
    exitDirectory: () => void;
    enterDirectory: (path: string) => void;
}

export function useKeyboardNavigation(props: UseKeyboardNavigationProps) {
    const {
        loading, activeMenu, selectedIndex, navigationIndex,
        currentPath, currentFiles, directoryInfo,
        setSelectedIndex, setActiveMenu, setCameraY, setNavigationIndex,
        loadDrives, exitDirectory, enterDirectory
    } = props;

    useEffect(() => {
        if (loading) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (activeMenu === ActiveMenu.None) {
                handleMainMenuNavigation(event);
            } else if (activeMenu === ActiveMenu.Explorer) {
                handleExplorerNavigation(event);
            }
        };

        const handleMainMenuNavigation = (event: KeyboardEvent) => {
            switch (event.key) {
                case 'ArrowLeft':
                    event.preventDefault();
                    setSelectedIndex(prev => Math.max(prev - 1, 0));
                    break;
                case 'ArrowRight':
                    event.preventDefault();
                    setSelectedIndex(prev => Math.min(prev + 1, items.length - 1));
                    break;
                case 'ArrowDown':
                    event.preventDefault();
                    if (items[selectedIndex]?.text === "Explorer") {
                        setActiveMenu(ActiveMenu.Explorer);
                        setCameraY(3);
                        setNavigationIndex(0);
                        loadDrives();
                    }
                    break;
            }
        };

        const handleExplorerNavigation = (event: KeyboardEvent) => {
            const navigableItems = currentPath ? currentFiles : directoryInfo[0]?.files || [];
            const maxIndex = navigableItems.length - 1;

            switch (event.key) {
                case 'ArrowDown':
                    event.preventDefault();
                    if (navigationIndex >= maxIndex) return;
                    setCameraY(prev => prev + 1.5);
                    setNavigationIndex(prev => prev + 1);
                    break;
                case 'ArrowUp':
                    event.preventDefault();
                    setNavigationIndex(prev => {
                        if (prev === 0) {
                            if (!currentPath) {
                                setActiveMenu(ActiveMenu.None);
                                setCameraY(0);
                            }
                            return 0;
                        }
                        setCameraY(current => current - 0.75);
                        return prev - 1;
                    });
                    break;
                case 'ArrowLeft':
                    event.preventDefault();
                    if (currentPath) {
                        setCameraY(prev => prev - (navigationIndex * 1.5));
                        exitDirectory();
                    }
                    break;
                case 'ArrowRight':
                case 'Enter':
                    event.preventDefault();
                    const selectedItem = navigableItems[navigationIndex];
                    if (selectedItem && (selectedItem.type === 'drive' || selectedItem.type === 'directory')) {
                        enterDirectory(selectedItem.path);
                    }
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [loading, activeMenu, selectedIndex, navigationIndex, currentPath, currentFiles, directoryInfo]);
}