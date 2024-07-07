// __tests__/block.test.js

import Block from "../../block.js";
import Player from "../../player.js";

jest.mock("../../svg.js", () => ({
  loadSVG: jest.fn().mockResolvedValue({
    complete: true,
    width: 100,
    height: 100,
  }),
}));

describe("Block", () => {
  let block;
  let player;

  beforeEach(() => {
    block = new Block(100, 100, 50, "#000000");
    player = new Player(200, 200, 40, "#FFFFFF");
  });

  test("resolveCollision updates velocities or positions", () => {
    // Set up a scenario where a collision occurs
    block.position = { x: 100, y: 100 };
    player.position = { x: 125, y: 125 };
    const initialBlockVelocity = { x: 0, y: 0 };
    const initialBlockPosition = { ...block.position };
    block.velocity = { ...initialBlockVelocity };
    player.velocity = { x: 5, y: 5 };

    block.resolveCollision(player);

    // Check if either velocity or position has changed
    const velocityChanged = block.velocity.x !== initialBlockVelocity.x || block.velocity.y !== initialBlockVelocity.y;
    const positionChanged = block.position.x !== initialBlockPosition.x || block.position.y !== initialBlockPosition.y;

    expect(velocityChanged || positionChanged).toBe(true);
  });

  test("checkPlayerProximity detects player near door", () => {
    const doorBlock = new Block(100, 100, 50, "#000000", "door");
    player.position = { x: 125, y: 125 };
    doorBlock.checkPlayerProximity(player);
    expect(doorBlock.playerNearby).toBe(true);
  });

  test("checkDoorUse returns true when player uses door", () => {
    const doorBlock = new Block(100, 100, 50, "#000000", "door");
    player.position = { x: 125, y: 125 };
    expect(doorBlock.checkDoorUse(player)).toBe(true);
  });

  test("draw method doesn't throw error", () => {
    const mockContext = {
      drawImage: jest.fn(),
    };
    expect(() => block.draw(mockContext)).not.toThrow();
  });
});
