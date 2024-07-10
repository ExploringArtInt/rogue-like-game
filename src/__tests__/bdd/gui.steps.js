/**
 * @jest-environment jsdom
 */

import { defineFeature, loadFeature } from "jest-cucumber";

const feature = loadFeature("./src/__tests__/bdd/gui.feature.txt");

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

defineFeature(feature, (test) => {
  let gui;
  let mockGame;

  beforeEach(() => {
    mockGame = new MockGame();
    gui = new GUI(mockGame);
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test("Opening the game menu", ({ given, when, then, and }) => {
    given("the game is running", () => {
      // The game is already running in the setup
    });

    when('I click on the "Game Menu" button', () => {
      gui.toggleScreen("Game Menu");
    });

    then("the game menu should be displayed", () => {
      expect(gui.activeScreen).toBe("Game Menu");
    });

    and("the game should be paused", () => {
      expect(mockGame.setPaused).toHaveBeenCalledWith(true);
    });
  });

  test("Closing the game menu", ({ given, when, then, and }) => {
    given("the game menu is open", () => {
      gui.toggleScreen("Game Menu");
    });

    when('I click on the "Close" button', () => {
      gui.closeScreen();
    });

    then("the game menu should be closed", () => {
      expect(gui.activeScreen).toBeNull();
    });

    and("the game should resume", () => {
      expect(mockGame.setPaused).toHaveBeenCalledWith(false);
    });
  });

  test("Saving the game state", ({ given, when, then }) => {
    given("the game menu is open", () => {
      gui.toggleScreen("Game Menu");
    });

    when('I click on the "Save Game" button', () => {
      gui.saveGame();
    });

    then("the current game state should be saved", () => {
      expect(Cookie.save).toHaveBeenCalledWith("gameState", expect.any(String));
    });
  });

  test("Restoring the game state", ({ given, and, when, then }) => {
    given("the game menu is open", () => {
      gui.toggleScreen("Game Menu");
    });

    and("a saved game state exists", () => {
      const savedState = JSON.stringify({
        currentLevel: 2,
        playerEnergy: 80,
        playerHealth: 90,
        gamesCompleted: 1,
      });
      Cookie.get.mockReturnValue(savedState);
    });

    when('I click on the "Restore Game" button', () => {
      gui.restoreGame();
    });

    then("the saved game state should be restored", () => {
      expect(mockGame.reinitializeGameObjects).toHaveBeenCalled();
      expect(mockGame.gameState.currentLevel).toBe(2);
      expect(mockGame.gameState.playerEnergy).toBe(80);
      expect(mockGame.gameState.playerHealth).toBe(90);
      expect(mockGame.gameState.gamesCompleted).toBe(1);
    });
  });

  test("Deleting saved game data", ({ given, when, then }) => {
    given("the game menu is open", () => {
      gui.toggleScreen("Game Menu");
    });

    when('I click on the "Delete All" button', () => {
      gui.deleteAll();
    });

    then("all saved game data should be deleted", () => {
      expect(Cookie.toss).toHaveBeenCalledWith("gameState");
    });
  });

  test("Updating game state display", ({ given, when, then }) => {
    given("the game is running", () => {
      // The game is already running in the setup
    });

    when("the player completes a level", () => {
      mockGame.gameState.currentLevel++;
      gui.updateGameStateDisplay(mockGame.gameState.currentLevel);
    });

    then("the game state display should be updated with the new level", () => {
      const gameStateDisplay = document.getElementById("game-state-display");
      expect(gameStateDisplay.textContent).toContain("Level: 2");
    });
  });
});
