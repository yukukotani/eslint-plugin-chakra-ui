import { TSESLint } from "@typescript-eslint/utils";
import { test } from "uvu";
import { requireSpecificComponentRule } from "../rules/require-specific-component";

const tester = new TSESLint.RuleTester({
  parser: require.resolve("@typescript-eslint/parser"),
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
});

test("test", () => {
  tester.run("require-specific-component", requireSpecificComponentRule, {
    valid: [
      {
        name: "Shorthand",
        code: `
          import { Box } from "@chakra-ui/react";
          
          <Box m="2" pt={4}>Hello</Box>
        `,
      },
    ],
    invalid: [
      {
        name: "Require shorthand",
        code: `
          import { Box } from "@chakra-ui/react";
            
          <Box display="flex" margin="2" paddingTop={4}>Hello</Box>
      `,
        errors: [{ messageId: "requireSpecificComponent" }],
      },
    ],
  });
});

test.run();
