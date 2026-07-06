export function getHighestChapterXp(storyChapters = []) {
  return storyChapters.reduce((max, chapter) => Math.max(max, chapter.xp || 0), 0);
}
