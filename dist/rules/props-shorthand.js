"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.propsShorthandRule = void 0;
var _utils = require("@typescript-eslint/utils");
var _isChakraElement = require("../lib/isChakraElement");
var _getShorthand = require("../lib/getShorthand");
const propsShorthandRule = {
    meta: {
        type: "suggestion",
        docs: {
            description: "Enforces the usage of shorthand Chakra component props.",
            recommended: "error",
            url: "https://github.com/yukukotani/eslint-plugin-chakra-ui/blob/main/docs/rules/props-shorthand.md"
        },
        messages: {
            enforcesShorthand: "Prop '{{invalidName}}' could be replaced by the '{{validName}}' shorthand.",
            enforcesNoShorthand: "Shorthand prop '{{invalidName}}' could be replaced by the '{{validName}}'."
        },
        schema: [
            {
                type: "object",
                properties: {
                    noShorthand: {
                        type: "boolean",
                        default: false
                    },
                    applyToAllComponents: {
                        type: "boolean",
                        default: false
                    }
                }
            }, 
        ],
        fixable: "code"
    },
    create: ({ parserServices , report , getSourceCode , options  })=>{
        if (!parserServices) {
            return {};
        }
        const { noShorthand =false  } = options[0] || {};
        return {
            JSXOpeningElement (node) {
                if (!(option === null || option === void 0 ? void 0 : option.applyToAllComponents) && !(0, _isChakraElement).isChakraElement(node, parserServices)) {
                    return;
                }
                for (const attribute of node.attributes){
                    if (attribute.type !== _utils.AST_NODE_TYPES.JSXAttribute) {
                        continue;
                    }
                    const sourceCode1 = getSourceCode();
                    const componentName = sourceCode1.getText(node.name);
                    const propName = attribute.name.name.toString();
                    const newPropName = noShorthand ? (0, _getShorthand).getNonShorthand(componentName, propName) : (0, _getShorthand).getShorthand(componentName, propName);
                    if (newPropName) {
                        report({
                            node: node,
                            messageId: noShorthand ? "enforcesNoShorthand" : "enforcesShorthand",
                            data: {
                                invalidName: propName,
                                validName: newPropName
                            },
                            fix (fixer) {
                                const sourceCode = getSourceCode();
                                const newAttributeText = getAttributeText(attribute, newPropName, sourceCode);
                                return fixer.replaceText(attribute, newAttributeText);
                            }
                        });
                    }
                }
            }
        };
    }
};
exports.propsShorthandRule = propsShorthandRule;
function getAttributeText(attribute, key, sourceCode) {
    if (attribute.value) {
        const valueText = sourceCode.getText(attribute.value);
        return `${key}=${valueText}`;
    } else {
        return key;
    }
}
