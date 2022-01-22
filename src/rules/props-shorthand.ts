import { AST_NODE_TYPES, TSESLint } from "@typescript-eslint/experimental-utils";
import { isChakraElement } from "../lib/isChakraElement";
import { getNonShorthand, getShorthand } from "../lib/getShorthand";
import { JSXAttribute } from "@typescript-eslint/types/dist/ast-spec";

type Options = {
  noShorthand: boolean;
};

export const propsShorthandRule: TSESLint.RuleModule<"enforcesShorthand" | "enforcesNoShorthand", [Partial<Options>]> =
  {
    meta: {
      type: "suggestion",
      docs: {
        description: "Enforces the usage of shorthand Chakra component props.",
        recommended: "error",
        url: "https://github.com/Monchi/eslint-plugin-chakra-ui/blob/master/docs/rules/props-shorthand.md",
      },
      messages: {
        enforcesShorthand: "Prop '{{invalidName}}' could be replaced by the '{{validName}}' shorthand.",
        enforcesNoShorthand: "Shorthand prop '{{invalidName}}' could be replaced by the '{{validName}}'.",
      },
      schema: [
        {
          type: "object",
          properties: {
            noShorthand: {
              type: "boolean",
              default: false,
            },
          },
        },
      ],
      fixable: "code",
    },

    create: ({ parserServices, report, getSourceCode, options }) => {
      if (!parserServices) {
        return {};
      }

      const { noShorthand = false } = options[0] || {};

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
            const newPropName = noShorthand ? getNonShorthand(propName) : getShorthand(propName);
            if (newPropName) {
              report({
                node: node,
                messageId: noShorthand ? "enforcesNoShorthand" : "enforcesShorthand",
                data: {
                  invalidName: propName,
                  validName: newPropName,
                },
                fix(fixer) {
                  const sourceCode = getSourceCode();
                  const newAttributeText = getAttributeText(attribute, newPropName, sourceCode);

                  return fixer.replaceText(attribute, newAttributeText);
                },
              });
            }
          }
        },
      };
    },
  };

function getAttributeText(attribute: JSXAttribute, key: string, sourceCode: Readonly<TSESLint.SourceCode>): string {
  if (attribute.value) {
    const valueText = sourceCode.getText(attribute.value);
    return `${key}=${valueText}`;
  } else {
    return key;
  }
}
