import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const PATCH_VERSION = "1.0004";
const patchRoot = dirname(fileURLToPath(import.meta.url));
const projectRoot = process.cwd();
const backupRoot = join(projectRoot, "patch-backups", PATCH_VERSION);

const files = [
  {
    source: join(patchRoot, "patch-files", "server.js"),
    target: join(projectRoot, "server.js"),
  },
  {
    source: join(patchRoot, "patch-files", "public", "app-web.html"),
    target: join(projectRoot, "public", "app-web.html"),
  },
  {
    source: join(patchRoot, "patch-files", "public", "app.js"),
    target: join(projectRoot, "public", "app.js"),
  },
  {
    source: join(patchRoot, "patch-files", "public", "styles.css"),
    target: join(projectRoot, "public", "styles.css"),
  },
];

function requireFile(path, label) {
  if (!existsSync(path)) {
    throw new Error(`${label} not found: ${path}`);
  }
}

function ensureDir(path) {
  if (!existsSync(path)) {
    mkdirSync(path, { recursive: true });
  }
}

function copyWithBackup(source, target) {
  requireFile(source, "Patch source file");
  requireFile(target, "Project target file");

  const relativeBackupPath = target
    .replace(projectRoot, "")
    .replace(/^[/\\]+/, "");
  const backupPath = join(backupRoot, relativeBackupPath);

  ensureDir(dirname(backupPath));
  copyFileSync(target, backupPath);

  const nextContent = readFileSync(source, "utf8");
  writeFileSync(target, nextContent, "utf8");
}

console.log(`Applying Eris-Touched patch ${PATCH_VERSION}...`);
console.log(`Project root: ${projectRoot}`);

requireFile(join(projectRoot, "server.js"), "server.js");
requireFile(join(projectRoot, "public", "app-web.html"), "public/app-web.html");
requireFile(join(projectRoot, "public", "app.js"), "public/app.js");
requireFile(join(projectRoot, "public", "styles.css"), "public/styles.css");
ensureDir(backupRoot);

for (const file of files) {
  copyWithBackup(file.source, file.target);
  console.log(`Updated ${file.target}`);
}

console.log("");
console.log("Patch 1.0004 complete.");
console.log("Backups saved to:");
console.log(backupRoot);
console.log("");
console.log("Questboard now uses a cleaner pinned-request flow: Guild Request opens a setup popup, Pin Request saves it to the board, and Embark starts the selected request timer.");
console.log("Guild Charter has moved to the Journey page, and the Questboard portrait is circular.");
console.log("Restart your Node server after applying this patch.");
