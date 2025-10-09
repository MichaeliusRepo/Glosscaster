import { lerp } from "three/src/math/MathUtils.js";
import { clamp, sigmoid } from "../../util/MeinMath";
// import type { FileItem } from "./FileExplorerMeine";

export const DISTANCE = 5;
export const MENU_Z_POSITIONS = [2, 1, 0.66, 0, -1, -2.5, -5, -9, -15, -25, -40];
export const DIRECTORY_SPACING = 4;

export interface FileItem {
    name: string;
    path: string;
    type: 'file' | 'directory' | 'drive';
    size?: number | null;
    modified?: string | null;
    extension?: string | null;
    error?: string;
}

export interface DirectoryInfo {
    depth: number;
    name: string; // Last part of the path
    path: string; // Full path
    files: FileItem[];
    indexNumber: number; // Navigation index within this directory
}


// Make ActiveMenu more type-safe
export const ActiveMenu = {
    None: 'None',
    Settings: 'Settings',
    Explorer: 'Explorer',
    Music: 'Music',
    Pictures: 'Pictures',
    Videos: 'Videos'
} as const;

export type ActiveMenu = typeof ActiveMenu[keyof typeof ActiveMenu];

// Add file extension constants
const AUDIO_EXTENSIONS = ['.mp3', '.wav', '.flac', '.aac'];
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
const VIDEO_EXTENSIONS = ['.mp4', '.avi', '.mkv', '.mov', '.wmv'];
const DOCUMENT_EXTENSIONS = ['.txt', '.md', '.docx', '.pdf', '.odt'];

export function getFileIcon(file: FileItem) {
    if (file.type === 'drive') return "/assets/drive.svg";
    if (file.type === 'directory') return "/assets/folder.svg";
    
    const ext = file.extension?.toLowerCase();
    if (ext && AUDIO_EXTENSIONS.includes(ext)) return "/assets/music.svg";
    if (ext && IMAGE_EXTENSIONS.includes(ext)) return "/assets/pictures.svg";
    if (ext && VIDEO_EXTENSIONS.includes(ext)) return "/assets/videos.svg";
    if (ext && DOCUMENT_EXTENSIONS.includes(ext)) return "/assets/document.svg";
    
    return "/assets/file.svg";
}





// Define the items data - easily extendable
export const items = [
    { text: "Settings", imgPath: "/assets/settings.svg" },
    { text: "Explorer", imgPath: "/assets/home.svg" },    // Initially selected (index 3, slot 0)
    { text: "Music", imgPath: "/assets/music.svg" },
    { text: "Pictures", imgPath: "/assets/pictures.svg" },
    { text: "Videos", imgPath: "/assets/videos.svg" },
];



export function truncateString(str: string, maxLength: number) {
    if (str.length <= maxLength) return str;
    return str.slice(0, maxLength - 3) + '...';
}

export function getOpacity(slotIndex: number) {
    return lerp(1, 0, clamp(sigmoid(Math.abs(slotIndex / 5), 0.15), 0, 1));
};

export function getPos(slotIndex: number) {
    return [0, 0, MENU_Z_POSITIONS[clamp(slotIndex + 3, 0, MENU_Z_POSITIONS.length - 1)] * DISTANCE] as [number, number, number];
}

// export function getFileIcon(file: FileItem) {
//     if (file.type === 'drive') return "/assets/drive.svg";
//     if (file.type === 'directory') return "/assets/folder.svg";
//     if (file.extension === '.mp3' || file.extension === '.wav') return "/assets/music.svg";
//     if (file.extension === '.jpg' || file.extension === '.png' || file.extension === '.gif') return "/assets/pictures.svg";
//     if (file.extension === '.mp4' || file.extension === '.avi' || file.extension === '.mkv') return "/assets/videos.svg";
//     if (file.extension === '.txt' || file.extension === '.md' || file.extension === '.docx' || file.extension === '.odf') return "/assets/document.svg";
//     return "/assets/file.svg";
// }

export function getYPosition(directoryIndex: number, directoryInfo: DirectoryInfo[]) {
    let offset = 0;
    for (let i = 0; i < directoryIndex; i++) {
        offset += directoryInfo[i].indexNumber * 1.5;
    }
    return offset;
};

export function getFileOpacity(
    directoryIndex: number,
    dirIndexNumber: number,
    navigationIndex: number,
    fileIndex: number,
    directoryInfoLength: number) {
    return directoryInfoLength - 1 === (directoryIndex) ?
        (navigationIndex === fileIndex ? 1.0 : 0.1) :
        (dirIndexNumber === fileIndex ? 1.0 : 0.1);
}