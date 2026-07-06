export function getInitials(name, fallback = "ET") {
  const initials = String(name || "")
    .split(" ")
    .map((part) => part[0]?.toUpperCase())
    .slice(0, 2)
    .join("");
  return initials || fallback;
}
