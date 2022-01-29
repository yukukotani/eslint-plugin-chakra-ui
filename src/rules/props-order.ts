import { AST_NODE_TYPES, TSESLint } from "@typescript-eslint/experimental-utils";
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

        // const sorted = [...node.attributes].sort((a, b) => {
        const sorted = sortAttributes(node.attributes);
        // });

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
const areAllJSXAttribute = (attributes: (JSXAttribute | JSXSpreadAttribute)[]): attributes is JSXAttribute[] => {
  return attributes.every((attribute) => attribute.type === AST_NODE_TYPES.JSXAttribute);
};

const sortAttributes = (unsorted: (JSXAttribute | JSXSpreadAttribute)[]) => {
  const noSpread = areAllJSXAttribute(unsorted);

  if (noSpread) {
    const sorted = [...unsorted].sort((a, b) => compare(a, b));
    return sorted;
  }

  // contains SpreadAttribute
  // Sort sections which has only JSXAttributes.
  let start = 0;
  let end = 0;
  let sorted: (JSXAttribute | JSXSpreadAttribute)[] = [];
  for (let i = 0; i < unsorted.length; i++) {
    if (unsorted[i].type === AST_NODE_TYPES.JSXSpreadAttribute) {
      end = i;
      if (start < end) {
        // Sort sections which don't have JSXSpreadAttribute.
        const sectionToSort = unsorted.slice(start, end) as JSXAttribute[];
        const sectionSorted = sectionToSort.sort((a, b) => compare(a, b));
        sorted = sorted.concat(sectionSorted);
      }
      // JSXSpreadAttribute will be pushed as is.
      sorted.push(unsorted[i]);

      start = i + 1;
    } else if (i === unsorted.length - 1) {
      // This is last attribute and not spread one.
      end = i + 1;
      if (start < end) {
        const sectionToSort = unsorted.slice(start, end) as JSXAttribute[];
        const sectionSorted = sectionToSort.sort((a, b) => compare(a, b));
        sorted = sorted.concat(sectionSorted);
      }
    }
  }
  return sorted;
};

const compare = (a: JSXAttribute, b: JSXAttribute) => {
  const aPriority = getPriorityIndex(a.name.name.toString());
  const bPriority = getPriorityIndex(b.name.name.toString());

  return aPriority - bPriority;
};
