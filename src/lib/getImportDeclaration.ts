import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import { ParserServices } from "@typescript-eslint/utils";
import { ImportDeclaration } from "@typescript-eslint/types/dist/ast-spec";
import { Symbol } from "typescript";
import { JSXOpeningElement } from "@typescript-eslint/utils/node_modules/@typescript-eslint/types/dist/ast-spec";

export function getImportDeclarationOfJSX(
  node: JSXOpeningElement,
  parserServices: ParserServices
): ImportDeclaration | null {
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
