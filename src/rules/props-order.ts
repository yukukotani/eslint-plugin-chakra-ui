import { AST_NODE_TYPES, TSESLint, TSESTree } from "@typescript-eslint/utils";
import { isChakraElement } from "../lib/isChakraElement";
import { getPriority } from "../lib/getPriorityIndex";
import { createGetParserServices } from "../lib/createGetParserServices";

type Options = [
  {
    firstProps?: string[];
    lastProps?: string[];
    displayCompPropsBeforeStyleProps?: boolean;
    applyToAllComponents?: boolean;
  },
];

export type Config = {
  firstProps: string[];
  lastProps: string[];
  isCompPropsBeforeStyleProps: boolean;
  componentSpecificProps: string[] | undefined;
};
const defaultFirstProps = ["className", "key", "ref", "dangerouslySetInnerHtml"];
const defaultLastProps: string[] = [];
// const defaultIsCompPropsBeforeStyleProps = false;

export const propsOrderRule: TSESLint.RuleModule<"invalidOrder", Options> = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Enforce a order of the Chakra component's props.",
      recommended: "recommended",
      requiresTypeChecking: true,
      url: "https://github.com/yukukotani/eslint-plugin-chakra-ui/blob/main/docs/rules/props-order.md",
    },
    messages: {
      invalidOrder: "Invalid Chakra props order.",
    },
    schema: [
      {
        type: "object",
        properties: {
          firstProps: {
            type: "array",
            items: { type: "string", minLength: 0 },
            uniqueItems: true,
          },
          lastProps: {
            type: "array",
            items: { type: "string", minLength: 0 },
            uniqueItems: true,
          },
          displayCompPropsBeforeStyleProps: {
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
    const option = options[0];
    const getParserServices = createGetParserServices(ctx);

    return {
      JSXOpeningElement(node) {
        if (!option?.applyToAllComponents && !isChakraElement(node, getParserServices())) {
          return;
        }

        const config: Config = {
          firstProps: option?.firstProps ? option?.firstProps : defaultFirstProps,
          lastProps: option?.lastProps ? option?.lastProps : defaultLastProps,
          isCompPropsBeforeStyleProps: true, // options?.displayCompPropsBeforeStyleProps ? ~ : defaultIsCompPropsBeforeStyleProps
          componentSpecificProps: undefined, // not supported yet
        };
        const sorted = sortAttributes(node.attributes, config);

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
                  createFix(node.attributes[index], sortedAttribute, fixer, sourceCode),
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

const areAllJSXAttribute = (
  attributes: (TSESTree.JSXAttribute | TSESTree.JSXSpreadAttribute)[],
): attributes is TSESTree.JSXAttribute[] => {
  return attributes.every((attribute) => attribute.type === AST_NODE_TYPES.JSXAttribute);
};

const sortAttributes = (unsorted: (TSESTree.JSXAttribute | TSESTree.JSXSpreadAttribute)[], config: Config) => {
  const noSpread = areAllJSXAttribute(unsorted);

  if (noSpread) {
    const sorted = [...unsorted].sort((a, b) => compare(a, b, config));
    return sorted;
  }

  // contains SpreadAttribute
  // Sort sections which has only JSXAttributes.
  let start = 0;
  let end = 0;
  let sorted: (TSESTree.JSXAttribute | TSESTree.JSXSpreadAttribute)[] = [];
  for (let i = 0; i < unsorted.length; i++) {
    if (unsorted[i].type === AST_NODE_TYPES.JSXSpreadAttribute) {
      end = i;
      if (start < end) {
        // Sort sections which don't have JSXSpreadAttribute.
        const sectionToSort = unsorted.slice(start, end) as TSESTree.JSXAttribute[];
        const sectionSorted = sectionToSort.sort((a, b) => compare(a, b, config));
        sorted = sorted.concat(sectionSorted);
      }
      // JSXSpreadAttribute will be pushed as is.
      sorted.push(unsorted[i]);

      start = i + 1;
    } else if (i === unsorted.length - 1) {
      // This is last attribute and not spread one.
      end = i + 1;
      if (start < end) {
        const sectionToSort = unsorted.slice(start, end) as TSESTree.JSXAttribute[];
        const sectionSorted = sectionToSort.sort((a, b) => compare(a, b, config));
        sorted = sorted.concat(sectionSorted);
      }
    }
  }
  return sorted;
};

const compare = (a: TSESTree.JSXAttribute, b: TSESTree.JSXAttribute, config: Config) => {
  const aPriority = getPriority(a.name.name.toString(), config);
  const bPriority = getPriority(b.name.name.toString(), config);

  if (aPriority !== bPriority) {
    return aPriority - bPriority;
  }

  // Same Priority. Then compare it.
  const ordering = "alphabetical order";

  switch (ordering) {
    case "alphabetical order":
      return a.name.name < b.name.name ? -1 : 1;
  }
};

const createFix = (
  unsotedAttribute: TSESTree.JSXAttribute | TSESTree.JSXSpreadAttribute,
  sortedAttribute: TSESTree.JSXAttribute | TSESTree.JSXSpreadAttribute,
  fixer: TSESLint.RuleFixer,
  sourceCode: Readonly<TSESLint.SourceCode>,
) => {
  const nodeText = sourceCode.getText(sortedAttribute);
  return fixer.replaceText(unsotedAttribute, nodeText);
};
