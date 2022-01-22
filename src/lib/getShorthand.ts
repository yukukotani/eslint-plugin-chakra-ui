const shorthandMap: Record<string, string> = {
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
  display: "d",
  // Flex
  alignItems: "align",
  justifyContent: "justify",
  flexWrap: "wrap",
  flexDirection: "flexDir",
  direction: "flexDir",
  // Grid
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
  gridTemplateAreas: "templateAreas",
  // Background
  background: "bg",
  backgroundImage: "bgImage",
  backgroundSize: "bgSize",
  backgroundPosition: "bgPosition",
  backgroundRepeat: "bgRepeat",
  backgroundAttachment: "bgAttachment",
  backgroundColor: "bgColor",
  backgroundClip: "bgClip",
};

const nonShorthandMap = Object.keys(shorthandMap).reduce((ret, key) => {
  ret[shorthandMap[key]] = key;
  return ret;
}, {} as Record<string, string>);

export function getShorthand(propName: string): string | null {
  return shorthandMap[propName] || null;
}

export function getNonShorthand(propName: string): string | null {
  return nonShorthandMap[propName] || null;
}
