import { TSESLint } from "@typescript-eslint/experimental-utils";
import { test } from "uvu";
import { attributesOrder } from "../rules/attributes-order";
import { createRequire } from "module";

const tester = new TSESLint.RuleTester({
  parser: createRequire(__filename).resolve("espree"),
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
});

test("test", () => {
  tester.run("attributes-order", attributesOrder, {
    valid: [
      { code: 'import { BB } from "chakra-ui"; \n<span>{`${1}`}</span>' },
    ],
    invalid: [],
  });
});

test.run();

test.after(() => {
  setTimeout(() => {
    process.exit(0);
  }, 500);
});
