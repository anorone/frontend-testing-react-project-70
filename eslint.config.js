import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';
import testingLibrary from 'eslint-plugin-testing-library';
import jestDom from 'eslint-plugin-jest-dom';

/** @type {import('eslint').Linter.Config[]} */
export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: {
      globals: { ...globals.node },
    },
  },
  {
    files: ['__tests__/**/*.test.{js,mjs,cjs,jsx}'],
    languageOptions: {
      globals: { ...globals.browser },
    },
    plugins: {
      ...testingLibrary.configs['flat/react'].plugins,
      ...jestDom.configs['flat/recommended'].plugins,
    },
    rules: {
      ...testingLibrary.configs['flat/react'].rules,
      ...jestDom.configs['flat/recommended'].rules,
    }
  },
]);
