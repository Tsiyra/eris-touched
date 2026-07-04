import { createServer } from "node:http";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  writeFileSync,
} from "node:fs";
import { extname, join } from "node:path";
import { pathToFileURL } from "node:url";
import {
  registerAppResource,
  registerAppTool,
  RESOURCE_MIME_TYPE,
} from "@modelcontextprotocol/ext-apps/server";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";

const PUBLIC_DIR = "public";
const appHtml = readFileSync(join(PUBLIC_DIR, "app-web.html"), "utf8");
const APP_URI = "ui://widget/eris-focus.html";
const ERIS_PATCH_VERSION = "1.0001";

const DATA_DIR = process.env.ERIS_DATA_DIR ?? "data";
const SAVE_FILE = join(DATA_DIR, "save.json");
const SAVE_TEMP_FILE = join(DATA_DIR, "save.tmp.json");
const SERVER_HOST = process.env.HOST ?? "127.0.0.1";
const DEFAULT_PORT = Number(process.env.PORT ?? 8787);
const MCP_PATH = "/mcp";
const CONFIGURED_ALLOWED_ORIGINS = new Set(
  (process.env.ALLOWED_ORIGINS ?? "unwired-schilling-procurer.ngrok-free.dev")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
);
const OPENAI_IMAGE_MODEL = process.env.OPENAI_IMAGE_MODEL ?? "gpt-image-2";
const OPENAI_IMAGE_SIZE = process.env.OPENAI_IMAGE_SIZE ?? "1024x1024";
const IMAGE_GENERATION_SERVICE = process.env.IMAGE_GENERATION_SERVICE ?? "openai";
const STABLE_DIFFUSION_URL = process.env.STABLE_DIFFUSION_URL ?? "http://127.0.0.1:7860";
const STORY_GENERATION_SERVICE = process.env.STORY_GENERATION_SERVICE ?? "template";
const OLLAMA_URL = process.env.OLLAMA_URL ?? "http://127.0.0.1:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL ?? "llama3";
const DEFAULT_CHARACTER_RACE = "Human";
const DEFAULT_HAIR_COLOR = "Black";
const DEFAULT_SKIN_COLOR = "Olive";
const THEROS_PORTRAIT_STYLE =
  "Theros/Greece god portrait style: square bust portrait, polished anime-inspired fantasy character art with watercolor-and-ink texture, expressive face, crisp dark linework, translucent watercolor washes, gold ornamental details, Greek mythic clothing and jewelry, luminous divine halo or sigil behind the head, swirling magical energy, soft parchment-like rough painted border, ancient Greek ruins or symbolic mythic motifs in the background, subtle glittering specks, dramatic but elegant lighting, no text, no watermark.";

let currentQuest = null;
let questLog = [];
let nextQuestId = 1;
let pendingNpcChoices = [];
let knownNpcs = [];
let storyChapters = [];
let appSettings = {
  storyTone: "epic_heroic",
  overarchingGoal: "Build better habits",
};
let character = {
  name: "Eris-Touched Hero",
  description:
    "A fantasy adventurer touched by Eris, learning to turn chaos into quests.",
  portraitPrompt: createPortraitPrompt(
    "Eris-Touched Hero",
    "A fantasy adventurer touched by Eris, learning to turn chaos into quests.",
    DEFAULT_CHARACTER_RACE,
    DEFAULT_HAIR_COLOR,
    DEFAULT_SKIN_COLOR
  ),
  portraitImageUrl: "",
  outfitName: "Hero Starter Outfit",
  race: DEFAULT_CHARACTER_RACE,
  hairColor: DEFAULT_HAIR_COLOR,
  skinColor: DEFAULT_SKIN_COLOR,
};
let player = {
  name: "Eris-Touched Hero",
  level: 1,
  totalXp: 0,
  completedQuests: 0,
  coins: 0,
  inventory: [],
};

function ensureDataFolder() {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR);
  }
}

function backupInvalidSave() {
  if (!existsSync(SAVE_FILE)) {
    return;
  }

  const backupFile = join(DATA_DIR, `save.invalid-${Date.now()}.json`);
  copyFileSync(SAVE_FILE, backupFile);
}

