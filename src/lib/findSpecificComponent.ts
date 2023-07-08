import { getNonShorthand } from "./getShorthand";

const attributeMap: Record<string, Record<string, string>> = {
  display: {
    flex: "Flex",
    grid: "Grid",
  },
  as: {
    img: "Image",
  },
};

export function findSpecificComponent(
  componentName: string,
  rawAtributeName: string,
  rawAttributeValue: string,
): string | null {
  const attributeName = getNonShorthand(componentName, rawAtributeName) || rawAtributeName;
  if (!attributeMap[attributeName]) {
    return null;
  }

  // strip quote
  const attributeValue = rawAttributeValue.slice(1, rawAttributeValue.length - 1);

  return attributeMap[attributeName][attributeValue];
}
