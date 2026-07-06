export function createOverlayController({ documentRef = document, bodyClass = "overlay-visible" } = {}) {
  const activeOverlayLayers = new Set();

  function syncOverlayChrome() {
    documentRef.body.classList.toggle(bodyClass, activeOverlayLayers.size > 0);
  }

  function setOverlayLayerVisible(layer, isVisible) {
    if (!layer) return;

    if (isVisible) {
      activeOverlayLayers.add(layer);
    } else {
      activeOverlayLayers.delete(layer);
    }

    syncOverlayChrome();
  }

  return { setOverlayLayerVisible, syncOverlayChrome };
}
