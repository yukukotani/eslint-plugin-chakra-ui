import { AST_NODE_TYPES, ImportClause, ImportDeclaration } from "@typescript-eslint/types/dist/ast-spec";
import { isHooks } from "./isHook";

export function updateImportedMap(importedMap: Map<string, true>, importDeclaration: ImportDeclaration) {
  const importedList = importDeclaration.specifiers;
  const from = importDeclaration.source.value;
  const specifiers = ["@chakra-ui/react"];
  if (!specifiers.includes(from)) {
    return;
  }

  importedList.map((imported) => {
    const maybeComponent = getImportedName(imported);

    // Still 3 kind of possibility: Chakra Component, Chakra Hooks, undefined.
    if (maybeComponent !== undefined && !isHooks(maybeComponent)) {
      const compoenent = maybeComponent;
      importedMap.set(compoenent, true);
    }
  });
}

const getImportedName = (imported: ImportClause) => {
  switch (imported.type) {
    case AST_NODE_TYPES.ImportSpecifier:
    case AST_NODE_TYPES.ImportDefaultSpecifier:
      return imported.local.name;
    case AST_NODE_TYPES.ImportNamespaceSpecifier:
      // TODO:
      return undefined;
  }
};