function toFiniteNumber(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function clampNumber(value, min, max, fallback) {
  const number = toFiniteNumber(value, fallback);
  return Math.max(min, Math.min(max, number));
}

function isValidHttpUrl(value) {
  if (typeof value !== "string" || value.trim().length === 0) {
    return false;
  }

  try {
    const url = new URL(value.trim());
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function isValidImageDataUrl(value) {
  return (
    typeof value === "string" &&
    /^data:image\/(?:png|jpeg|jpg|webp);base64,[a-z0-9+/=]+$/i.test(value)
  );
}

function isValidPortraitImageSource(value) {
  return isValidHttpUrl(value) || isValidImageDataUrl(value);
}

function parseOptionalPortraitImageSource(value, fallback = "") {
  if (value === undefined) {
    return { ok: true, value: fallback };
  }

  const trimmed = value?.trim?.() ?? "";
  if (!trimmed) {
    return { ok: true, value: "" };
  }

  if (!isValidPortraitImageSource(trimmed)) {
    return {
      ok: false,
      value: fallback,
      message: "Portrait image must be an uploaded PNG, JPEG, or WebP image.",
    };
  }

  return { ok: true, value: trimmed };
}

function cleanCharacterOption(value, fallback) {
  const trimmed = typeof value === "string" ? value.trim() : "";
  return trimmed || fallback;
}

function saveGame() {
  ensureDataFolder();

  const saveData = {
    currentQuest,
    questLog,
    nextQuestId,
    pendingNpcChoices,
    knownNpcs,
    storyChapters,
    appSettings,
    character,
    player,
    appVersion: ERIS_PATCH_VERSION,
    savedAt: new Date().toISOString(),
  };

  writeFileSync(SAVE_TEMP_FILE, JSON.stringify(saveData, null, 2), "utf8");
  renameSync(SAVE_TEMP_FILE, SAVE_FILE);
}

function loadGame() {
  ensureDataFolder();

  if (!existsSync(SAVE_FILE)) {
    saveGame();
    return;
  }

  try {
    const rawSave = readFileSync(SAVE_FILE, "utf8");
    const saveData = JSON.parse(rawSave);

    currentQuest = saveData.currentQuest ?? null;
    questLog = Array.isArray(saveData.questLog) ? saveData.questLog : [];
    nextQuestId = Math.max(1, Math.floor(toFiniteNumber(saveData.nextQuestId, 1)));

    pendingNpcChoices = Array.isArray(saveData.pendingNpcChoices)
      ? saveData.pendingNpcChoices
      : [];

    knownNpcs = Array.isArray(saveData.knownNpcs) ? saveData.knownNpcs : [];
    storyChapters = Array.isArray(saveData.storyChapters)
      ? saveData.storyChapters
      : [];
    appSettings = {
      storyTone: isValidStoryTone(saveData.appSettings?.storyTone)
        ? saveData.appSettings.storyTone
        : "epic_heroic",
      overarchingGoal:
        typeof saveData.appSettings?.overarchingGoal === "string" &&
        saveData.appSettings.overarchingGoal.trim().length > 0
          ? saveData.appSettings.overarchingGoal.trim()
          : "Build better habits",
    };
    character = {
      name: saveData.character?.name ?? "Eris-Touched Hero",
      description:
        saveData.character?.description ??
        "A fantasy adventurer touched by Eris, learning to turn chaos into quests.",
      portraitPrompt:
        saveData.character?.portraitPrompt ??
        createPortraitPrompt(
          saveData.character?.name ?? "Eris-Touched Hero",
          saveData.character?.description ??
            "A fantasy adventurer touched by Eris, learning to turn chaos into quests.",
          saveData.character?.race ?? DEFAULT_CHARACTER_RACE,
          saveData.character?.hairColor ?? DEFAULT_HAIR_COLOR,
          saveData.character?.skinColor ?? DEFAULT_SKIN_COLOR
        ),
      portraitImageUrl: isValidPortraitImageSource(saveData.character?.portraitImageUrl)
        ? saveData.character.portraitImageUrl.trim()
        : "",
      outfitName:
        typeof saveData.character?.outfitName === "string" &&
        saveData.character.outfitName.trim().length > 0
          ? saveData.character.outfitName.trim()
          : "Hero Starter Outfit",
      race: cleanCharacterOption(saveData.character?.race, DEFAULT_CHARACTER_RACE),
      hairColor: cleanCharacterOption(
        saveData.character?.hairColor,
        DEFAULT_HAIR_COLOR
      ),
      skinColor: cleanCharacterOption(
        saveData.character?.skinColor,
        DEFAULT_SKIN_COLOR
      ),
    };
    player = {
      name: saveData.player?.name ?? "Eris-Touched Hero",
      level: Math.max(1, Math.floor(toFiniteNumber(saveData.player?.level, 1))),
      totalXp: Math.max(0, Math.floor(toFiniteNumber(saveData.player?.totalXp, 0))),
      completedQuests: Math.max(
        0,
        Math.floor(toFiniteNumber(saveData.player?.completedQuests, 0))
      ),
      coins: Math.max(0, Math.floor(toFiniteNumber(saveData.player?.coins, 0))),
      inventory: Array.isArray(saveData.player?.inventory)
        ? saveData.player.inventory
        : [],
    };
  } catch (error) {
    console.error("Could not load save file:", error);
    backupInvalidSave();
    saveGame();
  }
}

loadGame();

const lootSchema = z.object({
  name: z.string(),
  rarity: z.string(),
  goldBonus: z.number().optional(),
  xpBonus: z.number().optional(),
  coins: z.number().optional(),
});

const playerSchema = z.object({
  name: z.string(),
  level: z.number(),
  totalXp: z.number(),
  completedQuests: z.number(),
  coins: z.number(),
  inventory: z.array(lootSchema),
});

const questSchema = z.object({
  id: z.string(),
  task: z.string(),
  plannedMinutes: z.number(),
  startedAt: z.string(),
  status: z.string(),
  actualMinutes: z.number().optional(),
  xp: z.number().optional(),
  coins: z.number().optional(),
  rarity: z.string().optional(),
  loot: z.string().optional(),
  hasItem: z.boolean().optional(),
  rewardSummary: z.string().optional(),
  story: z.string().optional(),
});
const storyChapterSchema = z.object({
  id: z.string(),
  title: z.string(),
  questTask: z.string(),
  minutes: z.number(),
  coins: z.number().optional(),
  rarity: z.string(),
  loot: z.string(),
  hasItem: z.boolean().optional(),
  rewardSummary: z.string().optional(),
  xp: z.number(),
  body: z.string(),
  createdAt: z.string(),
});
const appSettingsSchema = z.object({
  storyTone: z.string(),
  overarchingGoal: z.string(),
});
const characterSchema = z.object({
  name: z.string(),
  description: z.string(),
  portraitPrompt: z.string(),
  portraitImageUrl: z.string(),
  outfitName: z.string(),
  race: z.string(),
  hairColor: z.string(),
  skinColor: z.string(),
});
const npcSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  description: z.string(),
  storyHook: z.string(),
});

const questOutputSchema = {
  quest: questSchema.nullable(),
  log: z.array(z.string()),
  player: playerSchema,
  pendingNpcChoices: z.array(npcSchema),
  knownNpcs: z.array(npcSchema),
  character: characterSchema,
  storyChapters: z.array(storyChapterSchema),
  appSettings: appSettingsSchema,
  appVersion: z.string().optional(),
};

const startQuestInputSchema = {
  task: z.string().min(1),
  plannedMinutes: z.number().min(1).max(600),
};

const completeQuestInputSchema = {
  actualMinutes: z.number().min(0).max(600).optional(),
};

const chooseNpcInputSchema = {
  npcId: z.string().min(1),
};
const updateCharacterInputSchema = {
  name: z.string().min(1).max(60),
  description: z.string().min(1).max(1000),
  portraitImageUrl: z.string().max(1500000).optional(),
  outfitName: z.string().max(120).optional(),
  race: z.string().min(1).max(80).optional(),
  hairColor: z.string().min(1).max(80).optional(),
  skinColor: z.string().min(1).max(80).optional(),
};
const updateSettingsInputSchema = {
  storyTone: z.string().min(1).max(40).optional(),
  overarchingGoal: z.string().min(1).max(200).optional(),
};
const emptyInputSchema = {};

function getLevelFromXp(totalXp) {
  if (totalXp >= 3000) return 10;
  if (totalXp >= 2400) return 9;
  if (totalXp >= 1900) return 8;
  if (totalXp >= 1450) return 7;
  if (totalXp >= 1050) return 6;
  if (totalXp >= 700) return 5;
  if (totalXp >= 420) return 4;
  if (totalXp >= 220) return 3;
  if (totalXp >= 90) return 2;
  return 1;
}

function getInventoryGoldBonusPercent() {
  return player.inventory.reduce((total, item) => {
    return total + Number(item.goldBonus ?? item.xpBonus ?? 0);
  }, 0);
}

function isValidStoryTone(tone) {
  return [
    "cozy_mythic",
    "epic_heroic",
    "dramatic",
    "funny_chaos",
    "dark_mythic",
  ].includes(tone);
}

function getStoryToneLabel(storyTone) {
  const labels = {
    cozy_mythic: "Cozy Mythic",
    epic_heroic: "Epic Heroic",
    dramatic: "Dramatic",
    funny_chaos: "Funny Chaos",
    dark_mythic: "Dark Mythic",
  };

  return labels[storyTone] ?? "Epic Heroic";
}

function reply(message) {
  return {
    content: message ? [{ type: "text", text: message }] : [],
    structuredContent: {
      quest: currentQuest,
      log: questLog,
      player,
      pendingNpcChoices,
      knownNpcs,
      character,
      storyChapters,
      appSettings,
      appVersion: ERIS_PATCH_VERSION,
    },
  };
}

const ITEM_POOL = {
  Common: [
    "Copper Token of Beginning",
    "Rusty Key of Small Tasks",
    "Pebble of Persistence",
    "Thread of Focus",
    "Dried Herb of Calm",
  ],
  Uncommon: [
    "Charm of Ordered Chaos",
    "Silver Coin of Progress",
    "Minor Potion of Clarity",
    "Whetstone of Sharp Mind",
    "Lantern of Small Victories",
  ],
  Rare: [
    "Cloak of the Restless Muse",
    "Golden Coin of Achievement",
    "Gem of Steady Hand",
    "Scroll of Wisdom",
    "Compass of Direction",
  ],
  Epic: [
    "Mantle of the Many-Threaded Mind",
    "Platinum Coin of Mastery",
    "Crown of Focused Will",
    "Scepter of Command",
    "Orb of Insight",
  ],
  Legendary: [
    "Golden Apple of Unbroken Focus",
    "Celestial Coin of Legend",
    "Heart of the Dragon",
    "Staff of Eternal Focus",
    "Crown of the Guildmaster",
  ],
};

const REWARD_RARITY_PROBABILITIES = [
  {
    minMinutes: 60,
    rarityWeights: [
      { rarity: "Common", weight: 0.05 },
      { rarity: "Uncommon", weight: 0.1 },
      { rarity: "Rare", weight: 0.2 },
      { rarity: "Epic", weight: 0.3 },
      { rarity: "Legendary", weight: 0.35 },
    ],
  },
  {
    minMinutes: 45,
    rarityWeights: [
      { rarity: "Common", weight: 0.1 },
      { rarity: "Uncommon", weight: 0.2 },
      { rarity: "Rare", weight: 0.35 },
      { rarity: "Epic", weight: 0.25 },
      { rarity: "Legendary", weight: 0.1 },
    ],
  },
  {
    minMinutes: 30,
    rarityWeights: [
      { rarity: "Common", weight: 0.2 },
      { rarity: "Uncommon", weight: 0.4 },
      { rarity: "Rare", weight: 0.25 },
      { rarity: "Epic", weight: 0.12 },
      { rarity: "Legendary", weight: 0.03 },
    ],
  },
  {
    minMinutes: 15,
    rarityWeights: [
      { rarity: "Common", weight: 0.88 },
      { rarity: "Uncommon", weight: 0.099 },
      { rarity: "Rare", weight: 0.01 },
      { rarity: "Epic", weight: 0.0009 },
      { rarity: "Legendary", weight: 0.0001 },
    ],
  },
  {
    minMinutes: 0,
    rarityWeights: [
      { rarity: "Common", weight: 0.95 },
      { rarity: "Uncommon", weight: 0.045 },
      { rarity: "Rare", weight: 0.005 },
      { rarity: "Epic", weight: 0 },
      { rarity: "Legendary", weight: 0 },
    ],
  },
];

const GOLD_BONUSES_BY_RARITY = {
  Common: 1,
  Uncommon: 3,
  Rare: 5,
  Epic: 7,
  Legendary: 10,
};

function getRewardTier(minutes) {
  if (minutes >= 60) return 60;
  if (minutes >= 45) return 45;
  if (minutes >= 30) return 30;
  if (minutes >= 15) return 15;
  return 0;
}

function pickWeightedOption(options, rng = Math.random) {
  const roll = rng();
  let total = 0;

  for (const option of options) {
    total += option.weight;
    if (roll < total) {
      return option.value;
    }
  }

  return options.at(-1)?.value;
}

function getRewardSummary(reward) {
  if (reward.hasItem) {
    return `${reward.coins} Guild Coins and ${reward.rarity} loot: ${reward.loot}`;
  }

  return `${reward.coins} Guild Coins`;
}

function chooseReward(minutes, rng = Math.random) {
  const normalizedMinutes = Math.max(0, Math.floor(minutes));
  const baseCoins = Math.round(normalizedMinutes * 10);
  const baseXp = Math.max(5, Math.round(normalizedMinutes * 8));
  const tier = getRewardTier(normalizedMinutes);
  const tierConfig = REWARD_RARITY_PROBABILITIES.find(
    (entry) => entry.minMinutes === tier
  );

  const rarity = pickWeightedOption(
    tierConfig.rarityWeights.map((entry) => ({
      value: entry.rarity,
      weight: entry.weight,
    })),
    rng
  );

  const pool = ITEM_POOL[rarity];
  const item = pool[Math.floor(rng() * pool.length)];

  return {
    rarity,
    loot: item,
    coins: baseCoins,
    xp: baseXp,
    goldBonus: GOLD_BONUSES_BY_RARITY[rarity],
    hasItem: true,
    rewardSummary: getRewardSummary({
      hasItem: true,
      coins: baseCoins,
      rarity,
      loot: item,
    }),
  };
}
async function createQuestOpening(task) {
  const service = STORY_GENERATION_SERVICE.toLowerCase();

  if (service === "ollama") {
    return await generateQuestOpeningWithOllama(task);
  }

  return (
    `A new request is pulled from the guild questboard: ${task}. ` +
    `The Eris-Touched hero accepts the posting, not because it is the whole story, ` +
    `but because every completed request strengthens the road toward the Guild Charter: ${appSettings.overarchingGoal}.`
  );
}

async function generateQuestOpeningWithOllama(task) {
  try {
    const response = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt: `Write a brief, atmospheric fantasy RPG opening (2-3 sentences) for a hero accepting a guild quest. The quest task is: "${task}". The hero's overarching goal is: "${appSettings.overarchingGoal}". The story tone is: ${appSettings.storyTone}. Keep it concise and evocative.`,
        stream: false,
        options: {
          temperature: 0.7,
          max_tokens: 150,
        },
      }),
    });

    if (!response.ok) {
      console.error("Ollama API error:", response.status);
      return getTemplateQuestOpening(task);
    }

    const body = await response.json();
    const generatedText = body?.response?.trim() || "";

    if (generatedText) {
      return generatedText;
    }

    return getTemplateQuestOpening(task);
  } catch (error) {
    console.error("Ollama generation error:", error);
    return getTemplateQuestOpening(task);
  }
}

