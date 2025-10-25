import fs from "fs";
import path from "path";

// Read all files in a directory
const files = fs.readdirSync("C:/Projects");

// Get file info
for (const f of files) {
    const fullPath = path.join("C:/Projects", f);
    const stats = fs.statSync(fullPath);
    console.log(`${f} - ${stats.isDirectory() ? "Folder" : "File"} - ${stats.size} bytes`);
}

// Read file contents
const data = fs.readFileSync("C:/Projects/readme.txt", "utf-8");
console.log(data);

// Write new file
fs.writeFileSync("C:/Projects/newfile.txt", "Hello world!");
