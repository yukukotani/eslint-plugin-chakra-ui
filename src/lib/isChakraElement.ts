import { ParserServices } from "@typescript-eslint/experimental-utils";
import { JSXOpeningElement } from "@typescript-eslint/types/dist/ast-spec";
import {
  Declaration,
  ImportDeclaration,
  Symbol,
  SyntaxKind,
  Expression,
} from "typescript";

export function isChakraElement(node: JSXOpeningElement, parserServices: ParserServices): boolean {
  const typeChecker = parserServices.program.getTypeChecker();
  const tsNode = parserServices.esTreeNodeToTSNodeMap.get(node.name);
  const symbol = typeChecker.getSymbolAtLocation(tsNode);
  // string tag
  if (symbol == null) {
    return false;
  }

  const specifier = getModuleSpecifierOfImportSpecifier(symbol);

  return specifier === "@chakra-ui/react";
}

// eslint-disable-next-line @typescript-eslint/ban-types -- This Symbol is imported from "typescript"
function getModuleSpecifierOfImportSpecifier(symbol: Symbol): string | null {
  if (symbol.declarations == null || symbol.declarations.length < 1) {
    return null;
  }

  const moduleSpecifier = findModuleSpecifier(symbol.declarations[0]);
  if (!moduleSpecifier) {
    return null;
  }

  const text = moduleSpecifier.getText();
  // strip quote
  return text.slice(1, text.length - 1);
}

function findModuleSpecifier(declaration: Declaration): Expression | null {
  if (declaration.kind === SyntaxKind.ImportSpecifier) {
    return (declaration.parent.parent.parent as ImportDeclaration).moduleSpecifier;
  } else if (declaration.kind === SyntaxKind.NamedImports) {
    // @ts-ignore TS 4.4 Support. declaration.parent.parent.parent is ImportEqualsDeclaration
    return declaration.parent.parent.parent.moduleSpecifier;
  }

  return null;
}
