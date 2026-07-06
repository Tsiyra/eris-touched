import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";

const PATCH_VERSION = "1.0007";
const BACKUP_DIR = join("patch-backups", `deep-extraction-${PATCH_VERSION}`);
const PUBLIC_DIR = "public";
const JS_DIR = join(PUBLIC_DIR, "js");
const APP_ENTRY_FILE = join(PUBLIC_DIR, "app.js");
const APP_RUNTIME_FILE = join(JS_DIR, "app-runtime.js");
const APP_HTML_FILE = join(PUBLIC_DIR, "app-web.html");

const MODULE_FILES = {
  [join(JS_DIR, "version.js")]: `export const APP_VERSION = "${PATCH_VERSION}";\n`,

  [join(JS_DIR, "main.js")]: `import { logModuleLoad } from "./bootstrap.js";\nimport "./app-runtime.js";\n\nlogModuleLoad();\n`,

  [join(JS_DIR, "bootstrap.js")]: `import { APP_VERSION } from "./version.js";\n\nexport function logModuleLoad() {\n  console.info(\`Eris-Touched module entry loaded (\${APP_VERSION}).\`);\n}\n`,

  [join(JS_DIR, "api.js")]: `export function createApiClient({ apiBase = window.location.origin, updateFromResponse, onError } = {}) {\n  const endpointMap = {\n    get_progress: { method: "GET", path: "/api/progress" },\n    start_focus_quest: { method: "POST", path: "/api/start-quest" },\n    complete_focus_quest: { method: "POST", path: "/api/complete-quest" },\n    update_character: { method: "POST", path: "/api/update-character" },\n    generate_portrait: { method: "POST", path: "/api/generate-portrait" },\n    update_settings: { method: "POST", path: "/api/update-settings" },\n    choose_npc: { method: "POST", path: "/api/choose-npc" },\n  };\n\n  async function callTool(name, payload) {\n    const config = endpointMap[name];\n    if (!config) throw new Error(\`Unknown tool: \${name}\`);\n\n    const options = {\n      method: config.method,\n      headers: { "Content-Type": "application/json" },\n    };\n\n    if (config.method === "POST" && payload !== undefined) {\n      options.body = JSON.stringify(payload);\n    }\n\n    const response = await fetch(\`\${apiBase}\${config.path}\`, options);\n    const data = await response.json().catch(() => ({}));\n\n    if (!response.ok) {\n      throw new Error(data.error || data.message || \`API request failed: \${response.status}\`);\n    }\n\n    updateFromResponse?.(data);\n    return data;\n  }\n\n  function reportToolError(error) {\n    console.error("Tool call failed:", error);\n    onError?.(error);\n  }\n\n  function getToolText(response) {\n    return response?.content\n      ?.filter((item) => item.type === "text")\n      .map((item) => item.text)\n      .join("\\n")\n      .trim();\n  }\n\n  return { callTool, reportToolError, getToolText };\n}\n`,

  [join(JS_DIR, "timer.js")]: `export function formatTime(totalSeconds) {\n  const safeSeconds = Math.max(0, Math.floor(Number(totalSeconds) || 0));\n  const hours = Math.floor(safeSeconds / 3600);\n  const minutes = Math.floor((safeSeconds % 3600) / 60);\n  const seconds = safeSeconds % 60;\n\n  return [hours, minutes, seconds]\n    .map((number) => String(number).padStart(2, "0"))\n    .join(":");\n}\n\nexport function calculateFocusedSeconds({ timerRunning, startTime, accumulatedSeconds }) {\n  if (!timerRunning || !startTime) {\n    return accumulatedSeconds;\n  }\n\n  const currentRunSeconds = Math.floor((Date.now() - startTime) / 1000);\n  return accumulatedSeconds + currentRunSeconds;\n}\n`,

  [join(JS_DIR, "navigation.js")]: `export function setupNavigation({ navButtons, appScreens }) {\n  function showScreen(screenName) {\n    appScreens.forEach((screen) => {\n      screen.classList.remove("active-screen");\n    });\n\n    navButtons.forEach((button) => {\n      button.classList.remove("active");\n    });\n\n    const screen = document.querySelector(\`#screen-\${screenName}\`);\n    const button = document.querySelector(\`[data-screen="\${screenName}"]\`);\n\n    if (screen) screen.classList.add("active-screen");\n    if (button) button.classList.add("active");\n  }\n\n  navButtons.forEach((button) => {\n    button.addEventListener("click", () => {\n      const targetScreen = button.dataset.screen;\n      if (targetScreen) {\n        showScreen(targetScreen);\n      }\n    });\n  });\n\n  return { showScreen };\n}\n`,

  [join(JS_DIR, "modals.js")]: `export function createOverlayController({ documentRef = document, bodyClass = "overlay-visible" } = {}) {\n  const activeOverlayLayers = new Set();\n\n  function syncOverlayChrome() {\n    documentRef.body.classList.toggle(bodyClass, activeOverlayLayers.size > 0);\n  }\n\n  function setOverlayLayerVisible(layer, isVisible) {\n    if (!layer) return;\n\n    if (isVisible) {\n      activeOverlayLayers.add(layer);\n    } else {\n      activeOverlayLayers.delete(layer);\n    }\n\n    syncOverlayChrome();\n  }\n\n  return { setOverlayLayerVisible, syncOverlayChrome };\n}\n`,

  [join(JS_DIR, "portrait-files.js")]: `export function readFileAsDataUrl(file) {\n  return new Promise((resolve, reject) => {\n    const reader = new FileReader();\n    reader.addEventListener("load", () => resolve(reader.result));\n    reader.addEventListener("error", () => reject(reader.error));\n    reader.readAsDataURL(file);\n  });\n}\n\nexport function loadImageSource(source) {\n  return new Promise((resolve, reject) => {\n    const image = new Image();\n    image.addEventListener("load", () => resolve(image));\n    image.addEventListener("error", () => reject(new Error("Image failed to load.")));\n    image.src = source;\n  });\n}\n`,

  [join(JS_DIR, "questboard.js")]: `export function createPinnedRequestId() {\n  return \`pinned-\${Date.now()}-\${Math.random().toString(36).slice(2, 8)}\`;\n}\n\nexport function clampPlannedMinutes(value, fallback = 45) {\n  return Math.max(1, Math.min(600, Math.round(Number(value) || fallback)));\n}\n`,

  [join(JS_DIR, "storage.js")]: `export function loadJson(key, fallback) {\n  try {\n    const raw = localStorage.getItem(key);\n    return raw ? JSON.parse(raw) : fallback;\n  } catch (error) {\n    console.error(\`Could not load localStorage key \${key}:\`, error);\n    return fallback;\n  }\n}\n\nexport function saveJson(key, value) {\n  try {\n    localStorage.setItem(key, JSON.stringify(value));\n    return true;\n  } catch (error) {\n    console.error(\`Could not save localStorage key \${key}:\`, error);\n    return false;\n  }\n}\n`,

  [join(JS_DIR, "render.js")]: `export function setText(element, value) {\n  if (element) element.textContent = value ?? "";\n}\n\nexport function setDisplay(element, isVisible, visibleDisplay = "block") {\n  if (element) element.style.display = isVisible ? visibleDisplay : "none";\n}\n`,

  [join(JS_DIR, "state.js")]: `export function createInitialState() {\n  return {\n    currentQuest: null,\n    lastCompletedQuest: null,\n    pinnedRequests: [],\n    log: [],\n    pendingNpcChoices: [],\n    knownNpcs: [],\n    storyChapters: [],\n    appSettings: {\n      storyTone: "epic_heroic",\n      overarchingGoal: "Build better habits",\n    },\n    character: {\n      name: "Eris-Touched Hero",\n      description: "A fantasy adventurer touched by Eris, learning to turn chaos into quests.",\n      portraitPrompt: "A fantasy portrait of an Eris-Touched hero.",\n      portraitImageUrl: "",\n      outfitName: "Hero Starter Outfit",\n      race: "Human",\n      hairColor: "Black",\n      skinColor: "Olive",\n    },\n    player: {\n      name: "Eris-Touched Hero",\n      level: 1,\n      totalXp: 0,\n      completedQuests: 0,\n      coins: 0,\n      inventory: [],\n    },\n  };\n}\n`,

  [join(JS_DIR, "hero.js")]: `export function getLevelProgress(player, levelThresholds) {\n  const currentLevelXp = levelThresholds[player.level] ?? 0;\n  const nextLevelXp = levelThresholds[player.level + 1];\n\n  if (!nextLevelXp) {\n    return { percent: 100, label: "Max level reached" };\n  }\n\n  const earnedThisLevel = player.totalXp - currentLevelXp;\n  const neededThisLevel = nextLevelXp - currentLevelXp;\n  const percent = Math.max(0, Math.min(100, Math.round((earnedThisLevel / neededThisLevel) * 100)));\n\n  return {\n    percent,\n    label: \`\${player.totalXp} / \${nextLevelXp} XP to Level \${player.level + 1}\`,\n  };\n}\n`,

  [join(JS_DIR, "journey.js")]: `export function getLongestChapter(storyChapters = []) {\n  return storyChapters.reduce(\n    (longest, chapter) => {\n      if (!chapter.minutes) return longest;\n      return chapter.minutes > longest.minutes ? chapter : longest;\n    },\n    { minutes: 0, title: "None yet" }\n  );\n}\n`,

  [join(JS_DIR, "collection.js")]: `export function getItemGoldBonus(item) {\n  return item?.goldBonus ?? item?.xpBonus ?? 0;\n}\n`,

  [join(JS_DIR, "chronicle.js")]: `import { getLongestChapter } from "./journey.js";\n\nexport function getChronicleStats({ storyChapters = [], player, knownNpcs = [] }) {\n  const highestXp = storyChapters.reduce((max, chapter) => Math.max(max, chapter.xp || 0), 0);\n  const longestRequest = getLongestChapter(storyChapters);\n\n  return {\n    totalXp: player.totalXp,\n    coins: player.coins ?? 0,\n    completedRequests: player.completedQuests,\n    lootCount: player.inventory.length,\n    knownNpcCount: knownNpcs.length,\n    highestXp,\n    longestRequestLabel: longestRequest.title && longestRequest.minutes\n      ? \`\${longestRequest.title} (\${longestRequest.minutes} min)\`\n      : "None yet",\n  };\n}\n`,
};