function getTemplateQuestOpening(task) {
  return (
    `A new request is pulled from the guild questboard: ${task}. ` +
    `The Eris-Touched hero accepts the posting, not because it is the whole story, ` +
    `but because every completed request strengthens the road toward the Guild Charter: ${appSettings.overarchingGoal}.`
  );
}

function createChapterTitle(task, minutes, rarity) {
  const cleanedTask = task
    .replace(/[^\w\s]/g, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 4)
    .join(" ");

  if (rarity === "Legendary") {
    return `Legendary Guild Request: ${cleanedTask || "The Unbroken Thread"}`;
  }

  if (minutes >= 30) {
    return `Request Report ${storyChapters.length + 1}: ${
      cleanedTask || "A Thread of Focus"
    }`;
  }

  return `Small Request ${storyChapters.length + 1}: ${
    cleanedTask || "The Brave Beginning"
  }`;
}

async function createStoryChapter(task, minutes, reward, finalXp, knownNpcs, storyTone) {
  const title = createChapterTitle(task, minutes, reward.rarity);
  const service = STORY_GENERATION_SERVICE.toLowerCase();

  let body;
  if (service === "ollama") {
    body = await generateStoryChapterWithOllama(task, minutes, reward, finalXp, knownNpcs, storyTone);
  } else {
    body = getTemplateStoryChapter(task, minutes, reward, finalXp, knownNpcs, storyTone);
  }

  return {
    id: `chapter-${Date.now()}`,
    title,
    questTask: task,
    minutes,
    coins: reward.coins,
    rarity: reward.rarity,
    loot: reward.loot,
    hasItem: reward.hasItem,
    rewardSummary: reward.rewardSummary ?? getRewardSummary(reward),
    xp: finalXp,
    body,
    createdAt: new Date().toISOString(),
  };
}

