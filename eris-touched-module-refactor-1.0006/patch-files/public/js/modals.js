export function createOverlayTracker() {
  const activeOverlayLayers = new Set();

  function syncOverlayChrome() {
    document.body.classList.toggle("overlay-visible", activeOverlayLayers.size > 0);
  }

  function setOverlayLayerVisible(layer, isVisible) {
    if (!layer) return;
    if (isVisible) activeOverlayLayers.add(layer);
    else activeOverlayLayers.delete(layer);
    syncOverlayChrome();
  }

  return { activeOverlayLayers, syncOverlayChrome, setOverlayLayerVisible };
}
