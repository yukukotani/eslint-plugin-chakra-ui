import { AST_NODE_TYPES, TSESLint } from "@typescript-eslint/experimental-utils";
import { isChakraElement } from "../lib/isChakraElement";
import { getPriorityIndex } from "../lib/getPriorityIndex";

export const attributesOrder: TSESLint.RuleModule<"invalidOrder", []> = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Check JSXText's unnecessary `$` character.",
      recommended: "error",
      url: "",
    },
    messages: {
      invalidOrder: "Invalid Chakra attributes order.",
    },
    schema: [],
    fixable: "code",
  },
  create: ({ parserServices, report }) => {
    if (!parserServices) {
      return {};
    }

    return {
      JSXElement(node) {
        if (!isChakraElement(node, parserServices)) {
          return;
        }

        const sorted = [...node.openingElement.attributes].sort((a, b) => {
          const aPriority =
            a.type === AST_NODE_TYPES.JSXSpreadAttribute
              ? Number.MAX_SAFE_INTEGER
              : getPriorityIndex(a.name.name.toString());
          const bPriority =
            b.type === AST_NODE_TYPES.JSXSpreadAttribute
              ? Number.MAX_SAFE_INTEGER
              : getPriorityIndex(b.name.name.toString());

          return aPriority - bPriority;
        });

        for (const [index, attribute] of node.openingElement.attributes.entries()) {
          if (attribute.type !== AST_NODE_TYPES.JSXAttribute) {
            return;
          }

          const sortedAttribute = sorted[index];
          if (
            sortedAttribute.type !== AST_NODE_TYPES.JSXAttribute ||
            sortedAttribute.name.name !== attribute.name.name
          ) {
            report({
              node: attribute.parent!,
              messageId: "invalidOrder",
            });
            break;
          }
        }
      },
    };
  },
};
