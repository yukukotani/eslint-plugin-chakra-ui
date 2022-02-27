import { propsOrderRule } from "./rules/props-order";
import { propsShorthandRule } from "./rules/props-shorthand";
import { requireSpecificComponentRule } from "./rules/require-specific-component";

export = {
  rules: {
    "props-order": propsOrderRule,
    "props-shorthand": propsShorthandRule,
    "require-specific-component": requireSpecificComponentRule,
  },
};
