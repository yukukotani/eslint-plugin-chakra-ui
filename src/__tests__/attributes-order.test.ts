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
    ],
  });
});

test.run();

test.after(() => {
  setTimeout(() => {
    process.exit(0);
  }, 500);
});
