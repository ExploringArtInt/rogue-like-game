// gui.js
export default class GUI {
  constructor(game) {
    this.game = game;
    this.menuOptions = [
      { icon: "gui-hamburger.svg", screen: "Game Menu", label: "Open Game Menu" },
      { icon: "gui-battery-100.svg", screen: "Energy", label: "Open Energy Menu" },
      { icon: "gui-plain-circle.svg", screen: "Shields", label: "Open Shield Menu" },
      { icon: "gui-auto-repair.svg", screen: "Use Something", label: "Open Use Menu" },
    ];
    this.activeScreen = null;
    this.menuButtons = [];

    this.createMenu();
    this.createScreens();
    this.setupKeyboardNavigation();
    this.createLevelDisplay();
  }

  createMenu() {
    const menuContainer = document.createElement("div");
    menuContainer.id = "menu-container";
    menuContainer.classList.add("menu-container");

    this.menuOptions.forEach((option, index) => {
      const button = document.createElement("button");
      button.classList.add("menu-button");
      button.setAttribute("data-screen", option.screen);
      button.setAttribute("aria-label", option.label);
      button.tabIndex = 0;

      const icon = document.createElement("img");
      icon.src = `./assets/svg/gui/${option.icon}`;
      icon.alt = option.label;
      icon.classList.add("menu-icon");

      button.appendChild(icon);
      menuContainer.appendChild(button);

      button.addEventListener("click", () => this.toggleScreen(option.screen));
      this.menuButtons.push(button);
    });

    document.body.appendChild(menuContainer);
  }

  setupKeyboardNavigation() {
    document.addEventListener("keydown", (event) => {
      if (event.key === "Tab") {
        event.preventDefault();
        this.handleTabNavigation(event.shiftKey);
      } else if (event.key === " ") {
        event.preventDefault();
        this.handleSpaceKey();
      } else if (event.key === "Escape") {
        event.preventDefault();
        this.handleEscapeKey();
      }
    });

    this.menuButtons.forEach((button) => {
      button.addEventListener("focus", () => {
        button.classList.add("menu-button-focused");
      });

      button.addEventListener("blur", () => {
        button.classList.remove("menu-button-focused");
      });

      button.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          this.toggleScreen(button.getAttribute("data-screen"));
        }
      });
    });
  }

  handleTabNavigation(isShiftKey) {
    const focusedElement = document.activeElement;
    const currentIndex = this.menuButtons.indexOf(focusedElement);

    let nextIndex;
    if (isShiftKey) {
      nextIndex = currentIndex > 0 ? currentIndex - 1 : this.menuButtons.length - 1;
    } else {
      nextIndex = currentIndex < this.menuButtons.length - 1 ? currentIndex + 1 : 0;
    }

    this.menuButtons[nextIndex].focus();
  }

  handleSpaceKey() {
    console.debug("In handleSpaceKey");
  }

  handleEscapeKey() {
    if (this.activeScreen) {
      this.closeScreen();
    }
  }

  toggleScreen(screenName) {
    if (this.activeScreen === screenName) {
      this.closeScreen();
    } else {
      if (this.activeScreen) {
        this.closeScreen();
      }
      this.openScreen(screenName);
    }
  }

  createScreens() {
    this.menuOptions.forEach((option) => {
      const screen = document.createElement("div");
      screen.classList.add("screen", "hidden");
      screen.id = `${option.screen.toLowerCase().replace(/\s+/g, "-")}-screen`;

      const title = document.createElement("h2");
      title.textContent = `${option.screen}`;

      const content = document.createElement("div");
      content.id = `${option.screen.toLowerCase().replace(/\s+/g, "-")}-content`;

      const closeButton = document.createElement("button");
      closeButton.textContent = "Close";
      closeButton.classList.add("close-button");
      closeButton.addEventListener("click", () => this.closeScreen());

      screen.appendChild(title);
      screen.appendChild(content);
      screen.appendChild(closeButton);

      document.body.appendChild(screen);
    });
  }

  openScreen(screenName) {
    this.activeScreen = screenName;
    this.game.setPaused(true);

    const gameCanvas = document.getElementById("gameCanvas");
    if (gameCanvas) {
      gameCanvas.classList.add("hidden");
    } else {
      console.warn("Game canvas element not found");
    }

    const screen = document.getElementById(`${screenName.toLowerCase().replace(/\s+/g, "-")}-screen`);
    if (screen) {
      screen.classList.remove("hidden");
      if (screenName === "Use Something") {
        this.updateUseSomethingScreen();
      }
    } else {
      console.error(`Screen not found: ${screenName}`);
    }
  }

  updateUseSomethingScreen() {
    const contentId = "use-something-content";
    const content = document.getElementById(contentId);
    if (!content) {
      console.error(`Element not found: ${contentId}`);
      return;
    }

    content.innerHTML = "";

    if (this.game.level.isPlayerNearDoor()) {
      const enterDoorButton = document.createElement("button");
      enterDoorButton.textContent = "Enter Door";
      enterDoorButton.classList.add("action-button");
      enterDoorButton.addEventListener("click", () => {
        this.game.goToNextLevel();
        this.closeScreen();
      });
      content.appendChild(enterDoorButton);
    } else {
      content.textContent = "No actions available.";
    }
  }

  closeScreen() {
    if (this.activeScreen) {
      const activeScreenElement = document.getElementById(`${this.activeScreen.toLowerCase().replace(/\s+/g, "-")}-screen`);
      if (activeScreenElement) {
        activeScreenElement.classList.add("hidden");
      } else {
        console.warn(`Active screen element not found: ${this.activeScreen}`);
      }

      const gameCanvas = document.getElementById("gameCanvas");
      if (gameCanvas) {
        gameCanvas.classList.remove("hidden");
      } else {
        console.warn("Game canvas element not found");
      }

      this.activeScreen = null;
      this.game.setPaused(false);
    }
  }

  setFocusedElement(optionName) {
    const button = this.menuButtons.find((btn) => btn.getAttribute("data-screen") === optionName);
    if (button) {
      button.focus();
    } else {
      console.warn(`Menu option '${optionName}' not found.`);
    }
  }

  clearFocusedElement(optionName) {
    const button = this.menuButtons.find((btn) => btn.getAttribute("data-screen") === optionName);
    if (button) {
      button.blur();
    }
  }

  createLevelDisplay() {
    const levelDisplay = document.createElement("div");
    levelDisplay.id = "level-display";
    levelDisplay.classList.add("level-display");
    document.body.appendChild(levelDisplay);
    this.updateLevelDisplay(this.game.currentLevelNumber);
  }

  updateLevelDisplay(levelNumber) {
    const levelDisplay = document.getElementById("level-display");
    if (levelDisplay) {
      levelDisplay.textContent = `Level: ${levelNumber}`;
    } else {
      console.warn("Level display element not found");
    }
  }
}
