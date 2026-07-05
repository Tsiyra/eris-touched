export function getQuestResultPanelState(currentQuest, lastCompletedQuest, options = {}) {
  const { questStarted = false } = options;
  const completedQuest = lastCompletedQuest || (currentQuest?.status === "completed" ? currentQuest : null);

  if (completedQuest) {
    const questTitle = completedQuest.questTitle?.trim() || completedQuest.task?.trim() || "Guild Request";
    const rewardText = completedQuest.rewardSummary
      ? `Reward: ${completedQuest.rewardSummary}`
      : [
          completedQuest.coins ? `${completedQuest.coins} Gold` : "",
          completedQuest.xp != null ? `${completedQuest.xp} XP` : "",
        ]
          .filter(Boolean)
          .join(" - ");

    return {
      hasResult: true,
      statusText: rewardText || "",
      lootText: "",
    };
  }

  if (currentQuest?.status === "active") {
    return {
      hasResult: false,
      statusText: questStarted ? "Request in progress." : "Choose a checkmark task to begin.",
      lootText: "",
    };
  }

  return {
    hasResult: false,
    statusText: "No request completed yet.",
    lootText: "",
  };
}
