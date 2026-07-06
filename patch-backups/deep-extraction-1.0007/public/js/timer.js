export function formatTime(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds]
    .map((number) => String(number).padStart(2, "0"))
    .join(":");
}

export function getFocusedSeconds({ timerRunning, startTime, accumulatedSeconds }) {
  if (!timerRunning || !startTime) return accumulatedSeconds;
  const currentRunSeconds = Math.floor((Date.now() - startTime) / 1000);
  return accumulatedSeconds + currentRunSeconds;
}
