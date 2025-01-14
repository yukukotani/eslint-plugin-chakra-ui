import js from "@eslint/js";
import tseslint from "typescript-eslint";
import parser from "@typescript-eslint/parser";
import plugins from "@typescript-eslint/eslint-plugin";
import unusedImports from "eslint-plugin-unused-imports";
import globals from "globals";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    languageOptions: {
      parserOptions: {
        parser,
        ecmaVersion: 12,
        sourceType: "module",
        project: ["./tsconfig.json"],
        tsconfigRootDir: import.meta.dirname,
        globals: globals.node,
      },
    },
  },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.ts"],
    plugins: {
      "unused-imports": unusedImports,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        { vars: "all", varsIgnorePattern: "^_", args: "after-used", argsIgnorePattern: "^_" },
      ],
    },
  },
  {
    files: ["__tests__/**/*.js", "__tests__/**/*.{ts,tsx}"],
    languageOptions: {
      parserOptions: {
        globals: globals.mocha,
      },
    },
  },
);
