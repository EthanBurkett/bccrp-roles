"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const getAllFiles = (path, foldersOnly = false) => {
    const files = fs_1.default.readdirSync(path, {
        withFileTypes: true,
    });
    let filesFound = [];
    for (const file of files) {
        const filePath = path_1.default.join(path, file.name);
        if (file.isDirectory()) {
            if (foldersOnly) {
                filesFound.push(filePath);
            }
            else {
                filesFound = [...filesFound, ...getAllFiles(filePath)];
            }
            continue;
        }
        filesFound.push(filePath);
    }
    return filesFound;
};
exports.default = getAllFiles;
//# sourceMappingURL=get-all-files.js.map