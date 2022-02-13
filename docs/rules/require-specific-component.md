# chakra-ui/require-specific-component

Example of **incorrect** code for this rule:

```tsx
import { Box } from "@chakra-ui/react";

<Box display="flex" margin="2" paddingTop={4}>
  Hello
</Box>;
```

Example of **correct** code for this rule:

```tsx
import { Box, Flex } from "@chakra-ui/react";

<Flex margin="2" paddingTop={4}>
  Hello
</Flex>;
```

## Details

This rule enforces the usage of specific Chakra components instead of Box components with an attribute.

## Options

N/A
