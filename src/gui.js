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

  createScreens() {
    this.menuOptions.forEach((option) => {
      const screen = document.createElement("div");
      screen.classList.add("screen", "hidden");
      screen.id = `${option.screen.toLowerCase()}-screen`;

      const title = document.createElement("h2");
      title.textContent = `${option.screen}`;

      const test = document.createElement("div");
      test.textContent =
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed lectus nisi, imperdiet id egestas sed, blandit ac ligula. Pellentesque hendrerit lorem ut urna vulputate, ac placerat sem rhoncus. Pellentesque faucibus finibus malesuada..";

      const closeButton = document.createElement("button");
      closeButton.textContent = "Close";
      closeButton.classList.add("close-button");
      closeButton.addEventListener("click", () => this.closeScreen());

      screen.appendChild(title);
      screen.appendChild(test);
      screen.appendChild(closeButton);

      document.body.appendChild(screen);
    });
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

      // Add keydown event listener to each button
      button.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          event.preventDefault(); // Prevent default Enter key behavior
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
    console.debug("In toggleScreen");
    if (this.activeScreen === screenName) {
      this.closeScreen();
    } else {
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

  setFocusedElement(optionName) {
    const button = this.menuButtons.find((btn) => btn.getAttribute("data-screen") === optionName);
    if (button) {
      button.focus();
    } else {
      console.warn(`Menu option '${optionName}' not found.`);
    }
  }

  clearFocusedElement(optionName) {
    /*
    const focusedButton = this.menuButtons.find((btn) => btn === document.activeElement);
    if (focusedButton) {
      focusedButton.blur();
    }
    */
    const button = this.menuButtons.find((btn) => btn.getAttribute("data-screen") === optionName);
    if (button) {
      button.blur();
    }
  }
}
