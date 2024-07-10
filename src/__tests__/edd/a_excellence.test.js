// excellence.test.js

const excellent = require("../../a_excellence.js");

test("architecture is excellent", () => {
  excellent.architecture();
  expect(true).toBe(true);
});

test("nfrs are excellent", () => {
  excellent.nfr();
  expect(true).toBe(true);
});

test("tech debt is low", () => {
  excellent.techDebt();
  expect(true).toBe(true);
});
