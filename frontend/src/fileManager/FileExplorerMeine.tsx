import { useState } from "react";
import { useSpring, animated, config } from "@react-spring/three";
import { clamp } from "../util/MeinMath";
import { Icon } from "./elements/Icon";
import { useFileExplorer } from "./hooks/useFileExplorer";
import { useKeyboardNavigation } from "./hooks/useKeyboardNavigation";
import { 
    DIRECTORY_SPACING, 
    ActiveMenu, 
    items, 
    getPos, 
    getOpacity, 
    truncateString, 
    getFileIcon, 
    getFileOpacity, 
    getYPosition 
} from "./util/FileExplorerLib";

interface FileExplorerMeineProps {
    hue: number;
}

export function FileExplorerMeine({ hue }: FileExplorerMeineProps) {
    const [selectedIndex, setSelectedIndex] = useState(1);
    const [activeMenu, setActiveMenu] = useState<keyof typeof ActiveMenu>(ActiveMenu.None);
    const [cameraY, setCameraY] = useState(0);

    const fileExplorer = useFileExplorer();

    useKeyboardNavigation({
        loading: fileExplorer.loading,
        activeMenu,
        selectedIndex,
        navigationIndex: fileExplorer.navigationIndex,
        currentPath: fileExplorer.currentPath,
        currentFiles: fileExplorer.currentFiles,
        directoryInfo: fileExplorer.directoryInfo,
        setSelectedIndex,
        setActiveMenu,
        setCameraY,
        setNavigationIndex: fileExplorer.setNavigationIndex,
        loadDrives: fileExplorer.loadDrives,
        exitDirectory: fileExplorer.exitDirectory,
        enterDirectory: fileExplorer.enterDirectory,
    });

    const cameraSpring = useSpring({
        position: [-1.5, cameraY, 0] as const,
        config: config.default,
    });

    const directoryDepthSpacing = -(clamp(fileExplorer.directoryInfo.length - 1, 0, 99)) * DIRECTORY_SPACING;
    const directoryDepthSpring = useSpring({
        position: [directoryDepthSpacing, directoryDepthSpacing * 0.0765, 0] as const,
        config: config.default,
    });

    return (
        <animated.group
            position={cameraSpring.position}
            rotation={[Math.PI / 16, -Math.PI / 8, 0]}
        >
            <animated.group position={directoryDepthSpring.position}>
                {/* Main Menu Icons */}
                {items.map((item, index) => {
                    const slotIndex = index - selectedIndex;
                    return (
                        <Icon
                            key={index}
                            text={item.text}
                            imgPath={item.imgPath}
                            position={getPos(slotIndex)}
                            rotation={[0, 0, 0]}
                            hue={hue}
                            opacity={getOpacity(slotIndex)}
                        />
                    );
                })}

                {/* File Explorer */}
                {activeMenu === ActiveMenu.Explorer && (
                    <group position={[0, 0, 0]} rotation={[0, Math.PI / 8, 0]}>
                        <group position={[0, 0, 0]} rotation={[-Math.PI / 16, -Math.PI / 8, 0]}>
                            <Icon
                                text=""
                                imgPath="/assets/angle-right.svg"
                                position={[0, -1.5, 0]}
                                rotation={[0, 0, -Math.PI / 2]}
                                hue={hue}
                                opacity={0.5}
                            />

                            {fileExplorer.directoryInfo.map((dir, directoryIndex) => (
                                <group key={directoryIndex}>
                                    {dir.files.map((file, fileIndex) => (
                                        <Icon
                                            key={fileIndex}
                                            text={
                                                fileExplorer.directoryInfo.length === directoryIndex + 1
                                                    ? file.name
                                                    : truncateString(file.name, 20)
                                            }
                                            imgPath={getFileIcon(file)}
                                            position={[
                                                directoryIndex * DIRECTORY_SPACING,
                                                -3 - (fileIndex * 1.5) - getYPosition(directoryIndex, fileExplorer.directoryInfo),
                                                0
                                            ]}
                                            rotation={[0, 0, 0]}
                                            hue={hue}
                                            opacity={getFileOpacity(
                                                directoryIndex,
                                                dir.indexNumber,
                                                fileExplorer.navigationIndex,
                                                fileIndex,
                                                fileExplorer.directoryInfo.length
                                            )}
                                            horizontal={true}
                                        />
                                    ))}
                                </group>
                            ))}
                        </group>
                    </group>
                )}
            </animated.group>
        </animated.group>
    );
}