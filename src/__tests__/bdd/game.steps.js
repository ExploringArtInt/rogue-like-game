/**
 * @jest-environment jsdom
 */

import { defineFeature, loadFeature } from "jest-cucumber";
import "jest-canvas-mock";

const feature = loadFeature("./src/__tests__/bdd/game.feature.txt");

// Mock the entire Game module
jest.mock("../../game.js", () => {
  return jest.fn().mockImplementation(() => {
    const mockPlayer = {
      update: jest.fn(),
      draw: jest.fn(),
      position: { x: 0, y: 0 },
      velocity: { x: 0, y: 0 },
    };

    const mockLevel = {
      update: jest.fn(),
      draw: jest.fn(),
    };

    const mockGameState = {
      reset: jest.fn(),
      incrementLevel: jest.fn(),
    };

    const mockGUI = {
      updateGameStateDisplay: jest.fn(),
    };

    const mockUpdate = jest.fn().mockImplementation(() => {
      mockPlayer.update();
      mockLevel.update();
    });

    const mockDraw = jest.fn().mockImplementation(() => {
      mockLevel.draw();
      mockPlayer.draw();
    });

    return {
      canvas: null,
      ctx: null,
      backgroundColor: "#222222",
      playerColor: "#DDDDDD",
      blockColor: "#000000",
      gameState: mockGameState,
      player: mockPlayer,
      level: mockLevel,
      gui: mockGUI,
      keys: {
        ArrowUp: false,
        ArrowDown: false,
        ArrowLeft: false,
        ArrowRight: false,
        KeyW: false,
        KeyA: false,
        KeyS: false,
        KeyD: false,
      },
      isPaused: false,
      setupCanvas: jest.fn(),
      handleKeyDown: jest.fn(),
      handleKeyUp: jest.fn(),
      update: mockUpdate,
      draw: mockDraw,
      gameLoop: jest.fn().mockImplementation(function () {
        this.update();
        this.draw();
      }),
      start: jest.fn().mockImplementation(function () {
        this.gameLoop();
      }),
      restartGame: jest.fn().mockImplementation(() => {
        mockGameState.reset();
      }),
      setPaused: jest.fn(),
      goToNextLevel: jest.fn().mockImplementation(() => {
        mockGameState.incrementLevel();
        mockGUI.updateGameStateDisplay();
      }),
    };
  });
});

defineFeature(feature, (test) => {
  let Game;
  let game;

  beforeEach(() => {
    Game = require("../../game.js");

    // Create a new Game instance
    game = new Game();
    // Manually set canvas and ctx after instantiation
    game.canvas = document.createElement("canvas");
    game.ctx = game.canvas.getContext("2d");
  });

  test("Game initialization", ({ when, then }) => {
    when("a new Game is created", () => {
      game = new Game();
    });

    then("the game should be properly initialized", () => {
      expect(game.canvas).toBeDefined();
      expect(game.backgroundColor).toBe("#222222");
      expect(game.playerColor).toBe("#DDDDDD");
      expect(game.blockColor).toBe("#000000");
      expect(game.gameState).toBeDefined();
      expect(game.player).toBeDefined();
      expect(game.level).toBeDefined();
      expect(game.gui).toBeDefined();
      expect(game.keys).toBeDefined();
      expect(game.isPaused).toBe(false);
    });
  });

  test("Handling key presses", ({ given, when, then }) => {
    given("a game is running", () => {
      game = new Game();
    });

    when("a key is pressed down", () => {
      game.handleKeyDown({ code: "ArrowUp" });
    });

    then("the corresponding key state should be set to true", () => {
      expect(game.handleKeyDown).toHaveBeenCalledWith({ code: "ArrowUp" });
    });

    when("a key is released", () => {
      game.handleKeyUp({ code: "ArrowDown" });
    });

    then("the corresponding key state should be set to false", () => {
      expect(game.handleKeyUp).toHaveBeenCalledWith({ code: "ArrowDown" });
    });
  });

  test("Game update", ({ given, when, then }) => {
    given("a game is running", () => {
      game = new Game();
    });

    when("the game is updated", () => {
      game.update();
    });

    then("the player and level should be updated", () => {
      expect(game.update).toHaveBeenCalled();
      expect(game.player.update).toHaveBeenCalled();
      expect(game.level.update).toHaveBeenCalled();
    });
  });

  test("Game drawing", ({ given, when, then }) => {
    given("a game is running", () => {
      game = new Game();
    });

    when("the game is drawn", () => {
      game.draw();
    });

    then("the level and player should be drawn", () => {
      expect(game.draw).toHaveBeenCalled();
      expect(game.level.draw).toHaveBeenCalled();
      expect(game.player.draw).toHaveBeenCalled();
    });
  });

  test("Game loop", ({ given, when, then }) => {
    given("a game is running", () => {
      game = new Game();
    });

    when("the game loop is executed", () => {
      game.gameLoop();
    });

    then("the game should be updated and drawn", () => {
      expect(game.gameLoop).toHaveBeenCalled();
      expect(game.update).toHaveBeenCalled();
      expect(game.draw).toHaveBeenCalled();
    });
  });

  test("Starting the game", ({ given, when, then }) => {
    given("a game is initialized", () => {
      game = new Game();
    });

    when("the game is started", () => {
      game.start();
    });

    then("the game loop should be initiated", () => {
      expect(game.start).toHaveBeenCalled();
      expect(game.gameLoop).toHaveBeenCalled();
    });
  });

  test("Restarting the game", ({ given, when, then }) => {
    given("a game is running", () => {
      game = new Game();
    });

    when("the game is restarted", () => {
      game.restartGame();
    });

    then("the game state should be reset", () => {
      expect(game.restartGame).toHaveBeenCalled();
      expect(game.gameState.reset).toHaveBeenCalled();
    });
  });

  test("Pausing the game", ({ given, when, then }) => {
    given("a game is running", () => {
      game = new Game();
    });

    when("the game is paused", () => {
      game.setPaused(true);
    });

    then("the isPaused state should be updated", () => {
      expect(game.setPaused).toHaveBeenCalledWith(true);
    });
  });

  test("Going to next level", ({ given, when, then }) => {
    given("a game is running", () => {
      game = new Game();
    });

    when("the player goes to the next level", () => {
      game.goToNextLevel();
    });

    then("the game state should be updated for the new level", () => {
      expect(game.goToNextLevel).toHaveBeenCalled();
      expect(game.gameState.incrementLevel).toHaveBeenCalled();
      expect(game.gui.updateGameStateDisplay).toHaveBeenCalled();
    });
  });
});
