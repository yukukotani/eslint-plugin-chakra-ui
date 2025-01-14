import { propsOrderRule } from "./rules/props-order";
import { propsShorthandRule } from "./rules/props-shorthand";
import { requireSpecificComponentRule } from "./rules/require-specific-component";

export = {
  configs: {
    plugins: ["chakra-ui"],
    recommended: {
      "chakra-ui/props-order": "error",
      "chakra-ui/props-shorthand": "error",
      "chakra-ui/require-specific-component": "error",
    },
  },
  rules: {
    "props-order": propsOrderRule,
    "props-shorthand": propsShorthandRule,
    "require-specific-component": requireSpecificComponentRule,
  },
};
