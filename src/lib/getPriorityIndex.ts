type PriorityGroup =
  | {
      name: string;
      keys: readonly string[];
      isIncluded?: undefined;
    }
  | {
      name: string;
      keys?: undefined;
      includes: (key: string) => boolean;
    };

const directions = ["Top", "Right", "End", "Bottom", "Left", "Start"];

const priorityGroups: readonly PriorityGroup[] = [
  {
    name: "System",
    keys: ["as", "key", "sx", "layerStyle", "textStyle"],
  },
  {
    name: "Margin",
    keys: ["m", "margin", "mt", "mr", "me", "mb", "ml", "ms", "mx", "my", ...directions.map((dir) => `margin${dir}`)],
  },
  {
    name: "Padding",
    keys: ["p", "padding", "pt", "pr", "pe", "pb", "pl", "ps", "px", "py", ...directions.map((dir) => `padding${dir}`)],
  },
  {
    name: "Color",
    keys: ["color", "textColor", "fill", "stroke"],
  },
  {
    name: "Typography",
    keys: [
      "fontFamily",
      "fontSize",
      "fontWeight",
      "fontHeight",
      "letterSpacing",
      "textAlign",
      "fontStyle",
      "textTransform",
      "textDecoration",
    ],
  },
  {
    name: "Width",
    keys: ["w", "width", "minW", "minWidth", "maxW", "maxWidth"],
  },
  {
    name: "Height",
    keys: ["h", "height", "minH", "minHeight", "maxH", "maxHeight"],
  },
  {
    name: "Layout",
    keys: ["d", "display", "boxSize", "verticalAlign", "overflow", "overflowX", "overflowY"],
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
  },
  {
    name: "Border",
    keys: [
      "border",
      "borderWidth",
      "borderStyle",
      "borderColor",
      "borderX",
      "borderY",
      ...directions.flatMap((dir) => [`border${dir}`, `border${dir}Width`, `border${dir}Style`, `border${dir}Color`]),
    ],
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
      ...directions.flatMap((dir) => [`border${dir}`, `border${dir}Width`, `border${dir}Style`, `border${dir}Color`]),
    ],
  },
  {
    name: "Position",
    keys: ["pos", "position", "zIndex", "top", "right", "bottom", "left"],
  },
  {
    name: "Shadow",
    keys: ["textShadow", "shadow", "boxShadow"],
  },
  {
    name: "Pseudo",
    includes: (key) => key.startsWith("_"),
  },
  {
    name: "Other Style Props",
    keys: [
      "animation",
      "appearance",
      "transform",
      "transformOrigin",
      "visiblity",
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
      "fill",
      "stroke",
      "outline",
    ],
  },
];

export function getPriorityIndex(key: string): number {
  const index = priorityGroups.findIndex((group) => {
    return group.keys ? group.keys.includes(key) : group.includes(key);
  });
  return index === -1 ? Number.MAX_SAFE_INTEGER : index;
}
