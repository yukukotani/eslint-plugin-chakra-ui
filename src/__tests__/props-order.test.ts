import { TSESLint } from "@typescript-eslint/experimental-utils";
import { test } from "uvu";
import { propsOrderRule } from "../rules/props-order";

const tester = new TSESLint.RuleTester({
  parser: require("espree"),
  parserOptions: {
    ecmaVersion: 2015,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
});

test("test", () => {
  tester.run("props-order", propsOrderRule, {
    valid: [
      {
        name: "Sorted style props",
        code: `
          import { Box } from "@chakra-ui/react";
          
          <Box as="div" key={key} m="1" px="2" py={2} fontSize="md" onClick={onClick} {...props}>Hello</Box>
        `,
      },
      {
        name: "Not chakra element",
        code: `
          import { NotChakra } from "not-chakra";
          
          <NotChakra m="1" fontSize="md" px="2" py={2}>Hello</NotChakra>
        `,
      },
    ],
    invalid: [
      {
        name: "Not sorted",
        code: `
          import { Box } from "@chakra-ui/react";
            
          <Box px="2" as="div" onClick={onClick} m="1" key={key} {...props} fontSize="md" py={2}>Hello</Box>
      `,
        errors: [{ messageId: "invalidOrder" }],
        output: `
          import { Box } from "@chakra-ui/react";
            
          <Box as="div" key={key} m="1" px="2" py={2} fontSize="md" onClick={onClick} {...props}>Hello</Box>
      `,
      },
      {
        name: "Default Import",
        code: `
          import Chakra from "@chakra-ui/react";
          
          <Chakra.Box key={key} as="div"  m="1" px="2" py={2} fontSize="md" onClick={onClick} {...props}>Hello</Chakra.Box>
        `,
        errors: [{ messageId: "invalidOrder" }],
        output: `
          import { Box } from "@chakra-ui/react";
            
          <Chakra.Box as="div" key={key} m="1" px="2" py={2} fontSize="md" onClick={onClick} {...props}>Hello</Chakra.Box>
      `,
      },
      {
        name: "Namespace Import",
        code: `
          import * from "@chakra-ui/react";
          
          <Box key={key} as="div"  m="1" px="2" py={2} fontSize="md" onClick={onClick} {...props}>Hello</Box>
        `,
        errors: [{ messageId: "invalidOrder" }],
        output: `
          import { Box } from "@chakra-ui/react";
            
          <Box as="div" key={key} m="1" px="2" py={2} fontSize="md" onClick={onClick} {...props}>Hello</Box>
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
