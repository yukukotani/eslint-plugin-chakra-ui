import { AST_NODE_TYPES, TSESLint } from "@typescript-eslint/utils";
import { isChakraElement } from "../lib/isChakraElement";
import { getPriorityIndex } from "../lib/getPriorityIndex";
import { JSXAttribute, JSXSpreadAttribute } from "@typescript-eslint/types/dist/ast-spec";

export const propsOrderRule: TSESLint.RuleModule<"invalidOrder", []> = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Enforce a order of the Chakra component's props.",
      recommended: "error",
      url: "https://github.com/Monchi/eslint-plugin-chakra-ui/blob/master/docs/rules/props-order.md",
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

        const sourceCode = getSourceCode();
        for (const [index, attribute] of node.attributes.entries()) {
          if (attribute.type !== AST_NODE_TYPES.JSXAttribute) {
            continue;
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
                const fixingList = sorted.map((sortedAttribute, index) =>
                  createFix(node.attributes[index], sortedAttribute, fixer, sourceCode)
                );
                // Operate from the end so that the unoperated node positions are not changed.
                // If you start from the start, each time you manipulate a attribute,
                // the following node positions will shift and autofix never work.
                return fixingList.reverse();
              },
            });
            break;
          }
        }
      },
    };
  },
};

const createFix = (
  unsotedAttribute: JSXAttribute | JSXSpreadAttribute,
  sortedAttribute: JSXAttribute | JSXSpreadAttribute,
  fixer: TSESLint.RuleFixer,
  sourceCode: Readonly<TSESLint.SourceCode>
) => {
  const nodeText = sourceCode.getText(sortedAttribute);
  return fixer.replaceText(unsotedAttribute, nodeText);
};
