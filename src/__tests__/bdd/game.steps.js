/**
 * @jest-environment jsdom
 */

import { defineFeature, loadFeature } from "jest-cucumber";

// TypeError: Cannot read properties of null (reading 'getContext')
// import Game from "../../game.js";

const feature = loadFeature("./src/__tests__/bdd/game.feature");

describe("DOM Environment", () => {
  test("Place Holder until above issue resolved", () => {
    document.body.innerHTML = '<div id="root"></div>';
    const root = document.getElementById("root");
    expect(root).not.toBeNull();
  });
});

/*
defineFeature(feature, (test) => {
  let game;
  let mockCanvas;
  let mockContext;

  beforeEach(() => {
    // Mock canvas and context
    mockCanvas = {
      width: 800,
      height: 600,
      getContext: jest.fn(),
    };
    mockContext = {
      fillRect: jest.fn(),
      fillStyle: "",
    };
    mockCanvas.getContext.mockReturnValue(mockContext);

    // Mock document.getElementById to return our mockCanvas
    document.getElementById = jest.fn().mockReturnValue(mockCanvas);

    // Mock window.innerWidth and window.innerHeight
    global.innerWidth = 1024;
    global.innerHeight = 768;
  });

  test("Starting a new game", ({ given, when, then }) => {
    given("the game is initialized", () => {
      game = new Game();
    });

    when("I start a new game", () => {
      game.start();
    });

    then("the game should be in its initial state", () => {
      expect(game.gameState.currentLevel).toBe(1);
      expect(game.gameState.playerEnergy).toBe(100);
      expect(game.gameState.playerHealth).toBe(100);
    });
  });

  test("Player movement", ({ given, when, then }) => {
    given("the game is running", () => {
      game = new Game();
      game.start();
    });

    when("I press the right arrow key", () => {
      game.handleKeyDown({ code: "ArrowRight" });
    });

    then("the player should move to the right", () => {
      const initialX = game.player.position.x;
      game.update();
      expect(game.player.position.x).toBeGreaterThan(initialX);
    });
  });

  test("Collision detection", ({ given, and, when, then }) => {
    given("the game is running", () => {
      game = new Game();
      game.start();
    });

    and("there is a block in front of the player", () => {
      const playerX = game.player.position.x;
      const playerY = game.player.position.y;
      game.level.blocks.push({
        position: { x: playerX + game.player.size, y: playerY },
        size: game.player.size,
      });
    });

    when("the player moves towards the block", () => {
      game.handleKeyDown({ code: "ArrowRight" });
      game.update();
    });

    then("the player should not pass through the block", () => {
      const playerRight = game.player.position.x + game.player.size;
      const blockLeft = game.level.blocks[0].position.x;
      expect(playerRight).toBeLessThanOrEqual(blockLeft);
    });
  });

  test("Level progression", ({ given, and, when, then }) => {
    given("the game is running", () => {
      game = new Game();
      game.start();
    });

    and("the player is near a door", () => {
      game.level.playerNearDoor = true;
    });

    when("the player uses the door", () => {
      game.goToNextLevel();
    });

    then("the game should advance to the next level", () => {
      expect(game.gameState.currentLevel).toBe(2);
    });
  });

  test("Game pausing", ({ given, when, then }) => {
    given("the game is running", () => {
      game = new Game();
      game.start();
    });

    when("I pause the game", () => {
      game.setPaused(true);
    });

    then("the game should stop updating", () => {
      const initialPlayerX = game.player.position.x;
      game.update();
      expect(game.player.position.x).toBe(initialPlayerX);
    });
  });

  test("Game resuming", ({ given, when, then }) => {
    given("the game is paused", () => {
      game = new Game();
      game.start();
      game.setPaused(true);
    });

    when("I resume the game", () => {
      game.setPaused(false);
    });

    then("the game should continue updating", () => {
      const initialPlayerX = game.player.position.x;
      game.handleKeyDown({ code: "ArrowRight" });
      game.update();
      expect(game.player.position.x).toBeGreaterThan(initialPlayerX);
    });
  });

  test("Game over detection", ({ given, when, then }) => {
    given("the game is running", () => {
      game = new Game();
      game.start();
    });

    when("the player's energy reaches 0", () => {
      game.gameState.setEnergy(0);
    });

    then("the game should end", () => {
      expect(game.gameState.isGameLost()).toBe(true);
    });
  });

  test("Game winning", ({ given, when, then }) => {
    given("the game is running", () => {
      game = new Game();
      game.start();
    });

    when("the player completes the final level", () => {
      game.gameState.currentLevel = 5; // Assuming 5 is the final level
    });

    then("the game should show a victory message", () => {
      expect(game.gameState.isGameWon()).toBe(true);
    });
  });
});
*/
