"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.isChakraElement = isChakraElement;
var _typescript = require("typescript");
function isChakraElement(node, parserServices) {
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
function getModuleSpecifierOfImportSpecifier(symbol) {
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
function findModuleSpecifier(declaration) {
    if (declaration.kind === _typescript.SyntaxKind.ImportSpecifier) {
        return declaration.parent.parent.parent.moduleSpecifier;
    } else if (declaration.kind === _typescript.SyntaxKind.NamedImports) {
        // @ts-expect-error TS 4.4 Support. declaration.parent.parent.parent is ImportEqualsDeclaration
        return declaration.parent.parent.parent.moduleSpecifier;
    }
    return null;
}
