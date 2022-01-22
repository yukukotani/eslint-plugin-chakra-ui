"use strict";

module.exports = {
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "plugin:eslint-plugin/recommended"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "unused-imports"],
  env: {
    node: true,
  },
  rules: {
    "@typescript-eslint/no-unused-vars": "off",
    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-vars": [
      "warn",
      { vars: "all", varsIgnorePattern: "^_", args: "after-used", argsIgnorePattern: "^_" },
    ],
  },
  overrides: [
    {
      files: ["tests/**/*.js"],
      env: { mocha: true },
    },
  ],
};
