import js from "@eslint/js";
import prettierConfig from "eslint-config-prettier";

export default [
  js.configs.recommended,
  prettierConfig,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        window: "readonly",
        document: "readonly",
        localStorage: "readonly",
        console: "readonly",
        setTimeout: "readonly",
        fetch: "readonly",
      },
    },
    rules: {
      "no-unused-vars": "warn",
      "no-console": "off",
      "curly": "error",
    },
  },
];
