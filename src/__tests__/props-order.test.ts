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
          <Box key={key} as="div" m="1" px="2" onClick={onClick} {...props} py={2} fontSize="md">Hello</Box>
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
          <Box py="2" {...props} as="div">Hello</Box>;
      `,
      },
      {
        name: "Last priority of style props should be placed before `other props`",
        // priorityGroups.at(-1).at(-1) is outline;
        code: `
          import { Box } from "@chakra-ui/react";
          <Box outline='outline' aaaa>Hello</Box>;
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
          <Box key={key} as="div" m="1" px="2" onClick={onClick} {...props} py={2} fontSize="md">Hello</Box>
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
          <Box sx={sx} textStyle={textStyle} layerStyle={layerStyle} as={as}>Hello</Box>
        `,
        errors: [{ messageId: "invalidOrder" }],
        output: `
          import { Box } from "@chakra-ui/react";
          <Box as={as} sx={sx} layerStyle={layerStyle} textStyle={textStyle}>Hello</Box>
        `,
      },
      {
        name: "Same priority should be sorted in defined order",
        code: `
        import { Box } from "@chakra-ui/react";
        <Box
          animation="animation"
          appearance="appearance"
          transform="transform"
          visibility="visibility"
          resize="resize"
          whiteSpace="whiteSpace"
          pointerEvents="pointerEvents"
          wordBreak="wordBreak"
          overflowWrap="overflowWrap"
          textOverflow="textOverflow"
          boxSizing="boxSizing"
          transformOrigin="transformOrigin"
          cursor="cursor"
          transition="transition"
          objectFit="objectFit"
          userSelect="userSelect"
          objectPosition="objectPosition"
          float="float"
          outline="outline"
        >
          Same priority should be sorted in defined order
        </Box>;
        `,
        errors: [{ messageId: "invalidOrder" }],
        output: `
        import { Box } from "@chakra-ui/react";
        <Box
          animation="animation"
          appearance="appearance"
          transform="transform"
          transformOrigin="transformOrigin"
          visibility="visibility"
          whiteSpace="whiteSpace"
          userSelect="userSelect"
          pointerEvents="pointerEvents"
          wordBreak="wordBreak"
          overflowWrap="overflowWrap"
          textOverflow="textOverflow"
          boxSizing="boxSizing"
          cursor="cursor"
          resize="resize"
          transition="transition"
          objectFit="objectFit"
          objectPosition="objectPosition"
          float="float"
          outline="outline"
        >
          Same priority should be sorted in defined order
        </Box>;
        `,
      },
      {
        name: "Different priorities should be sorted by priorities",
        code: `
          import { Box } from "@chakra-ui/react";
          <Box
            as={as}
            _hover={_hover}
            position={position}
            shadow={shadow}
            animation={animation}
            m={m}
            data-test-id={dataTestId}
            flex={flex}
            color={color}
            fontFamily={fontFamily}
            bg={bg}
            w={w}
            h={h}
            display={display}
            borderRadius={borderRadius}
            p={p}
            gridGap={gridGap}
          >
            Hello
          </Box>;
        `,
        errors: [{ messageId: "invalidOrder" }],
        output: `
          import { Box } from "@chakra-ui/react";
          <Box
            as={as}
            position={position}
            flex={flex}
            gridGap={gridGap}
            display={display}
            w={w}
            h={h}
            m={m}
            p={p}
            color={color}
            fontFamily={fontFamily}
            bg={bg}
            borderRadius={borderRadius}
            shadow={shadow}
            _hover={_hover}
            animation={animation}
            data-test-id={dataTestId}
          >
            Hello
          </Box>;
        `,
      },
      {
        name: "ReservedPriority should be sorted",
        code: `
          import { Box } from "@chakra-ui/react";
          <Box
            key={key}
            className={className}
            dangerouslySetInnerHtml={dangerouslySetInnerHtml}
            ref={ref}
          >
            Hello
          </Box>;
        `,
        errors: [{ messageId: "invalidOrder" }],
        output: `
          import { Box } from "@chakra-ui/react";
          <Box
            className={className}
            key={key}
            ref={ref}
            dangerouslySetInnerHtml={dangerouslySetInnerHtml}
          >
            Hello
          </Box>;
        `,
      },
      {
        name: "ReservedPriority should be sorted",
        code: `
          import { Box } from "@chakra-ui/react";
          <Box
            aria-label="aria-label"
            // variant={variant}
            className={className}
            p={p}
          >
            Hello
          </Box>;
        `,
        errors: [{ messageId: "invalidOrder" }],
        output: `
          import { Box } from "@chakra-ui/react";
          <Box
            className={className}
            // variant={variant}
            p={p}
            aria-label="aria-label"
          >
            Hello
          </Box>;
        `,
      },
      {
        name: "if keys are not reservedFirstProps, they should be sorted in alphabetical order",
        code: `
          import { Box } from "@chakra-ui/react";
          <Box
            className={className}
            key={key}
            ref={ref}
            aria-label="aria-label"
          >
            Hello
          </Box>;
        `,
        options: [
          {
            firstProps: [],
          },
        ],
        errors: [{ messageId: "invalidOrder" }],
        output: `
          import { Box } from "@chakra-ui/react";
          <Box
            aria-label="aria-label"
            className={className}
            key={key}
            ref={ref}
          >
            Hello
          </Box>;
        `,
      },
      {
        name: "if lastProps is specified, that must be the last.",
        code: `
          import { Box } from "@chakra-ui/react";
          <Box
            className={className}
            onClick={onClick}
            bg={bg}
            aria-label="aria-label"
          >
            onClick should be the last
          </Box>;
        `,
        options: [
          {
            lastProps: ["onClick", "aria-label"],
          },
        ],
        errors: [{ messageId: "invalidOrder" }],
        output: `
          import { Box } from "@chakra-ui/react";
          <Box
            className={className}
            bg={bg}
            onClick={onClick}
            aria-label="aria-label"
          >
            onClick should be the last
          </Box>;
        `,
      },
      {
        name: "if same property is set for both firstProps and lastProps, that of lastProps will be ignored.",
        code: `
          import { Box } from "@chakra-ui/react";
          <Box
            onClick={onClick}
            bg={bg}
            aria-label="aria-label"
          >
          If the same key is given different priorities in option, ignore all but the first.
          </Box>;
        `,
        options: [
          {
            lastProps: ["onClick", "aria-label"],
            firstProps: ["onClick", "aria-label"],
          },
        ],
        errors: [{ messageId: "invalidOrder" }],
        output: `
          import { Box } from "@chakra-ui/react";
          <Box
            onClick={onClick}
            aria-label="aria-label"
            bg={bg}
          >
          If the same key is given different priorities in option, ignore all but the first.
          </Box>;
        `,
      },
    ],
  });
});

test.run();
