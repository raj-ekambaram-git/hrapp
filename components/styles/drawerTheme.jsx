import { drawerAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(drawerAnatomy.keys)

  const sizes = {
    "xxl": definePartsStyle({
      dialog: {
        maxW: "70vw",
        minH: "$100vh",
        my: "0",
        borderRadius: "0",
      },
    })
  }


const baseStyle = definePartsStyle({
  header: {
    bgColor:"heading",
    color: "white"
  },
  closeButton: {
    bgColor:"gray.300",
    border: "1px"
  },
  dialog: {
    border: "1px",
  }
})


export const drawerTheme = defineMultiStyleConfig({ baseStyle,sizes })