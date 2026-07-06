import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const PATCH_VERSION = "1.0006";
const PATCH_NAME = `module-refactor-${PATCH_VERSION}`;
const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = process.cwd();
const publicDir = join(projectRoot, "public");
const jsDir = join(publicDir, "js");
const patchFilesDir = join(__dirname, "patch-files");
const backupDir = join(projectRoot, "patch-backups", PATCH_NAME);
const appEntryPath = join(publicDir, "app.js");
const appRuntimePath = join(jsDir, "app-runtime.js");

function assertFile(path, label) {
  if (!existsSync(path)) {
    throw new Error(`Missing ${label}: ${path}`);
  }
}

function ensureDir(path) {
  if (!existsSync(path)) {
    mkdirSync(path, { recursive: true });
  }
}

function backupFile(path) {
  if (!existsSync(path)) return;
  const relative = path.slice(projectRoot.length + 1);
  const destination = join(backupDir, relative);
  ensureDir(dirname(destination));
  copyFileSync(path, destination);
}

function copyDirectory(sourceDir, destinationDir) {
  ensureDir(destinationDir);
  for (const entry of readdirSync(sourceDir)) {
    const source = join(sourceDir, entry);
    const destination = join(destinationDir, entry);
    if (statSync(source).isDirectory()) {
      copyDirectory(source, destination);
    } else {
      writeFileSync(destination, readFileSync(source, "utf8"), "utf8");
    }
  }
}

function writeAppEntry() {
  const content = `import { logModuleLoad } from "./js/bootstrap.js";\nimport "./js/app-runtime.js";\n\nlogModuleLoad();\n`;
  writeFileSync(appEntryPath, content, "utf8");
}

function updateHtmlVersionIfPresent() {
  const htmlPath = join(publicDir, "app-web.html");
  if (!existsSync(htmlPath)) return;

  const html = readFileSync(htmlPath, "utf8");
  const updated = html.replace(
    /<meta name="eris-app-version" content="[^"]*" \/>/,
    `<meta name="eris-app-version" content="${PATCH_VERSION}" />`
  );

  if (updated !== html) {
    backupFile(htmlPath);
    writeFileSync(htmlPath, updated, "utf8");
  }
}

function main() {
  assertFile(appEntryPath, "public/app.js");
  assertFile(join(patchFilesDir, "public", "js", "bootstrap.js"), "patch module files");

  ensureDir(backupDir);
  ensureDir(jsDir);

  const currentApp = readFileSync(appEntryPath, "utf8");
  const alreadyRefactored = currentApp.includes("./js/app-runtime.js");

  backupFile(appEntryPath);
  if (existsSync(appRuntimePath)) {
    backupFile(appRuntimePath);
  }

  copyDirectory(join(patchFilesDir, "public", "js"), jsDir);

  if (!alreadyRefactored) {
    writeFileSync(appRuntimePath, currentApp, "utf8");
  }

  writeAppEntry();
  updateHtmlVersionIfPresent();

  console.log(`Applied Eris-Touched safe module refactor ${PATCH_VERSION}.`);
  console.log("app.js is now the entry point.");
  console.log("The previous app runtime was moved to public/js/app-runtime.js.");
  console.log(`Backups saved in ${backupDir}`);
}

try {
  main();
} catch (error) {
  console.error(`Could not apply ${PATCH_NAME}:`, error.message);
  process.exitCode = 1;
}
