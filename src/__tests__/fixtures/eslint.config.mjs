import path from "path";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import parser from "@typescript-eslint/parser";
import globals from "globals";

// Is it possible to view the source code without building it?
import chakraUiPlugin from "../../../dist/index.js";

export default tseslint.config(
  {
    languageOptions: {
      parserOptions: {
        parser,
        ecmaVersion: 12,
        sourceType: "module",
        project: ["./tsconfig.json"],
        tsconfigRootDir: path.resolve("./src/__tests__/fixtures"), // path.join(import.meta.diename, ".."),
        globals: globals.browser,
      },
    },
  },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.tsx"],
    plugins: {
      "chakra-ui": chakraUiPlugin,
    },
    rules: {
      ...chakraUiPlugin.configs.recommended,
    },
  },
);
