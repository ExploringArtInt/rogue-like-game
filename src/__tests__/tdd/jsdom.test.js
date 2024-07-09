/**
 * @jest-environment jsdom
 */
import "jest-canvas-mock";

describe("DOM Environment", () => {
  test("should be able to manipulate the DOM", () => {
    document.body.innerHTML = '<div id="root"></div>';
    const root = document.getElementById("root");
    expect(root).not.toBeNull();
  });
});

describe("jsdom environment", () => {
  test("should be able to manipulate the DOM", () => {
    document.body.innerHTML = '<div id="root"></div>';
    const root = document.getElementById("root");
    expect(root).not.toBeNull();
    root.innerHTML = "<span>Hello, jsdom!</span>";
    expect(root.innerHTML).toBe("<span>Hello, jsdom!</span>");
  });
});

describe("Canvas Tests", () => {
  let canvas;
  let ctx;

  beforeEach(() => {
    canvas = document.createElement("canvas");
    ctx = canvas.getContext("2d");
  });

  test("drawing operations", () => {
    ctx.fillRect(0, 0, 100, 100);
    expect(ctx.fillRect).toHaveBeenCalledWith(0, 0, 100, 100);
  });
});
