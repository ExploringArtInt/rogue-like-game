module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  transform: {
    "^.+\\.js$": ["babel-jest", { rootMode: "upward" }],
  },
  moduleFileExtensions: ["js", "feature"],
  testMatch: ["<rootDir>/__tests__/**/*.test.js", "<rootDir>/__tests__/**/*.steps.js"],
  transformIgnorePatterns: ["/node_modules/(?!(jest-cucumber)/)"],
};
