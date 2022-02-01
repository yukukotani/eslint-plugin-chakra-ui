// priority range: 0~100
const stylePropsPriority = {
  // System
  System: 0,
  ComponentSpecificProps: 1,

  // Positioning
  Position: 10,

  // Box Model
  Flexbox: 20,
  "Grid Layout": 21,
  Layout: 22,
  Width: 23,
  Height: 24,
  Margin: 25,
  Padding: 26,

  // Typography
  Color: 30,
  Typography: 31,

  // Visual
  Background: 40,
  Border: 41,
  "Border Radius": 42,

  // Misc
  Shadow: 50,
  Pseudo: 51,
  "Other Style Props": 52,
} as const;
type Priority = typeof stylePropsPriority;

type PriorityGroup = {
  name: string;
  keys: readonly string[];
  priority: Priority[keyof Priority];
};

const priorityGroups: readonly PriorityGroup[] = [
  {
    name: "System",
    keys: ["as", "sx", "layerStyle", "textStyle"],
    priority: stylePropsPriority["System"],
  },
  {
    name: "ComponentSpecificProps",
    keys: [], // TODO
    priority: stylePropsPriority["ComponentSpecificProps"],
  },
  {
    name: "Margin",
    keys: [
      "m",
      "margin",
      "mt",
      "marginTop",
      "mr",
      "marginRight",
      "me",
      "marginEnd",
      "mb",
      "marginBottom",
      "ml",
      "marginLeft",
      "ms",
      "marginStart",
      "mx",
      "my",
    ],
    priority: stylePropsPriority["Margin"],
  },
  {
    name: "Padding",
    keys: [
      "p",
      "padding",
      "pt",
      "paddingTop",
      "pr",
      "paddingRight",
      "pe",
      "paddingEnd",
      "pb",
      "paddingBotto",
      "pl",
      "paddingLeft",
      "ps",
      "paddingStart",
      "px",
      "py",
    ],
    priority: stylePropsPriority["Padding"],
  },
  {
    name: "Color",
    keys: ["color", "textColor", "fill", "stroke"],
    priority: stylePropsPriority["Color"],
  },
  {
    name: "Typography",
    keys: [
      "fontFamily",
      "fontSize",
      "fontWeight",
      "lineHeight",
      "letterSpacing",
      "textAlign",
      "fontStyle",
      "textTransform",
      "textDecoration",
    ],
    priority: stylePropsPriority["Typography"],
  },
  {
    name: "Width",
    keys: ["w", "width", "minW", "minWidth", "maxW", "maxWidth"],
    priority: stylePropsPriority["Width"],
  },
  {
    name: "Height",
    keys: ["h", "height", "minH", "minHeight", "maxH", "maxHeight"],
    priority: stylePropsPriority["Height"],
  },
  {
    name: "Layout",
    keys: ["d", "display", "boxSize", "verticalAlign", "overflow", "overflowX", "overflowY"],
    priority: stylePropsPriority["Layout"],
  },
  {
    name: "Flexbox",
    keys: [
      "alignItems",
      "align",
      "alignContent",
      "justifyItems",
      "justifyContent",
      "justify",
      "flexWrap",
      "wrap",
      "flexDirection",
      "flexDir",
      "direction",
      "flex",
      "flexGrow",
      "flexShrink",
      "flexBasis",
      "justifySelf",
      "alignSelf",
      "order",
    ],
    priority: stylePropsPriority["Flexbox"],
  },
  {
    name: "Grid Layout",
    keys: [
      "gridGap",
      "gap",
      "gridRowGap",
      "rowGap",
      "gridColumnGap",
      "columnGap",
      "gridColumn",
      "column",
      "gridRow",
      "row",
      "gridArea",
      "area",
      "gridAutoFlow",
      "autoFlow",
      "gridAutoRows",
      "autoRows",
      "gridAutoColumns",
      "autoColumns",
      "gridTemplateRows",
      "templateRows",
      "gridTemplateColumns",
      "templateColumns",
      "gridTemplateAreas",
      "templateAreas",
    ],
    priority: stylePropsPriority["Grid Layout"],
  },
  {
    name: "Background",
    keys: [
      "bg",
      "background",
      "bgImage",
      "backgroundImage",
      "bgSize",
      "backgroundSize",
      "bgPosition",
      "backgroundPosition",
      "bgRepeat",
      "backgroundRepeat",
      "bgAttachment",
      "backgroundAttachment",
      "bgGradient",
      "bgClip",
      "backgroundClip",
      "opacity",
    ],
    priority: stylePropsPriority["Background"],
  },
  {
    name: "Border",
    keys: [
      "border",
      "borderWidth",
      "borderStyle",
      "borderColor",
      "borderTop",
      "borderTopWidth",
      "borderTopStyle",
      "borderTopColor",
      "borderRight",
      "borderRightWidth",
      "borderRightStyle",
      "borderRightColor",
      "borderBottom",
      "borderBottomWidth",
      "borderBottomStyle",
      "borderBottomColor",
      "borderLeft",
      "borderLeftWidth",
      "borderLeftStyle",
      "borderLeftColor",
      "borderStart",
      "borderStartWidth",
      "borderStartStyle",
      "borderStartColor",
      "borderEnd",
      "borderEndWidth",
      "borderEndStyle",
      "borderEndColor",
      "borderX",
      "borderY",
    ],
    priority: stylePropsPriority["Border"],
  },
  {
    name: "Border Radius",
    keys: [
      "borderRadius",
      "borderTopLeftRadius",
      "borderTopStartRadius",
      "borderTopRightRadius",
      "borderTopEndRadius",
      "borderBottomRightRadius",
      "borderBottomEndRadius",
      "borderBottomLeftRadius",
      "borderBottomStartRadius",
      "borderTopRadius",
      "borderRightRadius",
      "borderEndRadius",
      "borderBottomRadius",
      "borderLeftRadius",
      "borderStartRadius",
    ],
    priority: stylePropsPriority["Border Radius"],
  },
  {
    name: "Position",
    keys: ["pos", "position", "zIndex", "top", "right", "bottom", "left"],
    priority: stylePropsPriority["Position"],
  },
  {
    name: "Shadow",
    keys: ["textShadow", "shadow", "boxShadow"],
    priority: stylePropsPriority["Shadow"],
  },
  {
    name: "Pseudo",
    keys: [
      "_hover",
      "_active",
      "_focus",
      "_highlighted",
      "_focusWithin",
      "_focusVisible",
      "_disabled",
      "_readOnly",
      "_before",
      "_after",
      "_empty",
      "_expanded",
      "_checked",
      "_grabbed",
      "_pressed",
      "_invalid",
      "_valid",
      "_loading",
      "_selected",
      "_hidden",
      "_autofill",
      "_even",
      "_odd",
      "_first",
      "_last",
      "_notFirst",
      "_notLast",
      "_visited",
      "_activeLink",
      "_activeStep",
      "_indeterminate",
      "_groupHover",
      "_peerHover",
      "_groupFocus",
      "_peerFocus",
      "_groupFocusVisible",
      "_peerFocusVisible",
      "_groupActive",
      "_groupDisabled",
      "_peerDisabled",
      "_groupInvalid",
      "_peerInvalid",
      "_groupChecked",
      "_peerChecked",
      "_groupFocusWithin",
      "_peerFocusWithin",
      "_peerPlaceholderShown",
      "_placeholder",
      "_placeholderShown",
      "_fullScreen",
      "_selection",
      "_rtl",
      "_ltr",
      "_mediaDark",
      "_mediaReduceMotion",
      "_dark",
      "_light",
    ],
    priority: stylePropsPriority["Pseudo"],
  },
  {
    name: "Other Style Props",
    keys: [
      "animation",
      "appearance",
      "transform",
      "transformOrigin",
      "visibility",
      "whiteSpace",
      "userSelect",
      "pointerEvents",
      "wordBreak",
      "overflowWrap",
      "textOverflow",
      "boxSizing",
      "cursor",
      "resize",
      "transition",
      "objectFit",
      "objectPosition",
      "float",
      "outline",
    ],
    priority: stylePropsPriority["Other Style Props"],
  },
];

