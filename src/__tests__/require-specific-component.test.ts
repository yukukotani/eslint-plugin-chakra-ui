import { afterAll, describe, it } from "vitest";
import { requireSpecificComponentRule } from "../rules/require-specific-component";
import { RuleTester } from "@typescript-eslint/rule-tester";
import path from "path";

RuleTester.describe = describe;
RuleTester.it = it;
RuleTester.afterAll = afterAll;

const tester = new RuleTester({
  languageOptions: {
    parserOptions: {
      ecmaVersion: 2020,
      ecmaFeatures: {
        jsx: true,
      },
      tsconfigRootDir: path.join(__dirname, "fixtures"),
      project: "./tsconfig.json",
    },
  },
});

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
      name: "Require Flex component in self-closing format",
      code: `
          import { Box } from "@chakra-ui/react";

          <Box display="flex" margin="2" paddingTop={4} />
        `,
      errors: [{ messageId: "requireSpecificComponent" }],
      output: `
          import { Box, Flex } from "@chakra-ui/react";

          <Flex margin="2" paddingTop={4} />
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
      name: "Require Flex component with multi-line attributes in self-closing format",
      code: `
          import { Box } from "@chakra-ui/react";

          <Box
            display="flex"
            margin="2"
            paddingTop={4}
          />
        `,
      errors: [{ messageId: "requireSpecificComponent" }],
      output: `
          import { Box, Flex } from "@chakra-ui/react";

          <Flex
            margin="2"
            paddingTop={4}
          />
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
      name: "Require Flex component with only one attribute",
      code: `
          import { Box } from "@chakra-ui/react";

          <Box display="flex">Hello</Box>
        `,
      errors: [{ messageId: "requireSpecificComponent" }],
      output: `
          import { Box, Flex } from "@chakra-ui/react";

          <Flex>Hello</Flex>
        `,
    },
    {
      name: "Require Flex component with only one attribute in multi-line format",
      code: `
          import { Box } from "@chakra-ui/react";

          <Box
            display="flex"
          >
            Hello
          </Box>
        `,
      errors: [{ messageId: "requireSpecificComponent" }],
      output: `
          import { Box, Flex } from "@chakra-ui/react";

          <Flex>
            Hello
          </Flex>
        `,
    },
    {
      name: "Require Flex component with only one attribute in self-closing format",
      code: `
          import { Box } from "@chakra-ui/react";

          <Box display="flex" />
        `,
      errors: [{ messageId: "requireSpecificComponent" }],
      output: `
          import { Box, Flex } from "@chakra-ui/react";

          <Flex />
        `,
    },

    {
      name: "Require Flex component with only one attribute in self-closing and multi-line format",
      code: `
          import { Box } from "@chakra-ui/react";

          <Box
            display="flex"
          />
        `,
      errors: [{ messageId: "requireSpecificComponent" }],
      output: `
          import { Box, Flex } from "@chakra-ui/react";

          <Flex />
        `,
    },
  ],
});
