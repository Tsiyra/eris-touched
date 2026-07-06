export function formatTime(totalSeconds) {
  const safeSeconds = Math.max(0, Math.floor(Number(totalSeconds) || 0));
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;

  return [hours, minutes, seconds]
    .map((number) => String(number).padStart(2, "0"))
    .join(":");
}

export function calculateFocusedSeconds({ timerRunning, startTime, accumulatedSeconds }) {
  if (!timerRunning || !startTime) {
    return accumulatedSeconds;
  }

  const currentRunSeconds = Math.floor((Date.now() - startTime) / 1000);
  return accumulatedSeconds + currentRunSeconds;
}
