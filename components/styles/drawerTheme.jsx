import { drawerAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(drawerAnatomy.keys)

const baseStyle = definePartsStyle({
  header: {
    bgColor:"heading",
    color: "white"
  },
})


export const drawerTheme = defineMultiStyleConfig({ baseStyle })