import { AST_NODE_TYPES, TSESLint } from "@typescript-eslint/utils";
import { isChakraElement } from "../lib/isChakraElement";
import { getNonShorthand } from "../lib/getShorthand";
import { ParserServices } from "@typescript-eslint/utils";
import { ImportDeclaration } from "@typescript-eslint/types/dist/ast-spec";
import { Symbol } from "typescript";
import {
  JSXAttribute,
  JSXElement,
  JSXOpeningElement,
} from "@typescript-eslint/utils/node_modules/@typescript-eslint/types/dist/ast-spec";
import { RuleFix } from "@typescript-eslint/utils/dist/ts-eslint";

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
            continue;
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
              fix(fixer) {
                const renameStartTag = fixer.replaceText(node.name, validComponent);

                return [
                  renameStartTag,
                  createFixToRenameEndTag(node, validComponent, fixer),
                  createFixToRemoveAttribute(attribute, node, fixer),
                  createFixToInsertImport(node, validComponent, parserServices, fixer),
                ].filter((v) => !!v) as RuleFix[];
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

function createFixToRenameEndTag(jsxNode: JSXOpeningElement, validComponent: string, fixer: TSESLint.RuleFixer) {
  const endNode = (jsxNode.parent as JSXElement)?.closingElement;
  return endNode ? fixer.replaceText(endNode.name, validComponent) : null;
}

function createFixToRemoveAttribute(attribute: JSXAttribute, jsxNode: JSXOpeningElement, fixer: TSESLint.RuleFixer) {
  const attributeIndex = jsxNode.attributes.findIndex((a) => a === attribute);

  if (attributeIndex === jsxNode.attributes.length - 1) {
    // in case of last attribute
    const prevAttribute = jsxNode.attributes[attributeIndex - 1];
    return fixer.removeRange([prevAttribute.range[1], attribute.range[1]]);
  } else {
    const nextAttribute = jsxNode.attributes[attributeIndex + 1];
    return fixer.removeRange([attribute.range[0], nextAttribute.range[0]]);
  }
}

function createFixToInsertImport(
  jsxNode: JSXOpeningElement,
  validComponent: string,
  parserServices: ParserServices,
  fixer: TSESLint.RuleFixer
) {
  const importDecl = getImportDeclarationOfJSX(jsxNode, parserServices);
  if (!importDecl) {
    throw new Error("No decl");
  }

  const last = importDecl.specifiers[importDecl.specifiers.length - 1];
  return fixer.insertTextAfter(last, `, ${validComponent}`);
}

function getImportDeclarationOfJSX(node: JSXOpeningElement, parserServices: ParserServices): ImportDeclaration | null {
  const typeChecker = parserServices.program.getTypeChecker();
  const tsNode = parserServices.esTreeNodeToTSNodeMap.get(node.name);
  const symbol = typeChecker.getSymbolAtLocation(tsNode);
  // string tag
  if (symbol == null) {
    return null;
  }

  return getImportDeclarationOfSymbol(symbol, parserServices);
}

function getImportDeclarationOfSymbol(
  // eslint-disable-next-line @typescript-eslint/ban-types -- This Symbol is imported from "typescript"
  symbol: Symbol,
  parserServices: ParserServices
): ImportDeclaration | null {
  if (symbol.declarations == null || symbol.declarations.length < 1) {
    return null;
  }

  const node = parserServices.tsNodeToESTreeNodeMap.get(symbol.declarations[0]).parent;
  return node?.type === AST_NODE_TYPES.ImportDeclaration ? node : null;
}
