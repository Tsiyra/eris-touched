import { getLongestChapter } from "./journey.js";

export function getChronicleStats({ storyChapters = [], player, knownNpcs = [] }) {
  const highestXp = storyChapters.reduce((max, chapter) => Math.max(max, chapter.xp || 0), 0);
  const longestRequest = getLongestChapter(storyChapters);

  return {
    totalXp: player.totalXp,
    coins: player.coins ?? 0,
    completedRequests: player.completedQuests,
    lootCount: player.inventory.length,
    knownNpcCount: knownNpcs.length,
    highestXp,
    longestRequestLabel: longestRequest.title && longestRequest.minutes
      ? `${longestRequest.title} (${longestRequest.minutes} min)`
      : "None yet",
  };
}
