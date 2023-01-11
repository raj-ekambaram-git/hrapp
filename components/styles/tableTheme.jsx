import { tableAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(tableAnatomy.keys)


const list = definePartsStyle({
  container: {
    borderWidth: '1px',
    borderRadius: 'lg',
    overflow: 'hidden', 
    border: "1px",
    
  },
  footer: {
    maxH: "5px",
    alignItems: "center",
    fontSize: '12px',
    bgColor: '#EDF2F7'
  }

})

const baseStyle = definePartsStyle({
  // define the part you're going to style
  table: {
    rounded: "40px",
    d: 'inline-block',
    border: "2px solid",
    borderColor:"gray.200",
    borderRadius: "20px",
    variant:"simple",
    borderSpacing: "0 1em"
  },
  thead: {
    bgColor: 'table_tile',
  },
  tr: {
    
  },
  th: {
  },
  tbody: {
  }
})



export const tableTheme = defineMultiStyleConfig({ baseStyle,  variants: {list} })