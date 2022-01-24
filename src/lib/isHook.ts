const hooks = [
  "useBoolean",
  "useBreakpointValue",
  "useClipboard",
  "useConst",
  "useDisclosure",
  "useMediaQuery",
  "useMergeRefs",
  "useOutsideClick",
  "usePrefersReducedMotion",
  "useTheme",
  "useToken",
];
export const isHooks = (name: string) => {
  return hooks.includes(name);
};
