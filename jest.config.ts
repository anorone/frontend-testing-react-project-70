import type { Config } from 'jest';

const config: Config = {
  injectGlobals: false,
  setupFiles: ['<rootDir>/setupEnv.ts'],
  setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
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
