// gui.js
import { Cookie } from "./utilities.js";

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
    this.modalButtons = [];
    this.allFocusableElements = [];

    this.createMenu();
    this.createScreens();
    this.setupKeyboardNavigation();
    this.createGameStateDisplay();
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
    this.updateFocusableElements();
  }

  setupKeyboardNavigation() {
    document.addEventListener("keydown", (event) => {
      if (event.key === "Tab") {
        event.preventDefault();
        this.handleTabNavigation(event.shiftKey);
      } else if (event.key === "Escape") {
        event.preventDefault();
        this.handleEscapeKey();
      }
    });

    this.allFocusableElements.forEach((element) => {
      element.addEventListener("focus", () => {
        element.classList.add("focused");
      });

      element.addEventListener("blur", () => {
        element.classList.remove("focused");
      });

      if (element.classList.contains("menu-button")) {
        element.addEventListener("keydown", (event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            this.toggleScreen(element.getAttribute("data-screen"));
          }
        });
      }
    });
  }

  handleTabNavigation(isShiftKey) {
    const focusedElement = document.activeElement;
    const currentIndex = this.allFocusableElements.indexOf(focusedElement);

    let nextIndex;
    if (isShiftKey) {
      nextIndex = currentIndex > 0 ? currentIndex - 1 : this.allFocusableElements.length - 1;
    } else {
      nextIndex = currentIndex < this.allFocusableElements.length - 1 ? currentIndex + 1 : 0;
    }

    this.allFocusableElements[nextIndex].focus();
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
      screen.classList.add("modal-screen", "hidden");
      screen.id = `${option.screen.toLowerCase().replace(/\s+/g, "-")}-screen`;

      const title = document.createElement("h2");
      title.textContent = `${option.screen}`;

      const content = document.createElement("div");
      content.id = `${option.screen.toLowerCase().replace(/\s+/g, "-")}-content`;

      // Add the game state text only for the Game Menu screen
      if (option.screen === "Game Menu") {
        const gameStateText = document.createElement("p");
        gameStateText.id = "game-menu-game-state-text";
        content.appendChild(gameStateText);

        // Add new buttons for save, restore, and delete all
        const saveGameButton = this.createActionButton("Save Game", () => {
          this.saveGame();
        });
        const restoreGameButton = this.createActionButton("Restore Game", () => {
          this.restoreGame();
        });
        const deleteAllButton = this.createActionButton("Delete All", () => {
          this.deleteAll();
        });

        content.appendChild(saveGameButton);
        content.appendChild(restoreGameButton);
        content.appendChild(deleteAllButton);
      }

      const closeButton = document.createElement("button");
      closeButton.textContent = "Close";
      closeButton.classList.add("modal-button");
      closeButton.addEventListener("click", () => this.closeScreen());

      screen.appendChild(title);
      screen.appendChild(content);
      screen.appendChild(closeButton);

      document.body.appendChild(screen);
      this.modalButtons.push(closeButton);
    });
    this.createMessageScreen();
    this.updateFocusableElements();
  }

  createMessageScreen() {
    const screen = document.createElement("div");
    screen.classList.add("modal-screen", "hidden");
    screen.id = "message-screen";

    const title = document.createElement("h2");
    title.textContent = "Updated";

    const content = document.createElement("div");
    content.id = "message-content";

    const closeButton = document.createElement("button");
    closeButton.textContent = "Close";
    closeButton.classList.add("modal-button");
    closeButton.addEventListener("click", () => this.closeScreen());

    screen.appendChild(title);
    screen.appendChild(content);
    screen.appendChild(closeButton);

    document.body.appendChild(screen);
    this.modalButtons.push(closeButton);
  }

  saveGame() {
    const gameState = this.game.gameState.toJSON();
    try {
      Cookie.save("gameState", gameState);
      this.showMessage("Game saved successfully");
    } catch (error) {
      this.showMessage("Failed to save game");
    }
  }

  restoreGame() {
    const savedState = Cookie.get("gameState");
    if (savedState) {
      try {
        this.game.gameState.fromJSON(savedState);
        this.game.reinitializeGameObjects();
        this.showMessage("Game restored successfully");
      } catch (error) {
        console.debug("Failed to restore game:", error);
        this.showMessage("Failed to restore game");
      }
    } else {
      this.showMessage("No saved game found");
    }
  }

  deleteAll() {
    Cookie.toss("gameState");
    this.showMessage("All saved data deleted");
  }

  showMessage(message) {
    // console.log(message);
    this.closeScreen();
    const messageContent = document.getElementById("message-content");
    if (messageContent) {
      messageContent.innerHTML = message;
    }
    this.openScreen("message");
  }

  createActionButton(text, onClick) {
    const button = document.createElement("button");
    button.textContent = text;
    button.classList.add("action-button");
    button.addEventListener("click", onClick);
    this.modalButtons.push(button);
    return button;
  }

  openScreen(screenName) {
    this.activeScreen = screenName;
    this.game.setPaused(true);

    const gameCanvas = document.getElementById("gameCanvas");
    if (gameCanvas) {
      gameCanvas.classList.add("hidden");
    } else {
      console.debug("Game canvas element not found");
    }

    const screen = document.getElementById(`${screenName.toLowerCase().replace(/\s+/g, "-")}-screen`);
    if (screen) {
      screen.classList.remove("hidden");
      if (screenName === "Game Menu") {
        this.updateGameMenuScreen();
      } else if (screenName === "Use Something") {
        this.updateUseSomethingScreen();
      }
      this.updateFocusableElements();
    } else {
      console.debug(`Screen not found: ${screenName}`);
    }
  }

  updateGameMenuScreen() {
    const gameStateText = document.getElementById("game-menu-game-state-text");
    if (gameStateText) {
      const { currentLevel, playerEnergy, playerHealth, gamesCompleted } = this.game.gameState;
      gameStateText.innerHTML = `
          <ul>
            <li>Current Level: ${currentLevel}</li>
            <li>Energy: ${playerEnergy}</li>
            <li>Health: ${playerHealth}</li>
            <li>Games Completed: ${gamesCompleted}</li>
          </ul>`;
    }
  }

  updateUseSomethingScreen() {
    const contentId = "use-something-content";
    const content = document.getElementById(contentId);
    if (!content) {
      console.debug(`Element not found: ${contentId}`);
      return;
    }

    content.innerHTML = "";

    if (this.game.level.isPlayerNearDoor()) {
      const enterDoorButton = document.createElement("button");
      enterDoorButton.textContent = "Enter Door";
      enterDoorButton.classList.add("modal-button");
      enterDoorButton.addEventListener("click", () => {
        this.game.goToNextLevel();
        this.closeScreen();
      });
      content.appendChild(enterDoorButton);
      this.modalButtons.push(enterDoorButton);
      this.updateFocusableElements();
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
        console.debug(`Active screen element not found: ${this.activeScreen}`);
      }

      const gameCanvas = document.getElementById("gameCanvas");
      if (gameCanvas) {
        gameCanvas.classList.remove("hidden");
      } else {
        console.debug("Game canvas element not found");
      }

      this.activeScreen = null;
      this.game.setPaused(false);
      this.updateFocusableElements();
    }
  }

  updateFocusableElements() {
    this.allFocusableElements = [...this.menuButtons];
    if (this.activeScreen) {
      const activeScreenElement = document.getElementById(`${this.activeScreen.toLowerCase().replace(/\s+/g, "-")}-screen`);
      if (activeScreenElement) {
        const modalButtons = activeScreenElement.querySelectorAll(".modal-button, .action-button");
        this.allFocusableElements = [...this.allFocusableElements, ...modalButtons];
      }
    }
  }

  setFocusedElement(optionName) {
    const button = this.menuButtons.find((btn) => btn.getAttribute("data-screen") === optionName);
    if (button) {
      button.focus();
    } else {
      console.debug(`Menu option '${optionName}' not found.`);
    }
  }

  clearFocusedElement(optionName) {
    const button = this.menuButtons.find((btn) => btn.getAttribute("data-screen") === optionName);
    if (button) {
      button.blur();
    }
  }

  createGameStateDisplay() {
    const gameStateDisplay = document.createElement("div");
    gameStateDisplay.id = "game-state-display";
    gameStateDisplay.classList.add("game-state-display");
    document.body.appendChild(gameStateDisplay);
    this.updateGameStateDisplay(this.game.gameState.currentLevel);
  }

  updateGameStateDisplay(levelNumber) {
    const gameStateDisplay = document.getElementById("game-state-display");
    if (gameStateDisplay) {
      const { currentLevel } = this.game.gameState;
      gameStateDisplay.textContent = `
            Level: ${currentLevel}`;
    } else {
      console.debug("Game state display element not found");
    }
  }
}
