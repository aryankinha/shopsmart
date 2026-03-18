import js from "@eslint/js";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";

export default [
  js.configs.recommended,
  {
    files: ["**/*.js", "**/*.jsx"],
    plugins: {
      react,
      "react-hooks": reactHooks
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: { jsx: true }
      },
      globals: {
        window: true,
        document: true,
        console: true,
        fetch: true,
        setTimeout: true,
        clearTimeout: true,
        setInterval: true,
        clearInterval: true,
        // Vitest globals
        describe: true,
        it: true,
        test: true,
        expect: true,
        beforeAll: true,
        afterAll: true,
        beforeEach: true,
        afterEach: true,
        vi: true
      }
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "no-unused-vars": "warn",
      "no-undef": "error"
    },
    settings: { react: { version: "detect" } }
  },
  {
    files: ["playwright.config.js", "vite.config.js"],
    languageOptions: {
      globals: { process: true }
    }
  }
];
