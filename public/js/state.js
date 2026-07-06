export function createInitialState() {
  return {
    currentQuest: null,
    lastCompletedQuest: null,
    pinnedRequests: [],
    log: [],
    pendingNpcChoices: [],
    knownNpcs: [],
    storyChapters: [],
    appSettings: {
      storyTone: "epic_heroic",
      overarchingGoal: "Build better habits",
    },
    character: {
      name: "Eris-Touched Hero",
      description: "A fantasy adventurer touched by Eris, learning to turn chaos into quests.",
      portraitPrompt: "A fantasy portrait of an Eris-Touched hero.",
      portraitImageUrl: "",
      outfitName: "Hero Starter Outfit",
      race: "Human",
      hairColor: "Black",
      skinColor: "Olive",
    },
    player: {
      name: "Eris-Touched Hero",
      level: 1,
      totalXp: 0,
      completedQuests: 0,
      coins: 0,
      inventory: [],
    },
  };
}
