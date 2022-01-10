import { ParserServices } from "@typescript-eslint/experimental-utils";
import { JSXElement } from "@typescript-eslint/types/dist/ast-spec";
import { ImportDeclaration, Symbol, SyntaxKind } from "typescript";

export function isChakraElement(
  node: JSXElement,
  parserServices: ParserServices
): boolean {
  const typeChecker = parserServices.program.getTypeChecker();
  const tsNode = parserServices.esTreeNodeToTSNodeMap.get(
    node.openingElement.name
  );
  const symbol = typeChecker.getSymbolAtLocation(tsNode);
  // string tag
  if (symbol == null) {
    return false;
  }

  const specifier = getModuleSpecifierOfImportSpecifier(symbol);

  return specifier === "@chakra-ui/react";
}

function getModuleSpecifierOfImportSpecifier(symbol: Symbol): string | null {
  if (symbol.declarations == null || symbol.declarations.length < 1) {
    return null;
  }

  const declaration = symbol.declarations[0];
  if (declaration.kind !== SyntaxKind.ImportSpecifier) {
    return null;
  }

  const node = declaration.parent.parent.parent;
  if (node.kind !== SyntaxKind.ImportDeclaration) {
    return null;
  }

  const text = (node as ImportDeclaration).moduleSpecifier.getText();
  // strip quote
  return text.slice(1, text.length - 1);
}
