export function getStoryToneLabel(storyTone) {
  const labels = {
    cozy_mythic: "Cozy Mythic",
    epic_heroic: "Epic Heroic",
    dramatic: "Dramatic",
    funny_chaos: "Funny Chaos",
    dark_mythic: "Dark Mythic",
  };
  return labels[storyTone] ?? "Epic Heroic";
}
