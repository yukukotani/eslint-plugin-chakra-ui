import { AST_NODE_TYPES, TSESTree, ParserServicesWithTypeInformation } from "@typescript-eslint/utils";
import { Symbol } from "typescript";

export function getImportDeclarationOfJSX(
  node: TSESTree.JSXOpeningElement,
  parserServices: ParserServicesWithTypeInformation,
): TSESTree.ImportDeclaration | null {
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
  symbol: Symbol,
  parserServices: ParserServicesWithTypeInformation,
): TSESTree.ImportDeclaration | null {
  if (symbol.declarations == null || symbol.declarations.length < 1) {
    return null;
  }

  const node = parserServices.tsNodeToESTreeNodeMap.get(symbol.declarations[0]).parent;
  return node?.type === AST_NODE_TYPES.ImportDeclaration ? node : null;
}
