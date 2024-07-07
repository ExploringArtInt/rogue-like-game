module.exports = {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.js$": ["babel-jest", { rootMode: "upward" }],
  },
  moduleFileExtensions: ["js", "feature"],
  testMatch: ["**/*.steps.js"],
  transformIgnorePatterns: ["/node_modules/(?!(jest-cucumber)/)"],
};
