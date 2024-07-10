/**
 * @jest-environment jsdom
 */

// __tests__/tdd/gui.test.js

import GUI from "../../gui.js";
import { Cookie } from "../../utilities.js";

// Mock the document object
document.body.innerHTML = '<div id="gameCanvas"></div>';

// Mock the GameState class
class MockGameState {
  constructor() {
    this.currentLevel = 1;
    this.playerEnergy = 100;
    this.playerHealth = 100;
    this.gamesCompleted = 0;
  }

  fromJSON(jsonString) {
    const parsedState = JSON.parse(jsonString);
    Object.assign(this, parsedState);
  }

  toJSON() {
    return JSON.stringify({
      currentLevel: this.currentLevel,
      playerEnergy: this.playerEnergy,
      playerHealth: this.playerHealth,
      gamesCompleted: this.gamesCompleted,
    });
  }
}

// Mock the Game class
class MockGame {
  constructor() {
    this.gameState = new MockGameState();
    this.setPaused = jest.fn();
    this.goToNextLevel = jest.fn();
    this.reinitializeGameObjects = jest.fn();
  }
}

jest.mock("../../utilities.js", () => ({
  Cookie: {
    save: jest.fn(),
    get: jest.fn(),
    toss: jest.fn(),
  },
}));

describe("GUI", () => {
  let gui;
  let mockGame;

  beforeEach(() => {
    mockGame = new MockGame();
    gui = new GUI(mockGame);
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test("constructor initializes GUI correctly", () => {
    expect(gui.game).toBe(mockGame);
    expect(gui.menuOptions).toBeDefined();
    expect(gui.activeScreen).toBeNull();
    expect(gui.menuButtons.length).toBe(gui.menuOptions.length);
    // Check for the correct number of modal buttons (3 action buttons + 5 close buttons)
    expect(gui.modalButtons.length).toBe(8);
    // allFocusableElements should only include menu buttons at this point
    expect(gui.allFocusableElements.length).toBe(gui.menuOptions.length);
  });

  test("createMenu creates menu buttons", () => {
    const menuContainer = document.querySelector(".menu-container");
    expect(menuContainer).toBeDefined();
    expect(menuContainer.children.length).toBe(gui.menuOptions.length);
  });

  test("toggleScreen opens and closes screens", () => {
    gui.toggleScreen("Game Menu");
    expect(gui.activeScreen).toBe("Game Menu");
    expect(mockGame.setPaused).toHaveBeenCalledWith(true);

    gui.toggleScreen("Game Menu");
    expect(gui.activeScreen).toBeNull();
    expect(mockGame.setPaused).toHaveBeenCalledWith(false);
  });

  test("updateGameMenuScreen updates game state text", () => {
    gui.openScreen("Game Menu");
    const gameStateText = document.getElementById("game-menu-game-state-text");
    expect(gameStateText.innerHTML).toContain("Current Level: 1");
    expect(gameStateText.innerHTML).toContain("Energy: 100");
    expect(gameStateText.innerHTML).toContain("Health: 100");
    expect(gameStateText.innerHTML).toContain("Games Completed: 0");
  });

  test("saveGame saves game state", () => {
    gui.saveGame();
    expect(Cookie.save).toHaveBeenCalledWith("gameState", expect.any(String));
  });

  test("restoreGame restores game state", () => {
    const savedState = JSON.stringify({
      currentLevel: 2,
      playerEnergy: 80,
      playerHealth: 90,
      gamesCompleted: 1,
    });
    Cookie.get.mockReturnValue(savedState);
    gui.restoreGame();
    expect(mockGame.reinitializeGameObjects).toHaveBeenCalled();
    expect(mockGame.gameState.currentLevel).toBe(2);
    expect(mockGame.gameState.playerEnergy).toBe(80);
    expect(mockGame.gameState.playerHealth).toBe(90);
    expect(mockGame.gameState.gamesCompleted).toBe(1);
  });

  test("deleteAll deletes saved game data", () => {
    gui.deleteAll();
    expect(Cookie.toss).toHaveBeenCalledWith("gameState");
  });

  test("showMessage displays a message", () => {
    gui.showMessage("Test message");
    const messageContent = document.getElementById("message-content");
    expect(messageContent.innerHTML).toBe("Test message");
  });

  test("updateGameStateDisplay updates level display", () => {
    gui.updateGameStateDisplay(2);
    const gameStateDisplay = document.getElementById("game-state-display");
    expect(gameStateDisplay.textContent).toContain("Level: 1");
  });

  test("setFocusedElement sets focus on a menu option", () => {
    const focusSpy = jest.spyOn(HTMLElement.prototype, "focus");
    gui.setFocusedElement("Game Menu");
    expect(focusSpy).toHaveBeenCalled();
  });

  test("clearFocusedElement clears focus from a menu option", () => {
    const blurSpy = jest.spyOn(HTMLElement.prototype, "blur");
    gui.clearFocusedElement("Game Menu");
    expect(blurSpy).toHaveBeenCalled();
  });
});
