import { TSESLint } from "@typescript-eslint/utils";
import { test } from "uvu";
import { propsOrderRule } from "../rules/props-order";

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
  tester.run("props-order", propsOrderRule, {
    valid: [
      {
        name: "Sorted style props",
        code: `
          import { Box } from "@chakra-ui/react";

          <Box as="div" key={key} m="1" px="2" onClick={onClick} {...props} py={2} fontSize="md">Hello</Box>
        `,
      },
      {
        name: "Not chakra element",
        code: `
          import { NotChakra } from "not-chakra";
          
          <NotChakra m="1" fontSize="md" px="2" py={2}>Hello</NotChakra>
        `,
      },
      {
        name: "Spreading should not be sorted",
        code: `
          import { Box } from "@chakra-ui/react";

          <Box py="2" {...props} as="div">Hello</Box>
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

          <Box as="div" key={key} m="1" px="2" onClick={onClick} {...props} py={2} fontSize="md">Hello</Box>
      `,
      },
      {
        name: "Multiple lines must not be concatenated",
        code: `
                import { Box } from "@chakra-ui/react";

                <Box
                  px="2"
                  as="div"
                  fontSize="md"
                  py={2}
                >
                  Hello
                </Box>;
            `,
        errors: [{ messageId: "invalidOrder" }],
        output: `
                import { Box } from "@chakra-ui/react";

                <Box
                  as="div"
                  px="2"
                  py={2}
                  fontSize="md"
                >
                  Hello
                </Box>;
            `,
      },
      {
        name: "Non chakra props should be sorted in alphabetical order",
        code: `
          import { Box } from "@chakra-ui/react";

          <Box onClick={onClick} data-test-id="data-test-id" data-index={1}>Hello</Box>
        `,
        errors: [{ messageId: "invalidOrder" }],
        output: `
          import { Box } from "@chakra-ui/react";

          <Box data-index={1} data-test-id="data-test-id" onClick={onClick}>Hello</Box>
        `,
      },
      {
        name: "Same priority should be sorted in defined order",
        code: `
          import { Box } from "@chakra-ui/react";

          <Box sx={sx} key={key} textStyle={textStyle} layerStyle={layerStyle} as={as}>Hello</Box>
        `,
        errors: [{ messageId: "invalidOrder" }],
        output: `
          import { Box } from "@chakra-ui/react";

          <Box as={as} key={key} sx={sx} layerStyle={layerStyle} textStyle={textStyle}>Hello</Box>
        `,
      },
    ],
  });
});

test.run();
