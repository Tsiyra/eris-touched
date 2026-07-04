import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  statSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const PATCH_VERSION = "1.0005";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = process.cwd();
const patchFilesRoot = join(__dirname, "patch-files");
const backupRoot = join(projectRoot, "patch-backups", PATCH_VERSION);

const filesToPatch = [
  "server.js",
  "public/app-web.html",
  "public/app.js",
  "public/styles.css",
];

function ensureFolder(folderPath) {
  if (!existsSync(folderPath)) {
    mkdirSync(folderPath, { recursive: true });
  }
}

function assertProjectRoot() {
  const required = ["server.js", "public"];
  const missing = required.filter((entry) => !existsSync(join(projectRoot, entry)));

  if (missing.length) {
    throw new Error(
      `This patch must be run from the app project root. Missing: ${missing.join(", ")}`
    );
  }
}

function copyWithBackup(relativePath) {
  const sourcePath = join(patchFilesRoot, relativePath);
  const targetPath = join(projectRoot, relativePath);
  const backupPath = join(backupRoot, relativePath);

  if (!existsSync(sourcePath)) {
    throw new Error(`Patch file missing: ${relativePath}`);
  }

  ensureFolder(dirname(targetPath));
  ensureFolder(dirname(backupPath));

  if (existsSync(targetPath)) {
    copyFileSync(targetPath, backupPath);
  }

  copyFileSync(sourcePath, targetPath);
}

function main() {
  console.log(`Applying Eris-Touched patch ${PATCH_VERSION}...`);
  assertProjectRoot();
  ensureFolder(backupRoot);

  for (const relativePath of filesToPatch) {
    copyWithBackup(relativePath);
    console.log(`Patched ${relativePath}`);
  }

  console.log(`Done. Backups saved in patch-backups/${PATCH_VERSION}/`);
  console.log("Restart the app server with npm start.");
}

main();
