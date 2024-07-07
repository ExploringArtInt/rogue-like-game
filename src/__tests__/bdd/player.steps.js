import Player from "../../player.js";

jest.mock("../../svg.js", () => ({
  loadSVG: jest.fn().mockResolvedValue({
    complete: true,
    width: 100,
    height: 100,
  }),
}));

describe("Player", () => {
  let player;

  beforeEach(() => {
    player = new Player(100, 100, 50, "#FFFFFF");
  });

  test("initializes with correct properties", () => {
    expect(player.position).toEqual({ x: 100, y: 100 });
    expect(player.size).toBe(50);
    expect(player.color).toBe("#FFFFFF");
  });

  test("moves correctly", () => {
    const initialX = player.position.x;
    const initialY = player.position.y;
    const keys = { ArrowRight: true, ArrowDown: true };
    player.update(keys, 1000, 1000, { blocks: [] });
    expect(player.position.x).toBeGreaterThan(initialX);
    expect(player.position.y).toBeGreaterThan(initialY);
  });
});
