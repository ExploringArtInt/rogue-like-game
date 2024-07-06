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
    menuContainer.style.position = "fixed";
    menuContainer.style.bottom = "0";
    menuContainer.style.left = "0";
    menuContainer.style.width = "100%";
    menuContainer.style.height = "80px";
    menuContainer.style.display = "flex";
    menuContainer.style.backgroundColor = "rgba(0, 0, 0, 0.5)";

    this.menuOptions.forEach((option) => {
      const button = document.createElement("button");
      button.classList.add("menu-button");
      button.setAttribute("data-screen", option.screen);
      button.setAttribute("aria-label", option.label);
      button.style.flex = "1";
      button.style.border = "none";
      button.style.background = "transparent";
      button.style.cursor = "pointer";
      button.style.outline = "none";
      button.style.transition = "background-color 0.3s";

      const icon = document.createElement("img");
      icon.src = `./assets/svg/gui/${option.icon}`;
      icon.alt = option.label;
      icon.style.width = "40px";
      icon.style.height = "40px";

      button.appendChild(icon);
      menuContainer.appendChild(button);

      button.addEventListener("click", () => this.openScreen(option.screen));
    });

    document.body.appendChild(menuContainer);
  }

  createScreens() {
    this.menuOptions.forEach((option) => {
      const screen = document.createElement("div");
      screen.classList.add("screen");
      screen.id = `${option.screen.toLowerCase()}-screen`;
      screen.style.position = "fixed";
      screen.style.top = "0";
      screen.style.left = "0";
      screen.style.width = "100%";
      screen.style.height = "calc(100% - 80px)";
      screen.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
      screen.style.color = "white";
      screen.style.display = "none";
      screen.style.flexDirection = "column";
      screen.style.alignItems = "center";
      screen.style.justifyContent = "center";

      const title = document.createElement("h2");
      title.textContent = `${option.screen} Screen`;

      const closeButton = document.createElement("button");
      closeButton.textContent = "Close";
      closeButton.style.marginTop = "20px";
      closeButton.addEventListener("click", () => this.closeScreen());

      screen.appendChild(title);
      screen.appendChild(closeButton);

      document.body.appendChild(screen);
    });
  }

  openScreen(screenName) {
    this.activeScreen = screenName;
    this.game.setPaused(true);
    document.getElementById("gameCanvas").style.display = "none";
    document.getElementById(`${screenName.toLowerCase()}-screen`).style.display = "flex";
  }

  closeScreen() {
    if (this.activeScreen) {
      document.getElementById(`${this.activeScreen.toLowerCase()}-screen`).style.display = "none";
      document.getElementById("gameCanvas").style.display = "block";
      this.activeScreen = null;
      this.game.setPaused(false);
    }
  }
}
