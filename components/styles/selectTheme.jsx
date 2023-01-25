import { selectAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers, defineStyle } from '@chakra-ui/react'

const { defineMultiStyleConfig, definePartsStyle } = createMultiStyleConfigHelpers(
  selectAnatomy.keys,
)

const baseStyle = definePartsStyle({
  // define the part you're going to style
  field: {
    color: 'teal.800', // change the input text color
    border: '1px solid',
    borderColor: 'gray.300',
    background: 'gray.50',
    borderRadius: 'full',

    // Let's also provide dark mode alternatives
    _dark: {
      borderColor: 'gray.600',
      background: 'gray.800',
    },    
    _readOnly: {
      boxShadow: "none !important",
      userSelect: "all",
    },
    _invalid: {
      borderColor: "red",
      boxShadow: `0px 1px 0px 0px red`,
    },
    _focusVisible: {
      borderColor: "teal.700",
    },
  },
  
})

export const selectTheme = defineMultiStyleConfig({
  defaultProps: {
    size: 'sm',
    variant: baseStyle,
  },baseStyle,
  variants: {}
})
