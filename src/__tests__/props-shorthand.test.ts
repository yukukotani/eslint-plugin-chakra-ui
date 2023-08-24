import { TSESLint } from "@typescript-eslint/utils";
import { describe, it } from "vitest";
import { propsShorthandRule } from "../rules/props-shorthand";

TSESLint.RuleTester.describe = describe;
TSESLint.RuleTester.it = it;

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
      name: "Grid and Flex props",
      code: `
          import { Grid, Flex } from "@chakra-ui/react";

          <>
            <Grid gap={2}>Hello</Grid>
            <Flex gridGap={2} justify="center">Hello</Flex>
          </>
        `,
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
    {
      name: "Require Grid and Flex props shorthand",
      code: `
          import { Grid, Flex } from "@chakra-ui/react";

          <>
            <Grid gridGap={2}>Hello</Grid>
            <Flex gridGap={2} justifyContent="center">Hello</Flex>
          </>
      `,
      errors: [{ messageId: "enforcesShorthand" }, { messageId: "enforcesShorthand" }],
      output: `
          import { Grid, Flex } from "@chakra-ui/react";

          <>
            <Grid gap={2}>Hello</Grid>
            <Flex gridGap={2} justify="center">Hello</Flex>
          </>
      `,
    },
    {
      name: "Support JSXSpreadAttribute",
      code: `
          import { Grid, Flex } from "@chakra-ui/react";

          <>
            <Grid {...{w:2}} gridGap={2}>Hello</Grid>
            <Flex {...{w:2}} gridGap={2} justifyContent="center">Hello</Flex>
          </>
      `,
      errors: [{ messageId: "enforcesShorthand" }, { messageId: "enforcesShorthand" }],
      output: `
          import { Grid, Flex } from "@chakra-ui/react";

          <>
            <Grid {...{w:2}} gap={2}>Hello</Grid>
            <Flex {...{w:2}} gridGap={2} justify="center">Hello</Flex>
          </>
      `,
    },
  ],
});
