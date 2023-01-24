import { drawerAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(drawerAnatomy.keys)

  const sizes = {
    "xl": {
      maxW: "10vw",
      minH: "$100vh",
      my: "0",
      borderRadius: "0",
    }
  }


const baseStyle = definePartsStyle({
  header: {
    bgColor:"heading",
    color: "white"
  },
})


export const drawerTheme = defineMultiStyleConfig({ baseStyle,sizes })