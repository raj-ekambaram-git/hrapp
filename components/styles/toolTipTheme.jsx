import { defineStyle, defineStyleConfig } from '@chakra-ui/react'

const slideBar = {
  borderRadius: 'md', // add a border radius
  fontWeight: 'normal', // change the font weight
  border: '1px solid', // add a border
  placement: "right"
}


export const toolTipTheme = defineStyleConfig(({  variants: {slideBar} }))