async function generateStoryChapterWithOllama(task, minutes, reward, finalXp, knownNpcs, storyTone) {
  const npcInfo = knownNpcs.length > 0
    ? `${knownNpcs[0].name}, the ${knownNpcs[0].role}, is present.`
    : "No companion has joined yet.";

  try {
    const response = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt: `Write a brief fantasy RPG story chapter (3-4 sentences) about completing a quest. Quest task: "${task}". Duration: ${minutes} minutes. Reward: ${reward.rewardSummary ?? getRewardSummary(reward)}. XP earned: ${finalXp}. Hero's goal: "${appSettings.overarchingGoal}". Story tone: ${storyTone}. ${npcInfo} Keep it atmospheric and concise.`,
        stream: false,
        options: {
          temperature: 0.8,
          max_tokens: 200,
        },
      }),
    });

    if (!response.ok) {
      console.error("Ollama API error:", response.status);
      return getTemplateStoryChapter(task, minutes, reward, finalXp, knownNpcs, storyTone);
    }

    const body = await response.json();
    const generatedText = body?.response?.trim() || "";

    if (generatedText) {
      return generatedText;
    }

    return getTemplateStoryChapter(task, minutes, reward, finalXp, knownNpcs, storyTone);
  } catch (error) {
    console.error("Ollama generation error:", error);
    return getTemplateStoryChapter(task, minutes, reward, finalXp, knownNpcs, storyTone);
  }
}

function getTemplateStoryChapter(task, minutes, reward, finalXp, knownNpcs, storyTone) {
  const npcLine =
    knownNpcs.length > 0
      ? ` ${knownNpcs[0].name}, the ${knownNpcs[0].role}, watches this moment and begins to understand how the hero turns disorder into motion.`
      : " No companion has joined the road yet, so the victory echoes quietly through the hero's own thoughts.";

  let toneLine = "";
  if (storyTone === "cozy_mythic") {
    toneLine =
      " The victory felt warm and small in the best way, like a lantern kept lit on a difficult evening.";
  } else if (storyTone === "dramatic") {
    toneLine =
      " The moment struck like a vow made beneath storm clouds, fragile but fiercely kept.";
  } else if (storyTone === "funny_chaos") {
    toneLine =
      " Somewhere, chaos tripped over its own sandals, and the hero got to count that as a win.";
  } else if (storyTone === "dark_mythic") {
    toneLine =
      " In the shadowed places of the mind, the victory burned like a defiant ember.";
  } else {
    toneLine =
      " The deed joined the hero's growing legend, another thread in a myth still being written.";
  }

  return (
    `The guild request was simple: ${task}. It was only one posting on the board, but it still mattered. ` +
    `Each completed request trains the hero toward the Guild Charter: ${appSettings.overarchingGoal}. ` +
    `For ${minutes} minute${minutes === 1 ? "" : "s"}, the hero turned attention and effort into progress. ` +
    `When the work was done, the board marked it fulfilled, and the guild issued ${reward.rewardSummary ?? getRewardSummary(reward)} as a sign of success. ` +
    toneLine +
    npcLine
  );
}

function createQuestCompletionStory(task, minutes, reward, goldBonusPercent, finalCoins) {
  const bonusText =
    goldBonusPercent > 0
      ? ` The hero's gathered fortune resonated, increasing the coin reward to ${finalCoins} Guild Coins.`
      : "";

  if (minutes >= 60) {
    return (
      `Legendary guild request completed: ${task}. For ${minutes} minutes, the hero ` +
      `fulfilled the posting with heroic focus. The guild issued ${reward.rewardSummary ?? getRewardSummary(reward)}, ` +
      `a sign that the charter's work is being honored.` +
      bonusText
    );
  }

  if (minutes >= 30) {
    return (
      `Guild request completed: ${task}. For ${minutes} minutes, the hero carried ` +
      `out the task from the board and earned ${reward.rewardSummary ?? getRewardSummary(reward)}.` +
      bonusText
    );
  }

  return (
    `Request completed: ${task}. For ${minutes} minutes, the hero made a brave ` +
    `turn-in to the guild board. The reward was ${reward.rewardSummary ?? getRewardSummary(reward)}.` +
    bonusText
  );
}

function shouldOfferNpcChoice() {
  return (
    player.completedQuests > 0 &&
    player.completedQuests % 3 === 0 &&
    pendingNpcChoices.length === 0
  );
}
function createPortraitPrompt(
  name,
  description,
  race = DEFAULT_CHARACTER_RACE,
  hairColor = DEFAULT_HAIR_COLOR,
  skinColor = DEFAULT_SKIN_COLOR
) {
  return (
    `Create a square bust portrait of ${name}, an Eris-Touched focus RPG hero. ` +
    `Character details: ${description} Race/species: ${race}. Hair color: ${hairColor}. Skin color: ${skinColor}. ` +
    `The character should feel heroic, personal, magical, and touched by chaos. ` +
    THEROS_PORTRAIT_STYLE
  );
}

