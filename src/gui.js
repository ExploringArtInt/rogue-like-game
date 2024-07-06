// gui.js
export default class GUI {
  constructor(game) {
    this.game = game;
    this.menuOptions = [
      { icon: "gui-hamburger.svg", screen: "Game", label: "Open Game Menu" },
      { icon: "gui-battery-100.svg", screen: "Battery", label: "Open Battery Menu" },
      { icon: "gui-plain-circle.svg", screen: "Shield", label: "Open Shield Menu" },
      { icon: "gui-auto-repair.svg", screen: "Repair", label: "Open Repair Menu" },
    ];
    this.activeScreen = null;

    this.createMenu();
    this.createScreens();
  }

  createMenu() {
    const menuContainer = document.createElement("div");
    menuContainer.id = "menu-container";
    menuContainer.classList.add("menu-container");

    this.menuOptions.forEach((option) => {
      const button = document.createElement("button");
      button.classList.add("menu-button");
      button.setAttribute("data-screen", option.screen);
      button.setAttribute("aria-label", option.label);

      const icon = document.createElement("img");
      icon.src = `./assets/svg/gui/${option.icon}`;
      icon.alt = option.label;
      icon.classList.add("menu-icon");

      button.appendChild(icon);
      menuContainer.appendChild(button);

      button.addEventListener("click", () => this.toggleScreen(option.screen));
    });

    document.body.appendChild(menuContainer);
  }

  createScreens() {
    this.menuOptions.forEach((option) => {
      const screen = document.createElement("div");
      screen.classList.add("screen", "hidden");
      screen.id = `${option.screen.toLowerCase()}-screen`;

      const title = document.createElement("h2");
      title.textContent = `${option.screen} Screen`;

      const closeButton = document.createElement("button");
      closeButton.textContent = "Close";
      closeButton.classList.add("close-button");
      closeButton.addEventListener("click", () => this.closeScreen());

      screen.appendChild(title);
      screen.appendChild(closeButton);

      document.body.appendChild(screen);
    });
  }

  toggleScreen(screenName) {
    if (this.activeScreen === screenName) {
      // If clicking on the currently open screen, close it
      this.closeScreen();
    } else {
      // If a different screen is requested, close the current one (if any) and open the new one
      if (this.activeScreen) {
        this.closeScreen();
      }
      this.openScreen(screenName);
    }
  }

  openScreen(screenName) {
    this.activeScreen = screenName;
    this.game.setPaused(true);
    document.getElementById("gameCanvas").classList.add("hidden");
    document.getElementById(`${screenName.toLowerCase()}-screen`).classList.remove("hidden");
  }

  closeScreen() {
    if (this.activeScreen) {
      document.getElementById(`${this.activeScreen.toLowerCase()}-screen`).classList.add("hidden");
      document.getElementById("gameCanvas").classList.remove("hidden");
      this.activeScreen = null;
      this.game.setPaused(false);
    }
  }
}
