import { AST_NODE_TYPES, JSXOpeningElement } from "@typescript-eslint/types/dist/ast-spec";

// To use this function, use updateImportedMap in the import statement.
export function isChakraElement(node: JSXOpeningElement, importedMap: Map<string, true>): boolean {
  const element = node.name;

  switch (element.type) {
    case AST_NODE_TYPES.JSXIdentifier: {
      return importedMap.has(element.name);
    }
    case AST_NODE_TYPES.JSXMemberExpression:
      return false; // TODO:
    case AST_NODE_TYPES.JSXNamespacedName:
      // React doesn't support this syntax.
      // See: https://github.com/facebook/jsx/issues/13
      return false;
    default: {
      const _exhaustiveCheck: never = element;
      return false;
    }
  }
}
