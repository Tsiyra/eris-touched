export function getLongestChapter(storyChapters = []) {
  return storyChapters.reduce(
    (longest, chapter) => {
      if (!chapter.minutes) return longest;
      return chapter.minutes > longest.minutes ? chapter : longest;
    },
    { minutes: 0, title: "None yet" }
  );
}
