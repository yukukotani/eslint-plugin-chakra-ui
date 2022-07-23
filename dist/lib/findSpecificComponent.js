"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.findSpecificComponent = findSpecificComponent;
var _getShorthand = require("./getShorthand");
const attributeMap = {
    display: {
        flex: "Flex",
        grid: "Grid"
    },
    as: {
        img: "Image"
    }
};
function findSpecificComponent(componentName, rawAtributeName, rawAttributeValue) {
    const attributeName = (0, _getShorthand).getNonShorthand(componentName, rawAtributeName) || rawAtributeName;
    if (!attributeMap[attributeName]) {
        return null;
    }
    // strip quote
    const attributeValue = rawAttributeValue.slice(1, rawAttributeValue.length - 1);
    return attributeMap[attributeName][attributeValue];
}
