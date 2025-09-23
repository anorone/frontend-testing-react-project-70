/** @type {import('jest').Config} */
const config = {
  injectGlobals: false,
  setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  transformIgnorePatterns: ['node_modules/(?!(@hexlet/react-todo-app-with-backend)/)'],
};

export default config;
