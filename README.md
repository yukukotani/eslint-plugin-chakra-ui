# eslint-plugin-chakra-ui

[![npm](https://img.shields.io/npm/v/eslint-plugin-chakra-ui)](https://www.npmjs.com/package/eslint-plugin-chakra-ui)
[![license](https://img.shields.io/npm/l/eslint-plugin-chakra-ui)](https://github.com/Monchi/eslint-plugin-chakra-ui/blob/master/LICENSE)

ESLint rules for [Chakra UI](https://chakra-ui.com/).

## **Requirement**

This plugin depends on TypeScript to check whether the component is a Chakra component or not. You need to install `@typescript-eslint/parser` but you can still write vanilla JavaScript.

TypeScript 4.4 or higher is supported. We don't test 4.3 or below but it probably works.

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-chakra-ui`, `@typescript-eslint/parser`:

```sh
npm install eslint-plugin-chakra-ui @typescript-eslint/parser --save-dev
```

Then set the `parser` property and add `chakra-ui` to the `plugins` property of your `.eslintrc` configuration file:

```json
{
  "parser": "@typescript-eslint/parser",
  "plugins": ["chakra-ui"]
}
```

Now you can add chakra-ui rules:

```json
{
  "rules": {
    "chakra-ui/props-order": "error",
    "chakra-ui/props-shorthand": "error",
    "chakra-ui/require-specific-component": "error"
  }
}
```

## Supported Rules

Every rule is fixable with `eslint --fix`.

- [`props-order`](https://github.com/Monchi/eslint-plugin-chakra-ui/blob/master/docs/rules/props-order.md): Enforces order of properties to be semantical
- [`props-shorthand`](https://github.com/Monchi/eslint-plugin-chakra-ui/blob/master/docs/rules/props-shorthand.md): Enforces the usage of shorthand property or vice-versa
- [`require-specific-component`](https://github.com/Monchi/eslint-plugin-chakra-ui/blob/master/docs/rules/require-specific-component.md): Enforces the usage of specific Chakra components instead of Box components with an attribute.

## Prior Art

This plugin is inspired by [eslint-plugin-tailwind-css](https://github.com/francoismassart/eslint-plugin-tailwindcss).
