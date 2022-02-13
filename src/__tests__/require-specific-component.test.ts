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
        name: "Using Flex component",
        code: `
        import { Flex } from "@chakra-ui/react";

        <Flex margin="2" paddingTop={4}>Hello</Flex>
        `,
      },
      {
        name: "No specific component",
        code: `
        import { Box } from "@chakra-ui/react";

        <Box display="inline" margin="2" paddingTop={4}>Hello</Box>
        `,
      },
    ],
    invalid: [
      {
        name: "Require Flex component",
        code: `
          import { Box } from "@chakra-ui/react";

          <Box display="flex" margin="2" paddingTop={4}>Hello</Box>
        `,
        errors: [{ messageId: "requireSpecificComponent" }],
        output: `
          import { Box, Flex } from "@chakra-ui/react";

          <Flex margin="2" paddingTop={4}>Hello</Flex>
        `,
      },
      {
        name: "Require Image component",
        code: `
          import { Box } from "@chakra-ui/react";

          <Box as="img" src="https://example.com/bg.jpg" paddingTop={4} />
        `,
        errors: [{ messageId: "requireSpecificComponent" }],
        output: `
          import { Box, Image } from "@chakra-ui/react";

          <Image src="https://example.com/bg.jpg" paddingTop={4} />
        `,
      },
      {
        name: "Require Flex component with last attribute",
        code: `
          import { Box } from "@chakra-ui/react";

          <Box margin="2" paddingTop={4} display="flex">Hello</Box>
        `,
        errors: [{ messageId: "requireSpecificComponent" }],
        output: `
          import { Box, Flex } from "@chakra-ui/react";

          <Flex margin="2" paddingTop={4}>Hello</Flex>
        `,
      },
      {
        name: "Require Flex component with multi-line attributes",
        code: `
          import { Box } from "@chakra-ui/react";

          <Box
            display="flex"
            margin="2"
            paddingTop={4}
          >
            Hello
          </Box>
        `,
        errors: [{ messageId: "requireSpecificComponent" }],
        output: `
          import { Box, Flex } from "@chakra-ui/react";

          <Flex
            margin="2"
            paddingTop={4}
          >
            Hello
          </Flex>
        `,
      },
      {
        name: "Require Flex component with last attribute in multi-line attributes",
        code: `
          import { Box } from "@chakra-ui/react";

          <Box
            margin="2"
            paddingTop={4}
            display="flex"
          >
            Hello
          </Box>
        `,
        errors: [{ messageId: "requireSpecificComponent" }],
        output: `
          import { Box, Flex } from "@chakra-ui/react";

          <Flex
            margin="2"
            paddingTop={4}
          >
            Hello
          </Flex>
        `,
      },
      {
        name: "Require Flex component with multi-line import",
        code: `
          import { 
            Box,
            Text,
            List,
          } from "@chakra-ui/react";

          <Box display="flex" margin="2" paddingTop={4}>Hello</Box>
        `,
        errors: [{ messageId: "requireSpecificComponent" }],
        output: `
          import { 
            Box,
            Text,
            List,
            Flex,
          } from "@chakra-ui/react";

          <Flex margin="2" paddingTop={4}>Hello</Flex>
        `,
      },
      {
        name: "Require Flex component with already imported",
        code: `
          import { Box, Flex } from "@chakra-ui/react";

          <Box display="flex" margin="2" paddingTop={4}>Hello</Box>
        `,
        errors: [{ messageId: "requireSpecificComponent" }],
        output: `
          import { Box, Flex } from "@chakra-ui/react";

          <Flex margin="2" paddingTop={4}>Hello</Flex>
        `,
      },
      {
        name: "Require Flex component with shorthand props",
        code: `
          import { Box } from "@chakra-ui/react";

          <Box d="flex" margin="2" paddingTop={4}>Hello</Box>
        `,
        errors: [{ messageId: "requireSpecificComponent" }],
        output: `
          import { Box, Flex } from "@chakra-ui/react";

          <Flex margin="2" paddingTop={4}>Hello</Flex>
        `,
      },
    ],
  });
});

test.run();
