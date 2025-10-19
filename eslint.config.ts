import js from '@eslint/js';
import globals from 'globals';
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';
import testingLibrary from 'eslint-plugin-testing-library';
import jestDom from 'eslint-plugin-jest-dom';

export default defineConfig([
  globalIgnores(['node_modules', 'coverage/']),
  {
    files: ['**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: {
      globals: { ...globals.node },
    },
  },
  tseslint.configs.strict,
  tseslint.configs.stylistic,
  {
    files: ['__tests__/**/*.test.{js,mjs,cjs,jsx,ts,mts,cts,tsx}'],
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
      // Jest globals are not injected automatically
      'testing-library/no-manual-cleanup': 'off',
    }
  },
]);