export function getPriority(key: string, config: { firstProps: string[]; lastProps: string[] }): number {
  const { firstProps, lastProps } = config;

  const indexInFirstProps = firstProps.indexOf(key);
  const indexInLastProps = lastProps.indexOf(key);

  if (indexInFirstProps !== -1) {
    return calcPriorityFromIndex("reservedFirstProps", 0, 0);
  }
  if (indexInLastProps !== -1) {
    return calcPriorityFromIndex("reservedLastProps", 0, 0);
  }

  // it can be either `stylePropsPriority` or `otherPropsPriority`
  const groupIndex = priorityGroups.findIndex((group) => {
    return group.keys.includes(key);
  });

  const isStyleProps = groupIndex > -1;
  if (isStyleProps) {
    const keyIndex = getIndexInGroup(key, groupIndex);
    return calcPriorityFromIndex("styleProps", groupIndex, keyIndex);
  }

  return calcPriorityFromIndex("otherProps", 0, 0);
}

type priprityType = "reservedFirstProps" | "styleProps" | "componentSpecificProps" | "otherProps" | "reservedLastProps";
const calcPriorityFromIndex = (type: priprityType, groupIndex: number, indexInGroup: number) => {
  // Perhaps we may want to recieve -1 as error in some future.
  // Therefore I set the priority to numbers greater than or equal to zero.

  const basePriorities = {
    firstProps: 0,
    styleProps: 100,
    componentSpecificProps: 10 * 5,
    otherProps: 10 ** 6,
    lastProps: Number.MAX_SAFE_INTEGER,
  };
  switch (type) {
    case "reservedFirstProps": {
      const basePriority = basePriorities.firstProps;
      // We assume reservedFirstProps.length < 100

      return basePriority;
    }
    case "styleProps": {
      const basePriority = basePriorities.styleProps;
      const groupPriority = priorityGroups[groupIndex].priority;
      const priorityInGroup = indexInGroup;

      // By useing the following formula, we can assign a unique priority to each props of style props.
      // Justification: Since priorityGroups[**].length is less than 100, there is no duplicate.
      return basePriority + groupPriority * 100 + priorityInGroup;
    }
    case "componentSpecificProps": {
      const basePriority = basePriorities.componentSpecificProps;
      return basePriority;
    }
    case "otherProps": {
      const basePriority = basePriorities.otherProps;
      return basePriority;
    }
    case "reservedLastProps": {
      const basePriority = basePriorities.lastProps;
      return basePriority;
    }
    default: {
      const _x: never = type;
      return -1;
    }
  }
};

export const priorityGroupsLength = priorityGroups.length;

const getIndexInGroup = (key: string, groupIndex: number): number => {
  const keys = priorityGroups[groupIndex].keys;
  const index = keys.indexOf(key);
  return index === -1 ? Number.MAX_SAFE_INTEGER : index;
};
