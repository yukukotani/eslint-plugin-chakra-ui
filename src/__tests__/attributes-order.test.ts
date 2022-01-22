import { TSESLint } from "@typescript-eslint/experimental-utils";
import { test } from "uvu";
import { attributesOrder } from "../rules/attributes-order";
import { createRequire } from "module";

const tester = new TSESLint.RuleTester({
  parser: createRequire(__filename).resolve("@typescript-eslint/parser"),
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
      {
        code: `
          import { Box } from "@chakra-ui/react";
          
          <Box mx="1" ml="2" px="2" color="red">aaa</Box>
        `,
      },
    ],
    invalid: [
      {
        code: `
        import { Box } from "@chakra-ui/react";
        
        <Box mx="1" ml="2" color="red" mr="2" px="2">aaa</Box>
      `,
        errors: [{ messageId: "invalidOrder" }],
      },
    ],
  });
});

test.run();

test.after(() => {
  setTimeout(() => {
    process.exit(0);
  }, 500);
});
