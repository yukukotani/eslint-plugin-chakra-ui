"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getShorthand = getShorthand;
exports.getNonShorthand = getNonShorthand;
const shorthandMap = {
    common: {
        // Margin
        margin: "m",
        marginTop: "mt",
        marginRight: "mr",
        marginEnd: "me",
        marginBottom: "mb",
        marginLeft: "ml",
        marginStart: "ms",
        // Padding
        padding: "p",
        paddingTop: "pt",
        paddingRight: "pr",
        paddingEnd: "pe",
        paddingBottom: "pb",
        paddingLeft: "pl",
        paddingStart: "ps",
        //Layout
        width: "w",
        height: "h",
        minWidth: "minW",
        maxWidth: "maxW",
        minHeight: "minH",
        maxHeight: "maxH",
        // Flex
        flexDirection: "flexDir",
        // Background
        background: "bg",
        backgroundImage: "bgImage",
        backgroundSize: "bgSize",
        backgroundPosition: "bgPosition",
        backgroundRepeat: "bgRepeat",
        backgroundAttachment: "bgAttachment",
        backgroundColor: "bgColor",
        backgroundClip: "bgClip",
        // Position
        position: "pos",
        // Shadow
        boxShadow: "shadow"
    },
    Flex: {
        alignItems: "align",
        justifyContent: "justify",
        flexWrap: "wrap",
        flexDirection: "direction",
        flexDir: "direction"
    },
    Grid: {
        gridGap: "gap",
        gridRowGap: "rowGap",
        gridColumnGap: "columnGap",
        gridColumn: "column",
        gridRow: "row",
        gridArea: "area",
        gridAutoFlow: "autoFlow",
        gridAutoRows: "autoRows",
        gridAutoColumns: "autoColumns",
        gridTemplateRows: "templateRows",
        gridTemplateColumns: "templateColumns",
        gridTemplateAreas: "templateAreas"
    }
};
const nonShorthandMap = Object.keys(shorthandMap).reduce((ret, key)=>{
    ret[key] = flipKeyAndValue(shorthandMap[key]);
    return ret;
}, {});
function getShorthand(componentName, propName) {
    if (shorthandMap[componentName] && shorthandMap[componentName][propName]) {
        return shorthandMap[componentName][propName];
    }
    return shorthandMap["common"][propName] || null;
}
function getNonShorthand(componentName, propName) {
    if (nonShorthandMap[componentName] && nonShorthandMap[componentName][propName]) {
        return nonShorthandMap[componentName][propName];
    }
    return nonShorthandMap["common"][propName] || null;
}
function flipKeyAndValue(record) {
    return Object.keys(record).reduce((ret, key)=>{
        ret[record[key]] = key;
        return ret;
    }, {});
}