function fail(message) {
  throw new Error(`Patch ${PATCH_VERSION} failed: ${message}`);
}

function ensureDir(path) {
  if (!existsSync(path)) mkdirSync(path, { recursive: true });
}

function backupFile(path) {
  if (!existsSync(path)) return;
  const backupPath = join(BACKUP_DIR, path);
  ensureDir(dirname(backupPath));
  copyFileSync(path, backupPath);
}

function writeFile(path, content) {
  ensureDir(dirname(path));
  writeFileSync(path, content, "utf8");
}

function findFunctionRange(source, name) {
  const starts = [`async function ${name}(`, `function ${name}(`];
  let start = -1;
  for (const marker of starts) {
    start = source.indexOf(marker);
    if (start !== -1) break;
  }

  if (start === -1) return null;

  while (start > 0 && source[start - 1] !== "\n") start--;

  const bodyStart = source.indexOf("{", start);
  if (bodyStart === -1) fail(`Could not find function body for ${name}.`);

  const end = findBalancedBlockEnd(source, bodyStart);
  let finalEnd = end + 1;
  while (source[finalEnd] === "\r" || source[finalEnd] === "\n") finalEnd++;

  return { start, end: finalEnd };
}

function findBalancedBlockEnd(source, openBraceIndex) {
  let depth = 0;
  let state = "code";
  let quote = "";
  let escaped = false;

  for (let i = openBraceIndex; i < source.length; i++) {
    const char = source[i];
    const next = source[i + 1];

    if (state === "line-comment") {
      if (char === "\n") state = "code";
      continue;
    }

    if (state === "block-comment") {
      if (char === "*" && next === "/") {
        state = "code";
        i++;
      }
      continue;
    }

    if (state === "string") {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === quote) {
        state = "code";
      }
      continue;
    }

    if (state === "template") {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === "`") {
        state = "code";
      }
      continue;
    }

    if (char === "/" && next === "/") {
      state = "line-comment";
      i++;
      continue;
    }

    if (char === "/" && next === "*") {
      state = "block-comment";
      i++;
      continue;
    }

    if (char === "'" || char === '"') {
      state = "string";
      quote = char;
      escaped = false;
      continue;
    }

    if (char === "`") {
      state = "template";
      escaped = false;
      continue;
    }

    if (char === "{") depth++;
    if (char === "}") {
      depth--;
      if (depth === 0) return i;
    }
  }

  fail("Could not find matching closing brace while editing app-runtime.js.");
}

