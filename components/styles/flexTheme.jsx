import { defineStyle, defineStyleConfig } from '@chakra-ui/react'

const headerActions = defineStyle({
  maxW: 'sm', 
  borderWidth: '1px',
  borderRadius: 'lg',
  overflow: 'hidden', 
  bgColor: 'red'
})

export const flexTheme = defineStyleConfig({
  defaultProps: {
    size: 'sm',
  },
  variants: { headerActions }
})