async function generatePortraitImage(prompt) {
  const service = IMAGE_GENERATION_SERVICE.toLowerCase();

  if (service === "stable-diffusion") {
    return await generatePortraitWithStableDiffusion(prompt);
  }

  if (service === "openai") {
    return await generatePortraitWithOpenAI(prompt);
  }

  return {
    ok: false,
    message: `Unsupported image generation service: ${IMAGE_GENERATION_SERVICE}. Set IMAGE_GENERATION_SERVICE to 'openai' or 'stable-diffusion'.`,
  };
}

async function generatePortraitWithOpenAI(prompt) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return {
      ok: false,
      message:
        "OpenAI portrait generation needs OPENAI_API_KEY on the app server. Set IMAGE_GENERATION_SERVICE=stable-diffusion to use local Stable Diffusion instead.",
    };
  }

  let response;

  try {
    response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: OPENAI_IMAGE_MODEL,
        prompt,
        size: OPENAI_IMAGE_SIZE,
        quality: "medium",
        n: 1,
      }),
    });
  } catch (error) {
    return {
      ok: false,
      message: `Could not reach OpenAI image generation: ${error.message}`,
    };
  }

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      body?.error?.message ??
      `OpenAI image generation failed with status ${response.status}.`;
    return { ok: false, message };
  }

  const image = body?.data?.[0];
  if (!image?.b64_json) {
    return {
      ok: false,
      message: "OpenAI did not return image data for this portrait request.",
    };
  }

  return {
    ok: true,
    imageUrl: `data:image/png;base64,${image.b64_json}`,
    prompt: image.revised_prompt ?? prompt,
  };
}

async function generatePortraitWithStableDiffusion(prompt) {
  const sdUrl = STABLE_DIFFUSION_URL;

  try {
    const response = await fetch(`${sdUrl}/sdapi/v1/txt2img`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        prompt: prompt,
        negative_prompt: "text, watermark, signature, low quality, blurry, distorted",
        steps: 30,
        width: 1024,
        height: 1024,
        cfg_scale: 7,
        sampler_name: "DPM++ 2M Karras",
      }),
    });

    if (!response.ok) {
      return {
        ok: false,
        message: `Stable Diffusion API returned status ${response.status}. Make sure Stable Diffusion WebUI is running at ${sdUrl}`,
      };
    }

    const body = await response.json().catch(() => ({}));

    if (!body?.images || !body.images[0]) {
      return {
        ok: false,
        message: "Stable Diffusion did not return image data.",
      };
    }

    return {
      ok: true,
      imageUrl: `data:image/png;base64,${body.images[0]}`,
      prompt: prompt,
    };
  } catch (error) {
    return {
      ok: false,
      message: `Could not reach Stable Diffusion at ${sdUrl}: ${error.message}. Make sure Stable Diffusion WebUI is running with --api flag.`,
    };
  }
}
function generateNpcChoices() {
  const npcSetNumber = knownNpcs.length + pendingNpcChoices.length + 1;

  pendingNpcChoices = [
    {
      id: `npc-${Date.now()}-mentor`,
      name: `Thaleia Threadkeeper ${npcSetNumber}`,
      role: "Guild Mentor",
      description:
        "A calm guild archivist who teaches the hero how to turn questboard requests into reliable habit.",
      storyHook:
        "Thaleia offers to help the hero name the next request hidden on the board.",
    },
    {
      id: `npc-${Date.now()}-rival`,
      name: `Makar Quickstep ${npcSetNumber}`,
      role: "Guild Rival",
      description:
        "A competitive quest runner who treats every board request as a challenge to outdo the guild.",
      storyHook:
        "Makar challenges the hero to prove that steady focus can beat raw speed in the guild ranks.",
    },
    {
      id: `npc-${Date.now()}-friend`,
      name: `Ione Lantern-Bearer ${npcSetNumber}`,
      role: "Guild Companion",
      description:
        "A warm-hearted guildmate who carries a little lantern said to glow brighter near honest effort.",
      storyHook:
        "Ione offers companionship on days when accepting a guild request feels harder than turning it in.",
    },
  ];
}

// Standalone tool functions for HTTP API
async function startQuestTool(args) {
  const task = args?.task?.trim?.() ?? "";
  const plannedMinutes = clampNumber(args?.plannedMinutes, 1, 600, 25);

  if (!task) {
    return reply("Missing quest task.");
  }

  if (currentQuest?.status === "active") {
    return reply(
      `A request is already active: ${currentQuest.task}. Turn it in before accepting another.`
    );
  }

  currentQuest = {
    id: `quest-${nextQuestId++}`,
    task,
    plannedMinutes,
    startedAt: new Date().toISOString(),
    status: "active",
  };

  const opening = await createQuestOpening(task);
  questLog = [opening, ...questLog].slice(0, 12);

  saveGame();

  return reply(`Started focus quest: ${task}`);
}

async function finalizeQuestCompletion(actualMinutes) {
  if (!currentQuest) {
    return { ok: false, message: "There is no active quest to complete." };
  }

  if (currentQuest.status !== "active") {
    return { ok: false, message: "The current request has already been completed." };
  }

  const reward = chooseReward(actualMinutes);
  const goldBonusPercent = getInventoryGoldBonusPercent();
  const finalCoins = Math.round(reward.coins * (1 + goldBonusPercent / 100));
  const finalXp = reward.xp;
  const rewardSummary = getRewardSummary({
    ...reward,
    coins: finalCoins,
  });

  const story = createQuestCompletionStory(
    currentQuest.task,
    actualMinutes,
    {
      ...reward,
      coins: finalCoins,
      rewardSummary,
    },
    goldBonusPercent,
    finalCoins
  );

  currentQuest = {
    ...currentQuest,
    status: "completed",
    actualMinutes,
    xp: finalXp,
    coins: finalCoins,
    rarity: reward.rarity,
    loot: reward.loot,
    hasItem: reward.hasItem,
    rewardSummary,
    story,
  };

  player.totalXp += finalXp;
  player.completedQuests += 1;
  player.coins += finalCoins;
  player.level = getLevelFromXp(player.totalXp);

  if (reward.hasItem) {
    player.inventory = [
      {
        name: reward.loot,
        rarity: reward.rarity,
        goldBonus: reward.goldBonus,
      },
      ...player.inventory,
    ].slice(0, 20);
  }

  questLog = [story, ...questLog].slice(0, 12);

  const chapter = await createStoryChapter(
    currentQuest.task,
    actualMinutes,
    {
      ...reward,
      coins: finalCoins,
      rewardSummary,
    },
    finalXp,
    knownNpcs,
    appSettings.storyTone
  );

  storyChapters = [chapter, ...storyChapters].slice(0, 30);

  if (shouldOfferNpcChoice()) {
    generateNpcChoices();

    questLog = [
      "A new figure waits at the edge of the story. Choose who enters your journey next.",
      ...questLog,
    ].slice(0, 12);
  }

  saveGame();

  return {
    ok: true,
    message: `Completed quest. Awarded ${rewardSummary}; ${finalXp} XP gained.`,
  };
}

