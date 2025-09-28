/** @type {import('jest').Config} */
const config = {
  injectGlobals: false,
  setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
  coverageProvider: 'v8',
  testEnvironment: 'jest-fixed-jsdom',
  transformIgnorePatterns: [
    'node_modules/(?!(@hexlet/react-todo-app-with-backend|until-async)/)',
  ],
};

export default config;
