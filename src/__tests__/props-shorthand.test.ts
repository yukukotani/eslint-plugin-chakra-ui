import { TSESLint } from "@typescript-eslint/experimental-utils";
import { test } from "uvu";
import { createRequire } from "module";
import { propsShorthandRule } from "../rules/props-shorthand";

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
  tester.run("props-shorthand", propsShorthandRule, {
    valid: [
      {
        name: "Shorthand",
        code: `
          import { Box } from "@chakra-ui/react";
          
          <Box m="2" pt={4}>Hello</Box>
        `,
      },
      {
        name: "No Shorthand",
        code: `
          import { Box } from "@chakra-ui/react";
          
          <Box margin="2" paddingTop={4}>Hello</Box>
        `,
        options: [{ noShorthand: true }],
      },
      {
        name: "Not chakra element",
        code: `
          import { NotChakra } from "not-chakra";
          
          <NotChakra margin="1">Hello</NotChakra>
        `,
      },
    ],
    invalid: [
      {
        name: "Require shorthand",
        code: `
          import { Box } from "@chakra-ui/react";
            
          <Box margin="2" paddingTop={4}>Hello</Box>
      `,
        errors: [{ messageId: "enforcesShorthand" }, { messageId: "enforcesShorthand" }],
        output: `
          import { Box } from "@chakra-ui/react";
            
          <Box m="2" pt={4}>Hello</Box>
      `,
      },
      {
        name: "Require no shorthand",
        code: `
          import { Box } from "@chakra-ui/react";
            
          <Box m="2" pt={4}>Hello</Box>
      `,
        options: [{ noShorthand: true }],
        errors: [{ messageId: "enforcesNoShorthand" }, { messageId: "enforcesNoShorthand" }],
        output: `
          import { Box } from "@chakra-ui/react";
            
          <Box margin="2" paddingTop={4}>Hello</Box>
      `,
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
