// src/nextjs-build/symlink.ts
import { mkdirSync, readdirSync, rmSync, symlinkSync } from "node:fs";
import { extname, join } from "node:path";
var [sourcePathArg, destPathArg, _extensions] = process.argv.slice(2);
if (!sourcePathArg || !destPathArg) {
  console.error("Usage: node symlink.mjs <sourcePath> <destPath> [extensions]");
  process.exit(1);
}
var extensionsArg = _extensions ? _extensions.split(",") : ["*"];
createSymlinks(sourcePathArg, destPathArg, extensionsArg);
function createSymlinks(srcPath, destPath, extensions) {
  mkdirSync(destPath, { recursive: true });
  const entries = readdirSync(srcPath, { withFileTypes: true });
  for (const entry of entries) {
    const entryPath = join(srcPath, entry.name);
    if (entry.isDirectory()) {
      createSymlinks(entryPath, join(destPath, entry.name), extensions);
    } else if (entry.isFile()) {
      const ext = extname(entryPath).slice(1);
      if (extensions.includes("*") || extensions.includes(ext)) {
        const symlink = entryPath;
        const target = join(destPath, entry.name);
        rmSync(symlink);
        symlinkSync(target, symlink, "file");
      }
    }
  }
}
