export function setText(element, value) {
  if (element) element.textContent = value ?? "";
}

export function setDisplay(element, isVisible, visibleDisplay = "block") {
  if (element) element.style.display = isVisible ? visibleDisplay : "none";
}