async function completeQuestTool(args) {
  if (!currentQuest) {
    return reply("There is no active quest to complete.");
  }

  if (currentQuest.status !== "active") {
    return reply("The current request has already been completed.");
  }

  const actualMinutes = clampNumber(
    args?.actualMinutes,
    0,
    600,
    currentQuest.plannedMinutes
  );
  const result = await finalizeQuestCompletion(actualMinutes);

  return reply(result.message);
}

async function updateCharacterTool(args) {
  const name = args?.name?.trim?.() ?? "Eris-Touched Hero";
  const description =
    args?.description?.trim?.() ??
    "A fantasy adventurer touched by Eris, learning to turn chaos into quests.";
  const race = cleanCharacterOption(args?.race, character.race);
  const hairColor = cleanCharacterOption(args?.hairColor, character.hairColor);
  const skinColor = cleanCharacterOption(args?.skinColor, character.skinColor);
  const portraitImageUrl = parseOptionalPortraitImageSource(
    args?.portraitImageUrl,
    character.portraitImageUrl
  );

  if (!portraitImageUrl.ok) {
    return reply(portraitImageUrl.message);
  }

  character = {
    name,
    description,
    portraitPrompt: createPortraitPrompt(
      name,
      description,
      race,
      hairColor,
      skinColor
    ),
    portraitImageUrl: portraitImageUrl.value,
    outfitName:
      args?.outfitName?.trim?.() ||
      character.outfitName ||
      "Hero Starter Outfit",
    race,
    hairColor,
    skinColor,
  };

  player.name = name;

  questLog = [
    `Character updated: ${name}. ${description}`,
    ...questLog,
  ].slice(0, 12);

  saveGame();

  return reply(`Updated character: ${name}`);
}

async function generatePortraitTool(args) {
  const prompt = character.portraitPrompt || createPortraitPrompt(
    character.name,
    character.description,
    character.race,
    character.hairColor,
    character.skinColor
  );
  const result = await generatePortraitImage(prompt);

  if (!result.ok) {
    return reply(result.message);
  }

  character = {
    ...character,
    portraitPrompt: result.prompt,
    portraitImageUrl: result.imageUrl,
  };

  questLog = [
    `Generated a new portrait for ${character.name}.`,
    ...questLog,
  ].slice(0, 12);

  saveGame();

  return reply(`Generated a new portrait for ${character.name}.`);
}

async function updateSettingsTool(args) {
  const requestedTone = args?.storyTone?.trim?.() ?? undefined;
  const requestedGoal = args?.overarchingGoal?.trim?.();
  const logEntries = [];

  if (requestedTone !== undefined) {
    if (!isValidStoryTone(requestedTone)) {
      return reply("Invalid story tone.");
    }

    appSettings.storyTone = requestedTone;
    logEntries.push(`Story tone changed to ${getStoryToneLabel(requestedTone)}.`);
  }

  if (requestedGoal) {
    appSettings.overarchingGoal = requestedGoal;
    logEntries.push(`Guild charter updated: ${requestedGoal}.`);
  }

  if (!logEntries.length) {
    return reply("No settings were changed.");
  }

  questLog = [...logEntries, ...questLog].slice(0, 12);
  saveGame();

  return reply("Updated settings.");
}

async function chooseNpcTool(args) {
  const npcId = args?.npcId;
  const chosenNpc = pendingNpcChoices.find((npc) => npc.id === npcId);

  if (!chosenNpc) {
    return reply("That NPC choice is no longer available.");
  }

  knownNpcs = [chosenNpc, ...knownNpcs].slice(0, 12);
  pendingNpcChoices = [];

  questLog = [
    `${chosenNpc.name}, the ${chosenNpc.role}, has entered the story. ${chosenNpc.storyHook}`,
    ...questLog,
  ].slice(0, 12);

  saveGame();

  return reply(`Chose NPC: ${chosenNpc.name}`);
}