function removeFunction(source, name) {
  const range = findFunctionRange(source, name);
  if (!range) return { source, removed: false };
  return {
    source: `${source.slice(0, range.start)}${source.slice(range.end)}`,
    removed: true,
  };
}

function replaceFunction(source, name, replacement) {
  const range = findFunctionRange(source, name);
  if (!range) return { source, replaced: false };
  return {
    source: `${source.slice(0, range.start)}${replacement}\n\n${source.slice(range.end)}`,
    replaced: true,
  };
}

function findStatementEnd(source, startIndex) {
  let depthParen = 0;
  let depthBrace = 0;
  let depthBracket = 0;
  let state = "code";
  let quote = "";
  let escaped = false;

  for (let i = startIndex; i < source.length; i++) {
    const char = source[i];
    const next = source[i + 1];

    if (state === "line-comment") {
      if (char === "\n") state = "code";
      continue;
    }

    if (state === "block-comment") {
      if (char === "*" && next === "/") {
        state = "code";
        i++;
      }
      continue;
    }

    if (state === "string") {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === quote) state = "code";
      continue;
    }

    if (state === "template") {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === "`") state = "code";
      continue;
    }

    if (char === "/" && next === "/") {
      state = "line-comment";
      i++;
      continue;
    }
    if (char === "/" && next === "*") {
      state = "block-comment";
      i++;
      continue;
    }
    if (char === "'" || char === '"') {
      state = "string";
      quote = char;
      escaped = false;
      continue;
    }
    if (char === "`") {
      state = "template";
      escaped = false;
      continue;
    }

    if (char === "(") depthParen++;
    else if (char === ")") depthParen--;
    else if (char === "{") depthBrace++;
    else if (char === "}") depthBrace--;
    else if (char === "[") depthBracket++;
    else if (char === "]") depthBracket--;
    else if (char === ";" && depthParen === 0 && depthBrace === 0 && depthBracket === 0) {
      return i + 1;
    }
  }

  fail("Could not find statement ending while editing app-runtime.js.");
}

