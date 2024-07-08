/**
 * @jest-environment jsdom
 */

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
