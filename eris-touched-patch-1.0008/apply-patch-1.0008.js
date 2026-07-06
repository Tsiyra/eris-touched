import { existsSync, mkdirSync, readFileSync, writeFileSync, copyFileSync } from "node:fs";
import { join } from "node:path";
import { execFileSync } from "node:child_process";

const PATCH_VERSION = "1.0008";
const BACKUP_DIR = join("patch-backups", PATCH_VERSION);

function read(path) {
  return readFileSync(path, "utf8");
}

function write(path, content) {
  writeFileSync(path, content, "utf8");
}

function backup(path) {
  if (!existsSync(path)) {
    throw new Error(`Required file not found: ${path}`);
  }
  mkdirSync(BACKUP_DIR, { recursive: true });
  const backupPath = join(BACKUP_DIR, path.replaceAll(/[\\/]/g, "__"));
  copyFileSync(path, backupPath);
  return backupPath;
}

function replaceOrThrow(content, search, replacement, label) {
  if (!content.includes(search)) {
    throw new Error(`Could not find expected text for ${label}. The file may have changed; no patch was applied for that replacement.`);
  }
  return content.replace(search, replacement);
}

function patchServer() {
  const path = "server.js";
  backup(path);
  let content = read(path);

  content = content.replace(/const ERIS_PATCH_VERSION = "[^"]+";/, `const ERIS_PATCH_VERSION = "${PATCH_VERSION}";`);

  const oldStaticGate = `function servePublicFile(pathname, res) {\n  const isKnownPublicFile = pathname === "/styles.css" || pathname === "/app.js" || pathname === "/questboard-result-state.js";\n  const isAssetFile = pathname.startsWith("/assets/");\n\n  if (!isKnownPublicFile && !isAssetFile) {\n    return false;\n  }`;

  const newStaticGate = `function servePublicFile(pathname, res) {\n  const isKnownPublicFile = pathname === "/styles.css" || pathname === "/app.js" || pathname === "/questboard-result-state.js";\n  const isAssetFile = pathname.startsWith("/assets/");\n  const isJsModuleFile = pathname.startsWith("/js/");\n\n  if (!isKnownPublicFile && !isAssetFile && !isJsModuleFile) {\n    return false;\n  }`;

  if (content.includes("const isJsModuleFile = pathname.startsWith(\"/js/\");")) {
    console.log("server.js already serves /js/ modules.");
  } else {
    content = replaceOrThrow(content, oldStaticGate, newStaticGate, "server static module serving");
  }

  write(path, content);
}

function patchClientVersion() {
  const versionPath = join("public", "js", "version.js");
  if (existsSync(versionPath)) {
    backup(versionPath);
    let content = read(versionPath);
    content = content.replace(/export const APP_VERSION = "[^"]+";/, `export const APP_VERSION = "${PATCH_VERSION}";`);
    write(versionPath, content);
  }

  const htmlPath = join("public", "app-web.html");
  if (existsSync(htmlPath)) {
    backup(htmlPath);
    let content = read(htmlPath);
    content = content.replace(/<meta name="eris-app-version" content="[^"]+" \/>/, `<meta name="eris-app-version" content="${PATCH_VERSION}" />`);
    write(htmlPath, content);
  }
}

function syntaxCheck() {
  const checks = ["server.js", join("public", "app.js"), join("public", "js", "main.js"), join("public", "js", "app-runtime.js")];
  for (const file of checks) {
    if (!existsSync(file)) continue;
    try {
      execFileSync("node", ["--check", file], { stdio: "inherit" });
    } catch (error) {
      throw new Error(`Syntax check failed for ${file}. Backups are in ${BACKUP_DIR}.`);
    }
  }
}

console.log(`Applying Eris-Touched patch ${PATCH_VERSION}...`);
patchServer();
patchClientVersion();
syntaxCheck();
console.log(`Patch ${PATCH_VERSION} applied successfully.`);
console.log("Fixed: server now serves public/js/*.js modules required by the extracted app.");
console.log(`Backups saved in ${BACKUP_DIR}`);
