// src/__tests__/player.steps.js
import { defineFeature, loadFeature } from "jest-cucumber";
import Player from "../player.js";

// Mock the entire svg module
jest.mock("../svg.js", () => ({
  loadSVG: jest.fn().mockResolvedValue({
    // Mock the necessary properties of an Image object
    complete: true,
    width: 100,
    height: 100,
  }),
}));

const feature = loadFeature("./src/__tests__/player.feature");

defineFeature(feature, (test) => {
  let player;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test("Player initialization", ({ given, then }) => {
    given('a new player is created at position (100, 100) with size 50 and color "#FFFFFF"', () => {
      player = new Player(100, 100, 50, "#FFFFFF");
    });

    then("the player should have the correct initial properties", () => {
      expect(player.position).toEqual({ x: 100, y: 100 });
      expect(player.size).toBe(50);
      expect(player.color).toBe("#FFFFFF");
      expect(require("../svg.js").loadSVG).toHaveBeenCalled();
    });
  });

  test("Player movement", ({ given, when, then }) => {
    given('a new player is created at position (100, 100) with size 50 and color "#FFFFFF"', () => {
      player = new Player(100, 100, 50, "#FFFFFF");
    });

    when("the player moves right and down", () => {
      const keys = { ArrowRight: true, ArrowDown: true };
      player.update(keys, 1000, 1000, { blocks: [] });
    });

    then("the player's position should be updated accordingly", () => {
      expect(player.position.x).toBeGreaterThan(100);
      expect(player.position.y).toBeGreaterThan(100);
    });
  });
});
