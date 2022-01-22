import { propsOrderRule } from "./rules/props-order";
import { propsShorthandRule } from "./rules/props-shorthand";

export = {
  rules: {
    "props-order": propsOrderRule,
    "props-shorthand": propsShorthandRule,
  },
};
