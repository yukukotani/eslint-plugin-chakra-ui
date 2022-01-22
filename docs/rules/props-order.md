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

This rule groups properties semantically, then reorder the groups. The order in the group is not enforced.

## Options

N/A
