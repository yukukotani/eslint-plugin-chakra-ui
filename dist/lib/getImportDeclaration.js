"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getImportDeclarationOfJSX = getImportDeclarationOfJSX;
var _utils = require("@typescript-eslint/utils");
function getImportDeclarationOfJSX(node, parserServices) {
    const typeChecker = parserServices.program.getTypeChecker();
    const tsNode = parserServices.esTreeNodeToTSNodeMap.get(node.name);
    const symbol = typeChecker.getSymbolAtLocation(tsNode);
    // string tag
    if (symbol == null) {
        return null;
    }
    return getImportDeclarationOfSymbol(symbol, parserServices);
}
function getImportDeclarationOfSymbol(// eslint-disable-next-line @typescript-eslint/ban-types -- This Symbol is imported from "typescript"
symbol, parserServices) {
    if (symbol.declarations == null || symbol.declarations.length < 1) {
        return null;
    }
    const node = parserServices.tsNodeToESTreeNodeMap.get(symbol.declarations[0]).parent;
    return (node === null || node === void 0 ? void 0 : node.type) === _utils.AST_NODE_TYPES.ImportDeclaration ? node : null;
}
