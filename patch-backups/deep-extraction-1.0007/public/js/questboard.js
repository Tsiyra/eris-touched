export function createPinnedRequestId() {
  return `pinned-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function clampPlannedMinutes(value, fallback = 45) {
  return Math.max(1, Math.min(600, Math.round(Number(value) || fallback)));
}
