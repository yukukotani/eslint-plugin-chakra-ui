import { AST_NODE_TYPES, TSESLint } from "@typescript-eslint/experimental-utils";
import { isChakraElement } from "../lib/isChakraElement";
import { getPriorityIndex } from "../lib/getPriorityIndex";

export const attributesOrder: TSESLint.RuleModule<"invalidOrder", []> = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Enforce a order of the Chakra component's props.",
      recommended: "error",
      url: "TODO",
    },
    messages: {
      invalidOrder: "Invalid Chakra props order.",
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

        const sorted = [...node.attributes].sort((a, b) => {
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

        for (const [index, attribute] of node.attributes.entries()) {
          if (attribute.type !== AST_NODE_TYPES.JSXAttribute) {
            return;
          }

          const sortedAttribute = sorted[index];
          if (
            sortedAttribute.type !== AST_NODE_TYPES.JSXAttribute ||
            sortedAttribute.name.name !== attribute.name.name
          ) {
            report({
              node: node,
              messageId: "invalidOrder",
              fix(fixer) {
                const sourceCode = getSourceCode();
                const start = node.attributes[0].range[0];
                const end = node.attributes[node.attributes.length - 1].range[1];
                const attributesText = sorted.map((attribute) => sourceCode.getText(attribute)).join(" ");

                return fixer.replaceTextRange([start, end], attributesText);
              },
            });
            break;
          }
        }
      },
    };
  },
};
