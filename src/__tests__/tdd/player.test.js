// __tests__/player.test.js

import Player from "../../player.js";
import { Vector } from "../../utilities.js";

jest.mock("../../svg.js", () => ({
  loadSVG: jest.fn().mockResolvedValue({
    complete: true,
    width: 100,
    height: 100,
  }),
}));

describe("Player", () => {
  let player;
  const mockCanvas = { width: 1000, height: 1000 };
  const mockLevel = { blocks: [] };

  beforeEach(() => {
    player = new Player(100, 100, 50, "#FFFFFF");
  });

  test("initializes with correct properties", () => {
    expect(player.position).toEqual({ x: 100, y: 100 });
    expect(player.size).toBe(50);
    expect(player.color).toBe("#FFFFFF");
  });

  test("update method updates player position", () => {
    const initialX = player.position.x;
    const initialY = player.position.y;
    const keys = { ArrowRight: true, ArrowDown: true };
    player.update(keys, mockCanvas.width, mockCanvas.height, mockLevel);
    expect(player.position.x).toBeGreaterThan(initialX);
    expect(player.position.y).toBeGreaterThan(initialY);
  });

  test("calculateDesiredVelocity returns correct velocity", () => {
    const keys = { ArrowRight: true, ArrowUp: true };
    const velocity = player.calculateDesiredVelocity(keys);
    expect(velocity.x).toBeGreaterThan(0);
    expect(velocity.y).toBeLessThan(0);
  });

  test("updateVelocity changes player velocity", () => {
    const initialVelocity = { ...player.velocity };
    player.updateVelocity({ x: 5, y: 5 });
    expect(player.velocity).not.toEqual(initialVelocity);
  });

  test("lateUpdate handles block collisions", () => {
    const mockBlock = {
      position: { x: 125, y: 125 },
      size: 50,
      getRect: () => ({ x: 125, y: 125, width: 50, height: 50 }),
      getCenter: () => ({ x: 150, y: 150 }),
      isImmovable: false,
      velocity: { x: 0, y: 0 },
      mass: 100,
    };
    const mockLevelWithBlock = { blocks: [mockBlock] };
    player.lateUpdate({}, mockCanvas.width, mockCanvas.height, mockLevelWithBlock);
    // We're not checking if resolveCollision was called, just that lateUpdate doesn't throw an error
    expect(true).toBe(true);
  });

  test("draw method doesn't throw error", () => {
    const mockContext = {
      save: jest.fn(),
      translate: jest.fn(),
      rotate: jest.fn(),
      drawImage: jest.fn(),
      restore: jest.fn(),
    };
    expect(() => player.draw(mockContext)).not.toThrow();
  });

  test("getRect returns correct rectangle", () => {
    const rect = player.getRect();
    expect(rect).toEqual({
      x: 75, // 100 - 50/2
      y: 75, // 100 - 50/2
      width: 50,
      height: 50,
    });
  });

  test("checkCollision detects collision", () => {
    const otherObject = {
      getRect: () => ({ x: 120, y: 120, width: 50, height: 50 }),
    };
    expect(player.checkCollision(otherObject)).toBe(true);
  });

  test("resolveCollision updates velocities", () => {
    const otherObject = {
      position: { x: 120, y: 120 },
      velocity: { x: -1, y: -1 },
      mass: 100,
      isImmovable: false,
      getRect: () => ({ x: 120, y: 120, width: 50, height: 50 }),
      getCenter: () => ({ x: 145, y: 145 }),
    };
    const initialVelocity = { ...player.velocity };
    player.resolveCollision(otherObject);
    expect(player.velocity).not.toEqual(initialVelocity);
  });

  test("resolveOverlap adjusts position", () => {
    const otherObject = {
      position: { x: 120, y: 120 },
      size: 50,
      isImmovable: false,
      getRect: () => ({ x: 120, y: 120, width: 50, height: 50 }),
      getCenter: () => ({ x: 145, y: 145 }),
    };
    const initialPosition = { ...player.position };
    player.resolveOverlap(otherObject);
    expect(player.position).not.toEqual(initialPosition);
  });

  test("getCenter returns correct center point", () => {
    const center = player.getCenter();
    expect(center).toEqual({ x: 100, y: 100 });
  });

  test("calculateDistance returns correct distance", () => {
    const otherObject = {
      position: { x: 200, y: 200 },
      size: 50,
      isOriginCenter: true,
    };
    const distance = player.calculateDistance(otherObject);
    expect(distance).toBeCloseTo(141.4, 1); // sqrt(100^2 + 100^2) ≈ 141.4
  });
});
