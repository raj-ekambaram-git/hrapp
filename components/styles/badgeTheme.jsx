import { defineStyle, defineStyleConfig } from '@chakra-ui/react'


const status = defineStyle({
  border: "1px",
  backgroundColor: "gray.50",
  fontWeight: "900"
})

export const badgeTheme = defineStyleConfig({
  defaultProps: {
    size: 'sm',
    variant: "status",
  },
  variants: { status}
})
