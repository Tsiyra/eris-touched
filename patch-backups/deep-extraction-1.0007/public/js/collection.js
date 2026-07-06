export function getGoldBonus(item) {
  return item?.goldBonus ?? item?.xpBonus ?? 0;
}
