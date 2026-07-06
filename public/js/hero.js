export function getLevelProgress(player, levelThresholds) {
  const currentLevelXp = levelThresholds[player.level] ?? 0;
  const nextLevelXp = levelThresholds[player.level + 1];

  if (!nextLevelXp) {
    return { percent: 100, label: "Max level reached" };
  }

  const earnedThisLevel = player.totalXp - currentLevelXp;
  const neededThisLevel = nextLevelXp - currentLevelXp;
  const percent = Math.max(0, Math.min(100, Math.round((earnedThisLevel / neededThisLevel) * 100)));

  return {
    percent,
    label: `${player.totalXp} / ${nextLevelXp} XP to Level ${player.level + 1}`,
  };
}
