"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.propsOrderRule = void 0;
var _utils = require("@typescript-eslint/utils");
var _isChakraElement = require("../lib/isChakraElement");
var _getPriorityIndex = require("../lib/getPriorityIndex");
const defaultFirstProps = [
    "className",
    "key",
    "ref",
    "dangerouslySetInnerHtml"
];
const defaultLastProps = [];
const propsOrderRule = {
    meta: {
        type: "suggestion",
        docs: {
            description: "Enforce a order of the Chakra component's props.",
            recommended: "error",
            url: "https://github.com/yukukotani/eslint-plugin-chakra-ui/blob/main/docs/rules/props-order.md"
        },
        messages: {
            invalidOrder: "Invalid Chakra props order."
        },
        schema: [
            {
                type: "object",
                properties: {
                    firstProps: {
                        type: "array",
                        items: {
                            type: "string",
                            minLength: 0
                        },
                        uniqueItems: true
                    },
                    lastProps: {
                        type: "array",
                        items: {
                            type: "string",
                            minLength: 0
                        },
                        uniqueItems: true
                    },
                    displayCompPropsBeforeStyleProps: {
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
        const option = options[0];
        return {
            JSXOpeningElement (node) {
                if (!(option === null || option === void 0 ? void 0 : option.applyToAllComponents) && !(0, _isChakraElement).isChakraElement(node, parserServices)) {
                    return;
                }
                const config = {
                    firstProps: (option === null || option === void 0 ? void 0 : option.firstProps) ? option === null || option === void 0 ? void 0 : option.firstProps : defaultFirstProps,
                    lastProps: (option === null || option === void 0 ? void 0 : option.lastProps) ? option === null || option === void 0 ? void 0 : option.lastProps : defaultLastProps,
                    isCompPropsBeforeStyleProps: true,
                    componentSpecificProps: undefined
                };
                const sorted = sortAttributes(node.attributes, config);
                const sourceCode = getSourceCode();
                for (const [index, attribute] of node.attributes.entries()){
                    if (attribute.type !== _utils.AST_NODE_TYPES.JSXAttribute) {
                        continue;
                    }
                    const sortedAttribute1 = sorted[index];
                    if (sortedAttribute1.type !== _utils.AST_NODE_TYPES.JSXAttribute || sortedAttribute1.name.name !== attribute.name.name) {
                        report({
                            node: node,
                            messageId: "invalidOrder",
                            fix (fixer) {
                                const fixingList = sorted.map((sortedAttribute, index)=>createFix(node.attributes[index], sortedAttribute, fixer, sourceCode)
                                );
                                // Operate from the end so that the unoperated node positions are not changed.
                                // If you start from the start, each time you manipulate a attribute,
                                // the following node positions will shift and autofix never work.
                                return fixingList.reverse();
                            }
                        });
                        break;
                    }
                }
            }
        };
    }
};
exports.propsOrderRule = propsOrderRule;
const areAllJSXAttribute = (attributes)=>{
    return attributes.every((attribute)=>attribute.type === _utils.AST_NODE_TYPES.JSXAttribute
    );
};
const sortAttributes = (unsorted, config)=>{
    const noSpread = areAllJSXAttribute(unsorted);
    if (noSpread) {
        const sorted = [
            ...unsorted
        ].sort((a, b)=>compare(a, b, config)
        );
        return sorted;
    }
    // contains SpreadAttribute
    // Sort sections which has only JSXAttributes.
    let start = 0;
    let end = 0;
    let sorted = [];
    for(let i = 0; i < unsorted.length; i++){
        if (unsorted[i].type === _utils.AST_NODE_TYPES.JSXSpreadAttribute) {
            end = i;
            if (start < end) {
                // Sort sections which don't have JSXSpreadAttribute.
                const sectionToSort = unsorted.slice(start, end);
                const sectionSorted = sectionToSort.sort((a, b)=>compare(a, b, config)
                );
                sorted = sorted.concat(sectionSorted);
            }
            // JSXSpreadAttribute will be pushed as is.
            sorted.push(unsorted[i]);
            start = i + 1;
        } else if (i === unsorted.length - 1) {
            // This is last attribute and not spread one.
            end = i + 1;
            if (start < end) {
                const sectionToSort = unsorted.slice(start, end);
                const sectionSorted = sectionToSort.sort((a, b)=>compare(a, b, config)
                );
                sorted = sorted.concat(sectionSorted);
            }
        }
    }
    return sorted;
};
const compare = (a, b, config)=>{
    const aPriority = (0, _getPriorityIndex).getPriority(a.name.name.toString(), config);
    const bPriority = (0, _getPriorityIndex).getPriority(b.name.name.toString(), config);
    if (aPriority !== bPriority) {
        return aPriority - bPriority;
    }
    // Same Priority. Then compare it.
    const ordering = "alphabetical order";
    switch(ordering){
        case "alphabetical order":
            return a.name.name < b.name.name ? -1 : 1;
    }
};
const createFix = (unsotedAttribute, sortedAttribute, fixer, sourceCode)=>{
    const nodeText = sourceCode.getText(sortedAttribute);
    return fixer.replaceText(unsotedAttribute, nodeText);
};
