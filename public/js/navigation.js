export function setupNavigation({ navButtons, appScreens }) {
  function showScreen(screenName) {
    appScreens.forEach((screen) => {
      screen.classList.remove("active-screen");
    });

    navButtons.forEach((button) => {
      button.classList.remove("active");
    });

    const screen = document.querySelector(`#screen-${screenName}`);
    const button = document.querySelector(`[data-screen="${screenName}"]`);

    if (screen) screen.classList.add("active-screen");
    if (button) button.classList.add("active");
  }

  navButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetScreen = button.dataset.screen;
      if (targetScreen) {
        showScreen(targetScreen);
      }
    });
  });

  return { showScreen };
}
