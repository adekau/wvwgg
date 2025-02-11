// src/nextjs-build/add-cache-handler.ts
import { existsSync, readFileSync, writeFileSync } from "fs";
function addCacheHandler(requiredServerFilesPath2) {
  if (!existsSync(requiredServerFilesPath2)) {
    throw new Error(
      `Could not find required server files path: ${requiredServerFilesPath2}`
    );
  }
  const requiredServerFiles = JSON.parse(
    readFileSync(requiredServerFilesPath2, {
      encoding: "utf-8"
    })
  );
  requiredServerFiles.config.cacheHandler = "../cache-handler.cjs";
  writeFileSync(requiredServerFilesPath2, JSON.stringify(requiredServerFiles));
}
var [requiredServerFilesPath] = process.argv.slice(2);
addCacheHandler(requiredServerFilesPath);
