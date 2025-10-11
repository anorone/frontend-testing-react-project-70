/** @type {import('jest').Config} */
const config = {
  injectGlobals: false,
  setupFiles: ['<rootDir>/setupEnv.js'],
  setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
  coverageProvider: 'v8',
  collectCoverageFrom: [
    "<rootDir>/node_modules/@hexlet/react-todo-app-with-backend/src/**/*.{jsx,js}",
  ],
  coveragePathIgnorePatterns: [
    'node_modules/(?!@hexlet/react-todo-app-with-backend/)',
  ],
  testEnvironment: 'jest-fixed-jsdom',
  transformIgnorePatterns: [
    'node_modules/(?!(@hexlet/react-todo-app-with-backend|until-async)/)',
  ],
};

export default config;
