import { AST_NODE_TYPES, TSESLint } from "@typescript-eslint/experimental-utils";
import { isChakraElement } from "../lib/isChakraElement";
import { getShorthand } from "../lib/getShorthand";

export const propsShorthandRule: TSESLint.RuleModule<"enforcesShorthand", []> = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Enforces the usage of shorthand Chakra component props.",
      recommended: "error",
      url: "TODO",
    },
    messages: {
      enforcesShorthand: "Prop '{{propName}}' could be replaced by the '{{shorthand}}' shorthand!",
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

        for (const attribute of node.attributes) {
          if (attribute.type !== AST_NODE_TYPES.JSXAttribute) {
            return;
          }

          const propName = attribute.name.name.toString();
          const shorthand = getShorthand(propName);
          if (shorthand) {
            report({
              node: node,
              messageId: "enforcesShorthand",
              data: {
                propName,
                shorthand,
              },
              fix(fixer) {
                const sourceCode = getSourceCode();
                let replaced: string;
                if (attribute.value) {
                  const valueText = sourceCode.getText(attribute.value);
                  replaced = `${shorthand}=${valueText}`;
                } else {
                  replaced = shorthand;
                }

                return fixer.replaceText(attribute, replaced);
              },
            });
          }
        }
      },
    };
  },
};
