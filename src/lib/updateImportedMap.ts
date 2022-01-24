import { AST_NODE_TYPES, ImportDeclaration } from "@typescript-eslint/types/dist/ast-spec";
import { isHooks } from "./isHook";

export function updateImportedMap(importedMap: Map<string, true>, importDeclaration: ImportDeclaration) {
  const importedList = importDeclaration.specifiers;
  const from = importDeclaration.source.value;
  if (from !== "@chakra-ui/react") {
    return;
  }
  for (let i = 0; i < importedList.length; i++) {
    const imported = importedList[i];

    let maybeComponent;
    switch (imported.type) {
      case AST_NODE_TYPES.ImportSpecifier:
      case AST_NODE_TYPES.ImportDefaultSpecifier:
        maybeComponent = imported.local.name;
        break;
      case AST_NODE_TYPES.ImportNamespaceSpecifier:
        // TODO:
        break;
    }

    // Still 3 kind of possibility: Chakra Component, Chakra Hooks, undefined.
    if (maybeComponent !== undefined && !isHooks(maybeComponent)) {
      const compoenent = maybeComponent;
      importedMap.set(compoenent, true);
    }
  }
}
