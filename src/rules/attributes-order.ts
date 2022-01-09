import { TSESLint } from "@typescript-eslint/experimental-utils";

export const attributesOrder: TSESLint.RuleModule<"removeDollar", []> = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Check JSXText's unnecessary `$` character.",
      recommended: "error",
      url: "",
    },
    messages: {
      removeDollar: "Remove unnecessary $ character.",
    },
    schema: [],
    fixable: "code",
  },
  create: (context) => {
    return {
      ImportDeclaration(node) {
        console.log("import", node);
      },
      JSXElement(node) {
        console.log(node.openingElement.name);
        // node.children.forEach((JSXChild, index) => {
        //   if (JSXChild.type === "JSXText" && JSXChild.value.endsWith("$")) {
        //     const nextJSXChild = node.children?.[index + 1];
        //     if (
        //       nextJSXChild &&
        //       nextJSXChild.type === "JSXExpressionContainer"
        //     ) {
        //       context.report({
        //         node,
        //         messageId: "removeDollar",
        //         fix(fixer) {
        //           return fixer.removeRange([
        //             JSXChild.range[1] - 1,
        //             JSXChild.range[1],
        //           ]);
        //         },
        //       });
        //     }
        //   }
        // });
      },
    };
  },
};
