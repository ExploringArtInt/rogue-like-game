import { defineFeature, loadFeature } from "jest-cucumber";
import GameState from "../../gameState.js";

const feature = loadFeature("./src/__tests__/bdd/gameState.feature.txt");

defineFeature(feature, (test) => {
  let gameState;

  test("Initializing a new game state", ({ given, then }) => {
    given("a new game is started", () => {
      gameState = new GameState();
    });

    then("the current level should be 1", () => {
      expect(gameState.currentLevel).toBe(1);
    });

    then("the player energy should be 100", () => {
      expect(gameState.playerEnergy).toBe(100);
    });

    then("the player health should be 100", () => {
      expect(gameState.playerHealth).toBe(100);
    });

    then("the games completed should be 0", () => {
      expect(gameState.gamesCompleted).toBe(0);
    });
  });

  test("Incrementing the level", ({ given, when, then }) => {
    given(/^the current level is (\d+)$/, (level) => {
      gameState = new GameState();
      gameState.currentLevel = parseInt(level);
    });

    when("the level is incremented", () => {
      gameState.incrementLevel();
    });

    then(/^the current level should be (\d+)$/, (level) => {
      expect(gameState.currentLevel).toBe(parseInt(level));
    });
  });

  test("Resetting the level", ({ given, when, then }) => {
    given(/^the current level is (\d+)$/, (level) => {
      gameState = new GameState();
      gameState.currentLevel = parseInt(level);
    });

    when("the level is reset", () => {
      gameState.resetLevel();
    });

    then(/^the current level should be (\d+)$/, (level) => {
      expect(gameState.currentLevel).toBe(parseInt(level));
    });
  });

  test("Setting player energy", ({ given, when, then }) => {
    given(/^the player energy is (\d+)$/, (energy) => {
      gameState = new GameState();
      gameState.setEnergy(parseInt(energy));
    });

    when(/^the player energy is set to (\d+)$/, (energy) => {
      gameState.setEnergy(parseInt(energy));
    });

    then(/^the player energy should be (\d+)$/, (energy) => {
      expect(gameState.playerEnergy).toBe(parseInt(energy));
    });
  });

  test("Setting player health", ({ given, when, then }) => {
    given(/^the player health is (\d+)$/, (health) => {
      gameState = new GameState();
      gameState.setHealth(parseInt(health));
    });

    when(/^the player health is set to (\d+)$/, (health) => {
      gameState.setHealth(parseInt(health));
    });

    then(/^the player health should be (\d+)$/, (health) => {
      expect(gameState.playerHealth).toBe(parseInt(health));
    });
  });

  test("Incrementing games completed", ({ given, when, then }) => {
    given(/^the games completed is (\d+)$/, (completed) => {
      gameState = new GameState();
      gameState.gamesCompleted = parseInt(completed);
    });

    when("a game is completed", () => {
      gameState.incrementGamesCompleted();
    });

    then(/^the games completed should be (\d+)$/, (completed) => {
      expect(gameState.gamesCompleted).toBe(parseInt(completed));
    });
  });

  test("Resetting the game state", ({ given, and, when, then }) => {
    given(/^the current level is (\d+)$/, (level) => {
      gameState = new GameState();
      gameState.currentLevel = parseInt(level);
    });

    and(/^the player energy is (\d+)$/, (energy) => {
      gameState.setEnergy(parseInt(energy));
    });

    and(/^the player health is (\d+)$/, (health) => {
      gameState.setHealth(parseInt(health));
    });

    when("the game state is reset", () => {
      gameState.reset();
    });

    then(/^the current level should be (\d+)$/, (level) => {
      expect(gameState.currentLevel).toBe(parseInt(level));
    });

    and(/^the player energy should be (\d+)$/, (energy) => {
      expect(gameState.playerEnergy).toBe(parseInt(energy));
    });

    and(/^the player health should be (\d+)$/, (health) => {
      expect(gameState.playerHealth).toBe(parseInt(health));
    });
  });

  test("Checking if the game is won", ({ given, then }) => {
    given(/^the current level is (\d+)$/, (level) => {
      gameState = new GameState();
      gameState.currentLevel = parseInt(level);
    });

    then("the game should be won", () => {
      expect(gameState.isGameWon()).toBe(true);
    });
  });

  test("Checking if the game is lost due to no energy", ({ given, then }) => {
    given(/^the player energy is (\d+)$/, (energy) => {
      gameState = new GameState();
      gameState.setEnergy(parseInt(energy));
    });

    then("the game should be lost", () => {
      expect(gameState.isGameLost()).toBe(true);
    });
  });

  test("Checking if the game is lost due to no health", ({ given, then }) => {
    given(/^the player health is (\d+)$/, (health) => {
      gameState = new GameState();
      gameState.setHealth(parseInt(health));
    });

    then("the game should be lost", () => {
      expect(gameState.isGameLost()).toBe(true);
    });
  });

  test("Serializing and deserializing game state", ({ given, when, then }) => {
    given("a game state with custom values", () => {
      gameState = new GameState();
      gameState.currentLevel = 3;
      gameState.setEnergy(75);
      gameState.setHealth(80);
      gameState.gamesCompleted = 2;
    });

    when("the game state is serialized and then deserialized", () => {
      const serialized = gameState.toJSON();
      gameState = new GameState();
      gameState.fromJSON(serialized);
    });

    then("the deserialized game state should match the original", () => {
      expect(gameState.currentLevel).toBe(3);
      expect(gameState.playerEnergy).toBe(75);
      expect(gameState.playerHealth).toBe(80);
      expect(gameState.gamesCompleted).toBe(2);
    });
  });
});
