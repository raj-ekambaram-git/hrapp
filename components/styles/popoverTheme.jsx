import { popoverAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(popoverAnatomy.keys)

const baseStyle = definePartsStyle({
  // define the part you're going to style
  content:{
    width: "500px"
  },
   header: {
    bgColor:"heading",
    fontWeight: 'semibold',
    color: 'white'
  },
  body: {
    marginTop: "1rem",

  },
  footer: {
    button: {
      
    }
  },
})


export const popoverTheme = defineMultiStyleConfig({ baseStyle })