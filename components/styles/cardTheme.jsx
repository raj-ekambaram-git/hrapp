import { cardAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(cardAnatomy.keys)

const baseStyle = definePartsStyle({
  // define the part you're going to style
  container: {
  },
  header: {
    bgColor:"table_tile",
    padding:"page.heading"
  },
  body: {
    
  },
  footer: {
    
  },
})

const sizes = definePartsStyle({
  md: {
    container: {
      borderRadius: '0px',
    },
  },
})

export const cardTheme = defineMultiStyleConfig({ baseStyle, sizes })