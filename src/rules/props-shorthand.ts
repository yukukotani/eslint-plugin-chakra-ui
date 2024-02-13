import { AST_NODE_TYPES, TSESLint, TSESTree } from "@typescript-eslint/utils";
import { isChakraElement } from "../lib/isChakraElement";
import { getNonShorthand, getShorthand } from "../lib/getShorthand";
import { getParserServices } from "@typescript-eslint/utils/eslint-utils";

type Options = {
  noShorthand: boolean;
  applyToAllComponents?: boolean;
};

export const propsShorthandRule: TSESLint.RuleModule<"enforcesShorthand" | "enforcesNoShorthand", [Partial<Options>]> =
  {
    meta: {
      type: "suggestion",
      docs: {
        description: "Enforces the usage of shorthand Chakra component props.",
        recommended: "recommended",
        requiresTypeChecking: true,
        url: "https://github.com/yukukotani/eslint-plugin-chakra-ui/blob/main/docs/rules/props-shorthand.md",
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
            applyToAllComponents: {
              type: "boolean",
              default: false,
            },
          },
        },
      ],
      fixable: "code",
    },

    defaultOptions: [{}],

    create: (ctx) => {
      const { report, getSourceCode, options } = ctx;
      const { noShorthand = false, applyToAllComponents = false } = options[0] || {};
      const parserServices = !applyToAllComponents ? getParserServices(ctx, false) : undefined;

      return {
        JSXOpeningElement(node) {
          if (parserServices && !isChakraElement(node, parserServices)) {
            return;
          }

          for (const attribute of node.attributes) {
            if (attribute.type !== AST_NODE_TYPES.JSXAttribute) {
              continue;
            }

            const sourceCode = getSourceCode();
            const componentName = sourceCode.getText(node.name);
            const propName = attribute.name.name.toString();
            const newPropName = noShorthand
              ? getNonShorthand(componentName, propName)
              : getShorthand(componentName, propName);
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

function getAttributeText(
  attribute: TSESTree.JSXAttribute,
  key: string,
  sourceCode: Readonly<TSESLint.SourceCode>,
): string {
  if (attribute.value) {
    const valueText = sourceCode.getText(attribute.value);
    return `${key}=${valueText}`;
  } else {
    return key;
  }
}
