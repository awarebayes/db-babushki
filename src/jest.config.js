/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  reporters: [
    "default",
    [
      "./node_modules/jest-html-reporter",
      {
        pageTitle: "Test Report",
      },
    ],
  ],
  testEnvironment: "node",
  globalSetup: "./node_service/tests/setup.js",
  globalTeardown: "./node_service/tests/teardown.js",
};
