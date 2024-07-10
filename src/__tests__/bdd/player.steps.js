import Player from "../../player.js";
import { defineFeature, loadFeature } from "jest-cucumber";

const feature = loadFeature("./src/__tests__/bdd/player.feature.txt");

jest.mock("../../svg.js", () => ({
  loadSVG: jest.fn().mockResolvedValue({
    complete: true,
    width: 100,
    height: 100,
  }),
}));

defineFeature(feature, (test) => {
  let player;

  test("Player initialization", ({ given, then }) => {
    given('a new player is created at position (100, 100) with size 50 and color "#FFFFFF"', () => {
      player = new Player(100, 100, 50, "#FFFFFF");
    });

    then("the player should have the correct initial properties", () => {
      expect(player.position).toEqual({ x: 100, y: 100 });
      expect(player.size).toBe(50);
      expect(player.color).toBe("#FFFFFF");
      expect(player.velocity).toEqual({ x: 0, y: 0 });
    });
  });

  test("Player movement", ({ given, when, then }) => {
    given('a new player is created at position (100, 100) with size 50 and color "#FFFFFF"', () => {
      player = new Player(100, 100, 50, "#FFFFFF");
    });

    when("the player moves right and down", () => {
      const mockKeys = { ArrowRight: true, ArrowDown: true };
      const mockCanvas = { width: 1000, height: 1000 };
      const mockLevel = { blocks: [] };
      player.update(mockKeys, mockCanvas.width, mockCanvas.height, mockLevel);
    });

    then("the player's position should be updated accordingly", () => {
      expect(player.position.x).toBeGreaterThan(100);
      expect(player.position.y).toBeGreaterThan(100);
    });
  });
});
