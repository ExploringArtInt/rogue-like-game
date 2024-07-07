// __tests__/tdd/bulk.test.js

import Bulk from "../../bulk.js";
import { Vector } from "../../utilities.js";

jest.mock("../../svg.js", () => ({
  loadSVG: jest.fn().mockResolvedValue({
    complete: true,
    width: 100,
    height: 100,
  }),
}));

describe("Bulk", () => {
  let bulk;

  beforeEach(() => {
    bulk = new Bulk(100, 100, 50, "#000000", "./test.svg", 2500, false, false);
  });

  test("constructor initializes properties correctly", () => {
    expect(bulk.position).toEqual({ x: 100, y: 100 });
    expect(bulk.size).toBe(50);
    expect(bulk.color).toBe("#000000");
    expect(bulk.mass).toBe(2500);
    expect(bulk.isOriginCenter).toBe(false);
    expect(bulk.isImmovable).toBe(false);
  });

  test("getRect returns correct rectangle", () => {
    const rect = bulk.getRect();
    expect(rect).toEqual({
      x: 100,
      y: 100,
      width: 50,
      height: 50,
    });
  });

  test("update method updates position based on velocity", () => {
    bulk.velocity = { x: 5, y: 5 };
    bulk.update(1000, 1000);
    expect(bulk.position.x).toBe(105);
    expect(bulk.position.y).toBe(105);
  });

  test("applyFriction reduces velocity", () => {
    bulk.velocity = { x: 10, y: 10 };
    bulk.applyFriction();
    expect(bulk.velocity.x).toBeLessThan(10);
    expect(bulk.velocity.y).toBeLessThan(10);
  });

  test("constrainPosition keeps bulk within canvas", () => {
    bulk.position = { x: -10, y: -10 };
    bulk.constrainPosition(1000, 1000);
    expect(bulk.position.x).toBe(0);
    expect(bulk.position.y).toBe(0);
  });

  test("checkCollision detects collision with another bulk", () => {
    const other = new Bulk(125, 125, 50, "#FFFFFF", "./test.svg", 2500, false, false);
    expect(bulk.checkCollision(other)).toBe(true);
  });

  test("resolveCollision updates velocities of colliding bulks", () => {
    const other = new Bulk(125, 125, 50, "#FFFFFF", "./test.svg", 2500, false, false);
    bulk.velocity = { x: 5, y: 0 };
    other.velocity = { x: -5, y: 0 };
    bulk.resolveCollision(other);
    expect(bulk.velocity.x).toBeLessThan(5);
    expect(other.velocity.x).toBeGreaterThan(-5);
  });

  test("resolveOverlap adjusts positions to prevent overlap", () => {
    const other = new Bulk(125, 125, 50, "#FFFFFF", "./test.svg", 2500, false, false);
    const initialBulkPosition = { ...bulk.position };
    const initialOtherPosition = { ...other.position };

    bulk.resolveOverlap(other);

    const bulkMoved = bulk.position.x !== initialBulkPosition.x || bulk.position.y !== initialBulkPosition.y;
    const otherMoved = other.position.x !== initialOtherPosition.x || other.position.y !== initialOtherPosition.y;

    expect(bulkMoved || otherMoved).toBe(true);

    const initialDistance = Math.hypot(initialBulkPosition.x - initialOtherPosition.x, initialBulkPosition.y - initialOtherPosition.y);
    const finalDistance = Math.hypot(bulk.position.x - other.position.x, bulk.position.y - other.position.y);
    expect(finalDistance).toBeGreaterThan(initialDistance);
  });

  test("getCenter returns correct center point", () => {
    const center = bulk.getCenter();
    expect(center).toEqual({ x: 125, y: 125 });
  });

  test("calculateDistance returns correct distance to another bulk", () => {
    const other = new Bulk(200, 200, 50, "#FFFFFF", "./test.svg", 2500, false, false);
    const distance = bulk.calculateDistance(other);
    expect(distance).toBeCloseTo(Math.sqrt(2) * 100, 5);
  });

  test("draw method doesn't throw error", () => {
    const mockContext = {
      drawImage: jest.fn(),
    };
    expect(() => bulk.draw(mockContext)).not.toThrow();
  });

  // Updated test case for immovable bulk
  test("update method does not change position for immovable bulk", () => {
    const immovableBulk = new Bulk(100, 100, 50, "#000000", "./test.svg", 2500, false, true);
    const initialPosition = { ...immovableBulk.position };
    immovableBulk.velocity = { x: 5, y: 5 };
    immovableBulk.update(1000, 1000);
    expect(immovableBulk.position).toEqual(initialPosition);
  });

  test("resolveCollision does not change velocity for immovable bulk", () => {
    const immovableBulk = new Bulk(100, 100, 50, "#000000", "./test.svg", 2500, false, true);
    const other = new Bulk(125, 125, 50, "#FFFFFF", "./test.svg", 2500, false, false);
    immovableBulk.velocity = { x: 0, y: 0 };
    other.velocity = { x: -5, y: 0 };
    immovableBulk.resolveCollision(other);
    expect(immovableBulk.velocity).toEqual({ x: 0, y: 0 });
    expect(other.velocity.x).toBeGreaterThan(-5);
  });

  test("getRect returns correct rectangle for origin-centered bulk", () => {
    const centeredBulk = new Bulk(100, 100, 50, "#000000", "./test.svg", 2500, true, false);
    const rect = centeredBulk.getRect();
    expect(rect).toEqual({
      x: 75,
      y: 75,
      width: 50,
      height: 50,
    });
  });

  test("loadSVG is called with correct parameters", () => {
    expect(jest.requireMock("../../svg.js").loadSVG).toHaveBeenCalledWith("./test.svg", "#000000");
  });
});
