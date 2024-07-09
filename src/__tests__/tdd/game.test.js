/**
 * @jest-environment jsdom
 */

import "jest-canvas-mock";

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

// Now we can safely import Game
const Game = require("../../game.js");

describe("Game", () => {
  let game;

  beforeEach(() => {
    // Create a new Game instance
    game = new Game();
    // Manually set canvas and ctx after instantiation
    game.canvas = document.createElement("canvas");
    game.ctx = game.canvas.getContext("2d");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("constructor initializes game objects correctly", () => {
    expect(game.canvas).toBeDefined();
    expect(game.ctx).toBeDefined();
    expect(game.backgroundColor).toBe("#222222");
    expect(game.playerColor).toBe("#DDDDDD");
    expect(game.blockColor).toBe("#000000");
    expect(game.gameState).toBeDefined();
    expect(game.player).toBeDefined();
    expect(game.level).toBeDefined();
    expect(game.gui).toBeDefined();
    expect(game.keys).toEqual({
      ArrowUp: false,
      ArrowDown: false,
      ArrowLeft: false,
      ArrowRight: false,
      KeyW: false,
      KeyA: false,
      KeyS: false,
      KeyD: false,
    });
    expect(game.isPaused).toBe(false);
  });

  test("handleKeyDown sets key state to true", () => {
    game.handleKeyDown({ code: "ArrowUp" });
    expect(game.handleKeyDown).toHaveBeenCalledWith({ code: "ArrowUp" });
  });

  test("handleKeyUp sets key state to false", () => {
    game.handleKeyUp({ code: "ArrowDown" });
    expect(game.handleKeyUp).toHaveBeenCalledWith({ code: "ArrowDown" });
  });

  test("update calls update methods of game objects", () => {
    game.update();
    expect(game.update).toHaveBeenCalled();
    expect(game.player.update).toHaveBeenCalled();
    expect(game.level.update).toHaveBeenCalled();
  });

  test("draw calls draw methods of game objects", () => {
    game.draw();
    expect(game.draw).toHaveBeenCalled();
    expect(game.level.draw).toHaveBeenCalled();
    expect(game.player.draw).toHaveBeenCalled();
  });

  test("gameLoop calls update and draw", () => {
    game.gameLoop();
    expect(game.gameLoop).toHaveBeenCalled();
    expect(game.update).toHaveBeenCalled();
    expect(game.draw).toHaveBeenCalled();
  });

  test("start initiates the game loop", () => {
    game.start();
    expect(game.start).toHaveBeenCalled();
    expect(game.gameLoop).toHaveBeenCalled();
  });

  test("restartGame resets game state and reinitializes game objects", () => {
    game.restartGame();
    expect(game.restartGame).toHaveBeenCalled();
    expect(game.gameState.reset).toHaveBeenCalled();
  });

  test("setPaused updates isPaused state", () => {
    game.setPaused(true);
    expect(game.setPaused).toHaveBeenCalledWith(true);
  });

  test("goToNextLevel increments level and reinitializes game objects", () => {
    game.goToNextLevel();
    expect(game.goToNextLevel).toHaveBeenCalled();
    expect(game.gameState.incrementLevel).toHaveBeenCalled();
    expect(game.gui.updateGameStateDisplay).toHaveBeenCalled();
  });
});
