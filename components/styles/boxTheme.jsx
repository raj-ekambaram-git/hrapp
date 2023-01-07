import { defineStyle, defineStyleConfig } from '@chakra-ui/react'

const comment = defineStyle({
  maxW: 'sm', 
  borderWidth: '1px',
  borderRadius: 'lg',
  overflow: 'hidden', 
  bgColor: 'red'
})

export const boxTheme = defineStyleConfig({
  defaultProps: {
    size: 'sm',
  },
  variants: { comment }
})
