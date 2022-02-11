import { AST_NODE_TYPES, TSESLint } from "@typescript-eslint/utils";
import { isChakraElement } from "../lib/isChakraElement";
import { getNonShorthand } from "../lib/getShorthand";

export const requireSpecificComponentRule: TSESLint.RuleModule<"requireSpecificComponent", []> = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Enforces the usage of shorthand Chakra component props.",
      recommended: "error",
      url: "https://github.com/Monchi/eslint-plugin-chakra-ui/blob/master/docs/rules/require-layout-component.md",
    },
    messages: {
      requireSpecificComponent: "Component '{{invalidComponent}}' could be replaced by {{validComponent}}'.",
    },
    schema: [],
    fixable: "code",
  },

  create: ({ parserServices, report, getSourceCode }) => {
    if (!parserServices) {
      return {};
    }

    return {
      JSXOpeningElement(node) {
        if (!isChakraElement(node, parserServices)) {
          return;
        }

        const sourceCode = getSourceCode();
        const componentName = sourceCode.getText(node.name);
        if (componentName !== "Box") {
          return;
        }

        for (const attribute of node.attributes) {
          if (attribute.type !== AST_NODE_TYPES.JSXAttribute) {
            continue;
          }

          if (attribute.value == null) {
            continue;
          }

          const rawAttributeName = sourceCode.getText(attribute.name);
          const attributeName = getNonShorthand(componentName, rawAttributeName) || rawAttributeName;
          if (!attributeMap[attributeName]) {
            return;
          }

          const rawAttributeValue = sourceCode.getText(attribute.value);
          // strip quote
          const attributeValue = rawAttributeValue.slice(1, rawAttributeValue.length - 1);
          if (attributeMap[attributeName][attributeValue]) {
            const validComponent = attributeMap[attributeName][attributeValue];
            report({
              node: node,
              messageId: "requireSpecificComponent",
              data: {
                invalidComponent: componentName,
                validComponent: validComponent,
              },
            });
          }
        }
      },
    };
  },
};

const attributeMap: Record<string, Record<string, string>> = {
  display: {
    flex: "Flex",
    grid: "Grid",
  },
  as: {
    img: "Image",
  },
};
