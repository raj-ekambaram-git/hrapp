import { popoverAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(popoverAnatomy.keys)

const baseStyle = definePartsStyle({
  popper: {
    border: ".25px",
    borderRadius: "10px"
  },
  content:{
    width: "500px",
  },
   header: {
    bgColor:"heading",
    fontWeight: 'semibold',
    color: 'white'
  },
  body: {
    marginTop: "1rem",
    textArea: {
      border: "1px"
    },
  },
  footer: {
    bgColor: '#EDF2F7',
  },
})


export const popoverTheme = defineMultiStyleConfig({ baseStyle })