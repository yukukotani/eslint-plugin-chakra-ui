import { AST_NODE_TYPES } from "@typescript-eslint/experimental-utils";
import { JSXAttribute, JSXSpreadAttribute } from "@typescript-eslint/types/dist/ast-spec";

export const getAttributeName = (node: JSXAttribute | JSXSpreadAttribute): string => {
  switch (node.type) {
    case AST_NODE_TYPES.JSXAttribute:
      // height={1}
      // In spec, JSXAttributeName could be either JSXNamespacedName or string.
      // However, React does not support this. So everything can be considered as a string.
      // https://github.com/facebook/jsx/issues/13#issuecomment-54373080
      return node.name.name as string;

    case AST_NODE_TYPES.JSXSpreadAttribute:
      // {...props}
      // Can it be other type than identifier?
      return node.argument.type === AST_NODE_TYPES.Identifier ? node.argument.name : "";

    default: {
      const _x: never = node;
      return "";
    }
  }
};