function removeStatement(source, marker) {
  let start = source.indexOf(marker);
  if (start === -1) return { source, removed: false };
  while (start > 0 && source[start - 1] !== "\n") start--;
  const end = findStatementEnd(source, start);
  let finalEnd = end;
  while (source[finalEnd] === "\r" || source[finalEnd] === "\n") finalEnd++;
  return {
    source: `${source.slice(0, start)}${source.slice(finalEnd)}`,
    removed: true,
  };
}

function addImport(source, importLine) {
  if (source.includes(importLine)) return source;
  const importMatches = [...source.matchAll(/^import .*;$/gm)];
  if (!importMatches.length) return `${importLine}\n${source}`;
  const lastImport = importMatches.at(-1);
  const insertAt = lastImport.index + lastImport[0].length;
  return `${source.slice(0, insertAt)}\n${importLine}${source.slice(insertAt)}`;
}

function patchRuntime(source) {
  source = addImport(source, `import { APP_VERSION } from "./version.js";`);
  source = addImport(source, `import { createApiClient } from "./api.js";`);
  source = addImport(source, `import { formatTime, calculateFocusedSeconds } from "./timer.js";`);
  source = addImport(source, `import { setupNavigation } from "./navigation.js";`);
  source = addImport(source, `import { createOverlayController } from "./modals.js";`);
  source = addImport(source, `import { readFileAsDataUrl, loadImageSource } from "./portrait-files.js";`);
  source = addImport(source, `import { createPinnedRequestId } from "./questboard.js";`);

  source = source.replace(/const ERIS_PATCH_VERSION = "[^"]+";/, `const ERIS_PATCH_VERSION = APP_VERSION;`);

  source = source.replace(
    /\n\s*const activeOverlayLayers = new Set\(\);\s*\n/,
    `\n      const { setOverlayLayerVisible } = createOverlayController({ documentRef: document });\n`
  );

  for (const name of [
    "syncOverlayChrome",
    "setOverlayLayerVisible",
    "showScreen",
    "formatTime",
    "readFileAsDataUrl",
    "loadImageSource",
    "createPinnedRequestId",
    "callTool",
    "reportToolError",
    "getToolText",
  ]) {
    const result = removeFunction(source, name);
    source = result.source;
  }

  const navResult = removeStatement(source, "navButtons.forEach((button) => {");
  source = navResult.source;

  if (!source.includes("setupNavigation({ navButtons, appScreens })")) {
    const marker = `const appScreens = document.querySelectorAll(".app-screen");`;
    if (!source.includes(marker)) fail("Could not locate appScreens DOM lookup.");
    source = source.replace(
      marker,
      `${marker}\n      const { showScreen } = setupNavigation({ navButtons, appScreens });`
    );
  }

  const getFocusedReplacement = `      function getFocusedSeconds() {\n        return calculateFocusedSeconds({\n          timerRunning,\n          startTime,\n          accumulatedSeconds,\n        });\n      }`;
  const focusedResult = replaceFunction(source, "getFocusedSeconds", getFocusedReplacement);
  source = focusedResult.source;

  const apiMarker = `const API_BASE = window.location.origin;`;
  if (source.includes(apiMarker) && !source.includes("createApiClient({")) {
    source = source.replace(
      apiMarker,
      `${apiMarker}\n\n      const { callTool, reportToolError, getToolText } = createApiClient({\n        apiBase: API_BASE,\n        updateFromResponse,\n        onError: () => {\n          alert("That action could not be completed. Please try again.");\n        },\n      });`
    );
  }

  // Keep module import paths relative and browser-friendly.
  source = source.replace(/from "\.\/js\//g, `from "./`);

  return source;
}

function main() {
  if (!existsSync(APP_ENTRY_FILE)) fail(`Missing ${APP_ENTRY_FILE}. Run from the project root.`);
  if (!existsSync(APP_RUNTIME_FILE)) fail(`Missing ${APP_RUNTIME_FILE}. Apply patch 1.0006 before this patch.`);

  ensureDir(BACKUP_DIR);
  backupFile(APP_ENTRY_FILE);
  backupFile(APP_RUNTIME_FILE);
  backupFile(APP_HTML_FILE);
  for (const path of Object.keys(MODULE_FILES)) backupFile(path);

  for (const [path, content] of Object.entries(MODULE_FILES)) {
    writeFile(path, content);
  }

  writeFile(APP_ENTRY_FILE, `import "./js/main.js";\n`);

  const runtime = readFileSync(APP_RUNTIME_FILE, "utf8");
  const patchedRuntime = patchRuntime(runtime);
  writeFile(APP_RUNTIME_FILE, patchedRuntime);

  if (existsSync(APP_HTML_FILE)) {
    const html = readFileSync(APP_HTML_FILE, "utf8").replace(
      /<meta name="eris-app-version" content="[^"]+" \/>/,
      `<meta name="eris-app-version" content="${PATCH_VERSION}" />`
    );
    writeFile(APP_HTML_FILE, html);
  }

  console.log(`Applied Eris-Touched deep extraction patch ${PATCH_VERSION}.`);
  console.log(`Backups saved in ${BACKUP_DIR}`);
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