function createErisServer() {
  const server = new McpServer({
    name: "eris-touched-focus-rpg",
    version: "0.5.0",
  });

  registerAppResource(
    server,
    "eris-focus-widget",
    APP_URI,
    {},
    async () => ({
      contents: [
        {
          uri: APP_URI,
          mimeType: RESOURCE_MIME_TYPE,
          text: appHtml,
        },
      ],
    })
  );
  registerAppTool(
    server,
    "update_character",
    {
      title: "Update Character",
      description:
        "Updates the Eris-Touched hero's name, description, and portrait prompt.",
      inputSchema: updateCharacterInputSchema,
      outputSchema: questOutputSchema,
      _meta: {
        ui: { resourceUri: APP_URI },
      },
    },
    async (args) => {
      const name = args?.name?.trim?.() ?? "Eris-Touched Hero";
      const description =
        args?.description?.trim?.() ??
        "A fantasy adventurer touched by Eris, learning to turn chaos into quests.";
      const race = cleanCharacterOption(args?.race, character.race);
      const hairColor = cleanCharacterOption(args?.hairColor, character.hairColor);
      const skinColor = cleanCharacterOption(args?.skinColor, character.skinColor);
      const portraitImageUrl = parseOptionalPortraitImageSource(
        args?.portraitImageUrl,
        character.portraitImageUrl
      );

      if (!portraitImageUrl.ok) {
        return reply(portraitImageUrl.message);
      }

      character = {
        name,
        description,
        portraitPrompt: createPortraitPrompt(
          name,
          description,
          race,
          hairColor,
          skinColor
        ),
        portraitImageUrl: portraitImageUrl.value,
        outfitName:
          args?.outfitName?.trim?.() ||
          character.outfitName ||
          "Hero Starter Outfit",
        race,
        hairColor,
        skinColor,
      };

      player.name = name;

      questLog = [
        `Character updated: ${name}. ${description}`,
        ...questLog,
      ].slice(0, 12);

      saveGame();

      return reply(`Updated character: ${name}`);
    }
  );
  registerAppTool(
    server,
    "generate_portrait",
    {
      title: "Generate Portrait",
      description:
        "Generates a new portrait image for the Eris-Touched hero using the server's OpenAI image configuration.",
      inputSchema: emptyInputSchema,
      outputSchema: questOutputSchema,
      _meta: {
        ui: { resourceUri: APP_URI },
      },
    },
    async () => {
      const prompt = character.portraitPrompt || createPortraitPrompt(
        character.name,
        character.description,
        character.race,
        character.hairColor,
        character.skinColor
      );
      const result = await generatePortraitImage(prompt);

      if (!result.ok) {
        return reply(result.message);
      }

      character = {
        ...character,
        portraitPrompt: result.prompt,
        portraitImageUrl: result.imageUrl,
      };

      questLog = [
        `Generated a new portrait for ${character.name}.`,
        ...questLog,
      ].slice(0, 12);

      saveGame();

      return reply(`Generated a new portrait for ${character.name}.`);
    }
  );
  registerAppTool(
    server,
    "update_settings",
    {
      title: "Update Settings",
      description:
        "Updates Eris-Touched Focus RPG app settings such as story tone.",
      inputSchema: updateSettingsInputSchema,
      outputSchema: questOutputSchema,
      _meta: {
        ui: { resourceUri: APP_URI },
      },
    },
    async (args) => {
      const requestedTone = args?.storyTone?.trim?.() ?? undefined;
      const requestedGoal = args?.overarchingGoal?.trim?.();
      const logEntries = [];

      if (requestedTone !== undefined) {
        if (!isValidStoryTone(requestedTone)) {
          return reply("Invalid story tone.");
        }

        appSettings.storyTone = requestedTone;
        logEntries.push(`Story tone changed to ${getStoryToneLabel(requestedTone)}.`);
      }

      if (requestedGoal) {
        appSettings.overarchingGoal = requestedGoal;
        logEntries.push(`Guild charter updated: ${requestedGoal}.`);
      }

      if (!logEntries.length) {
        return reply("No settings were changed.");
      }

      questLog = [...logEntries, ...questLog].slice(0, 12);
      saveGame();

      return reply("Updated settings.");
    }
  );
  registerAppTool(
    server,
    "get_progress",
    {
      title: "Get Progress",
      description:
        "Loads the saved Eris-Touched hero progress, quest log, inventory, and NPCs.",
      inputSchema: emptyInputSchema,
      outputSchema: questOutputSchema,
      _meta: {
        ui: { resourceUri: APP_URI },
      },
    },
    async () => {
      loadGame();
      return reply("Loaded saved progress.");
    }
  );

  registerAppTool(
    server,
    "start_focus_quest",
    {
      title: "Start Focus Quest",
      description:
        "Starts an Eris-Touched focus quest from a real-world task and planned focus duration.",
      inputSchema: startQuestInputSchema,
      outputSchema: questOutputSchema,
      _meta: {
        ui: { resourceUri: APP_URI },
      },
    },
    async (args) => {
      const task = args?.task?.trim?.() ?? "";
      const plannedMinutes = clampNumber(args?.plannedMinutes, 1, 600, 25);

      if (!task) {
        return reply("Missing quest task.");
      }

      if (currentQuest?.status === "active") {
        return reply(
          `A request is already active: ${currentQuest.task}. Turn it in before accepting another.`
        );
      }

      currentQuest = {
        id: `quest-${nextQuestId++}`,
        task,
        plannedMinutes,
        startedAt: new Date().toISOString(),
        status: "active",
      };

      const opening = await createQuestOpening(task);
      questLog = [opening, ...questLog].slice(0, 12);

      saveGame();

      return reply(`Started focus quest: ${task}`);
    }
  );

  registerAppTool(
    server,
    "complete_focus_quest",
    {
      title: "Complete Focus Quest",
      description:
        "Completes the current focus quest and awards coins, guaranteed loot, rarity, and a short story result.",
      inputSchema: completeQuestInputSchema,
      outputSchema: questOutputSchema,
      _meta: {
        ui: { resourceUri: APP_URI },
      },
    },
    async (args) => {
      if (!currentQuest) {
        return reply("There is no active quest to complete.");
      }

      if (currentQuest.status !== "active") {
        return reply("The current request has already been completed.");
      }

      const actualMinutes = clampNumber(
        args?.actualMinutes,
        0,
        600,
        currentQuest.plannedMinutes
      );

      const result = await finalizeQuestCompletion(actualMinutes);

      return reply(result.message);
    }
  );

  registerAppTool(
    server,
    "choose_npc",
    {
      title: "Choose NPC",
      description:
        "Chooses one of the three pending NPC options and adds that NPC to the hero's story.",
      inputSchema: chooseNpcInputSchema,
      outputSchema: questOutputSchema,
      _meta: {
        ui: { resourceUri: APP_URI },
      },
    },
    async (args) => {
      const npcId = args?.npcId;
      const chosenNpc = pendingNpcChoices.find((npc) => npc.id === npcId);

      if (!chosenNpc) {
        return reply("That NPC choice is no longer available.");
      }

      knownNpcs = [chosenNpc, ...knownNpcs].slice(0, 12);
      pendingNpcChoices = [];

      questLog = [
        `${chosenNpc.name}, the ${chosenNpc.role}, has entered the story. ${chosenNpc.storyHook}`,
        ...questLog,
      ].slice(0, 12);

      saveGame();

      return reply(`Chose NPC: ${chosenNpc.name}`);
    }
  );

  return server;
}

function isAllowedOrigin(origin) {
  if (!origin || origin === "null") {
    return true;
  }

  if (CONFIGURED_ALLOWED_ORIGINS.has(origin)) {
    return true;
  }

  try {
    const url = new URL(origin);
    return (
      (url.protocol === "http:" || url.protocol === "https:") &&
      ["localhost", "127.0.0.1", "::1"].includes(url.hostname)
    );
  } catch {
    return false;
  }
}

