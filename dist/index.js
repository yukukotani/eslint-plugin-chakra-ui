"use strict";
var _propsOrder = require("./rules/props-order");
var _propsShorthand = require("./rules/props-shorthand");
var _requireSpecificComponent = require("./rules/require-specific-component");
module.exports = {
    rules: {
        "props-order": _propsOrder.propsOrderRule,
        "props-shorthand": _propsShorthand.propsShorthandRule,
        "require-specific-component": _requireSpecificComponent.requireSpecificComponentRule
    }
};
