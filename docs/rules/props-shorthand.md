# chakra-ui/props-shorthand

Example of **incorrect** code for this rule:

```tsx
import { Box } from "@chakra-ui/react";

<Box margin="2" backgroundColor="red">
  Hello
</Box>;
```

Example of **correct** code for this rule:

```tsx
import { Box } from "@chakra-ui/react";

<Box m="2" bgColor="red">
  Hello
</Box>;
```

## Details

This rule enforces the usage of shorthand property or vice-versa.

## Options

```ts
"chakra-ui/props-shorthand": [<enabled>, {
  "noShorthand": <boolean>,
  "applyToAllComponents": <boolean>
}]
```

### noShorthand

By default, this rule enforces using shorthand. If `noShorthand` is true, non-shorthand is enforced.

### applyToAllComponents

By default, this rule only applies to components imported from `@chakra-ui/react`. If `applyToAllComponents` is true, it runs on all components. This is helpful if you re-export chakra component, or you extend a lot of chakra components and have the same props.