function applyCorsHeaders(req, res) {
  const origin = req.headers.origin;
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Expose-Headers", "Mcp-Session-Id");

  if (!isAllowedOrigin(origin)) {
    return false;
  }

  if (origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  return true;
}


const STATIC_MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

function getStaticMimeType(filePath) {
  return STATIC_MIME_TYPES[extname(filePath).toLowerCase()] ?? "application/octet-stream";
}

function servePublicFile(pathname, res) {
  const isKnownPublicFile = pathname === "/styles.css" || pathname === "/app.js";
  const isAssetFile = pathname.startsWith("/assets/");

  if (!isKnownPublicFile && !isAssetFile) {
    return false;
  }

  let safeRelativePath;

  try {
    safeRelativePath = decodeURIComponent(pathname).replace(/^\/+/, "");
  } catch {
    res.writeHead(400).end("Bad request");
    return true;
  }

  if (
    !safeRelativePath ||
    safeRelativePath.includes("..") ||
    safeRelativePath.includes("\\")
  ) {
    res.writeHead(400).end("Bad request");
    return true;
  }

  const filePath = join(PUBLIC_DIR, safeRelativePath);

  if (!existsSync(filePath)) {
    res.writeHead(404).end("Not Found");
    return true;
  }

  res.writeHead(200, {
    "content-type": getStaticMimeType(filePath),
    "cache-control": "no-cache",
  });
  res.end(readFileSync(filePath));
  return true;
}

function createHttpServer() {
  return createServer(async (req, res) => {
  if (!req.url) {
    res.writeHead(400).end("Missing URL");
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host ?? "localhost"}`);

  if (req.method === "GET" && servePublicFile(url.pathname, res)) {
    return;
  }

  if (req.method === "OPTIONS" && url.pathname === MCP_PATH) {
    if (!applyCorsHeaders(req, res)) {
      res.writeHead(403).end("Origin not allowed");
      return;
    }

    res.writeHead(204, {
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "content-type, mcp-session-id",
    });
    res.end();
    return;
  }

  if (req.method === "GET" && url.pathname === "/") {
    res
      .writeHead(200, { "content-type": "text/html" })
      .end(appHtml);
    return;
  }

  // Web API endpoints
  if (url.pathname === "/api/progress" && req.method === "GET") {
    if (!applyCorsHeaders(req, res)) {
      res.writeHead(403).end("Origin not allowed");
      return;
    }
    loadGame();
    const response = reply("Loaded saved progress.");
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify(response));
    return;
  }

  if (url.pathname === "/api/start-quest" && req.method === "POST") {
    if (!applyCorsHeaders(req, res)) {
      res.writeHead(403).end("Origin not allowed");
      return;
    }
    try {
      const body = await new Promise((resolve, reject) => {
        let data = "";
        req.on("data", chunk => data += chunk);
        req.on("end", () => resolve(data));
        req.on("error", reject);
      });
      const args = JSON.parse(body);
      const response = await startQuestTool(args);
      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify(response));
    } catch (error) {
      console.error("Start quest error:", error);
      res.writeHead(500).end(JSON.stringify({ error: error.message }));
    }
    return;
  }

  if (url.pathname === "/api/complete-quest" && req.method === "POST") {
    if (!applyCorsHeaders(req, res)) {
      res.writeHead(403).end("Origin not allowed");
      return;
    }
    try {
      const body = await new Promise((resolve, reject) => {
        let data = "";
        req.on("data", chunk => data += chunk);
        req.on("end", () => resolve(data));
        req.on("error", reject);
      });
      const args = JSON.parse(body);
      const response = await completeQuestTool(args);
      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify(response));
    } catch (error) {
      console.error("Complete quest error:", error);
      res.writeHead(500).end(JSON.stringify({ error: error.message }));
    }
    return;
  }

  if (url.pathname === "/api/update-character" && req.method === "POST") {
    if (!applyCorsHeaders(req, res)) {
      res.writeHead(403).end("Origin not allowed");
      return;
    }
    try {
      const body = await new Promise((resolve, reject) => {
        let data = "";
        req.on("data", chunk => data += chunk);
        req.on("end", () => resolve(data));
        req.on("error", reject);
      });
      const args = JSON.parse(body);
      const response = await updateCharacterTool(args);
      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify(response));
    } catch (error) {
      console.error("Update character error:", error);
      res.writeHead(500).end(JSON.stringify({ error: error.message }));
    }
    return;
  }

  if (url.pathname === "/api/generate-portrait" && req.method === "POST") {
    if (!applyCorsHeaders(req, res)) {
      res.writeHead(403).end("Origin not allowed");
      return;
    }
    try {
      const response = await generatePortraitTool({});
      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify(response));
    } catch (error) {
      console.error("Generate portrait error:", error);
      res.writeHead(500).end(JSON.stringify({ error: error.message }));
    }
    return;
  }

  if (url.pathname === "/api/update-settings" && req.method === "POST") {
    if (!applyCorsHeaders(req, res)) {
      res.writeHead(403).end("Origin not allowed");
      return;
    }
    try {
      const body = await new Promise((resolve, reject) => {
        let data = "";
        req.on("data", chunk => data += chunk);
        req.on("end", () => resolve(data));
        req.on("error", reject);
      });
      const args = JSON.parse(body);
      const response = await updateSettingsTool(args);
      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify(response));
    } catch (error) {
      console.error("Update settings error:", error);
      res.writeHead(500).end(JSON.stringify({ error: error.message }));
    }
    return;
  }

  if (url.pathname === "/api/choose-npc" && req.method === "POST") {
    if (!applyCorsHeaders(req, res)) {
      res.writeHead(403).end("Origin not allowed");
      return;
    }
    try {
      const body = await new Promise((resolve, reject) => {
        let data = "";
        req.on("data", chunk => data += chunk);
        req.on("end", () => resolve(data));
        req.on("error", reject);
      });
      const args = JSON.parse(body);
      const response = await chooseNpcTool(args);
      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify(response));
    } catch (error) {
      console.error("Choose NPC error:", error);
      res.writeHead(500).end(JSON.stringify({ error: error.message }));
    }
    return;
  }

  const MCP_METHODS = new Set(["POST", "GET", "DELETE"]);

  if (url.pathname === MCP_PATH && req.method && MCP_METHODS.has(req.method)) {
    if (!applyCorsHeaders(req, res)) {
      res.writeHead(403).end("Origin not allowed");
      return;
    }

    const server = createErisServer();
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
      enableJsonResponse: true,
    });

    res.on("close", () => {
      transport.close();
      server.close();
    });

    try {
      await server.connect(transport);
      await transport.handleRequest(req, res);
    } catch (error) {
      console.error("Error handling MCP request:", error);

      if (!res.headersSent) {
        res.writeHead(500).end("Internal server error");
      }
    }

    return;
  }

  res.writeHead(404).end("Not Found");
  });
}

function startHttpServer(listenPort = DEFAULT_PORT, host = SERVER_HOST) {
  const httpServer = createHttpServer();

  httpServer.listen(listenPort, host, () => {
    const address = httpServer.address();
    const boundPort = typeof address === "object" ? address.port : listenPort;
    console.log(
      `Eris-Touched Focus RPG server listening on http://${host}:${boundPort}${MCP_PATH}`
    );
  });

  return httpServer;
}

const isMain = import.meta.url === pathToFileURL(process.argv[1] ?? "").href;

if (isMain) {
  startHttpServer();
}

export {
  ERIS_PATCH_VERSION,
  chooseReward,
  createPortraitPrompt,
  createHttpServer,
  getLevelFromXp,
  isAllowedOrigin,
  parseOptionalPortraitImageSource,
  startHttpServer,
};
