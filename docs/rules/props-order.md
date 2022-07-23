# chakra-ui/props-order

Example of **incorrect** code for this rule:

```tsx
import { Box } from "@chakra-ui/react";

<Box bgColor="red" p="4" mx="2" width="120" mt="4">
  Hello
</Box>;
```

Example of **correct** code for this rule:

```tsx
import { Box } from "@chakra-ui/react";

<Box mx="2" mt="4" p="4" width="120" bgColor="red">
  Hello
</Box>;
```

## Details

This rule enforces order of properties to be semantical.

## Options

```ts
"chakra-ui/props-order": [<enabled>, {
  "firstProps": <string[]>,
  "lastProps": <string[]>,
  "applyToAllComponents": <boolean>
}]
```

### firstProps

Given props will come first regardless of semantics.

Default value: `["className", "key", "ref", "dangerouslySetInnerHtml"]`

### lastProps

Given props will come last regardless of semantics.

Default value: `[]`

### applyToAllComponents

By default, this rule only applies to components imported from `@chakra-ui/react`. If `applyToAllComponents` is true, it runs on all components. This is helpful if you re-export chakra component, or you extend a lot of chakra components and have the same props.
