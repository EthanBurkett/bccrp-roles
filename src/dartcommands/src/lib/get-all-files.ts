import fs from "fs";
import p from "path";

const getAllFiles = (path: string, foldersOnly = false) => {
  const files = fs.readdirSync(path, {
    withFileTypes: true,
  });
  let filesFound: any[] = [];

  for (const file of files) {
    const filePath = p.join(path, file.name);

    if (file.isDirectory()) {
      if (foldersOnly) {
        filesFound.push(filePath);
      } else {
        filesFound = [...filesFound, ...getAllFiles(filePath)];
      }
      continue;
    }
    filesFound.push(filePath);
  }

  return filesFound;
};

export default getAllFiles;
