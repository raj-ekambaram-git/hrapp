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


const sortTable = definePartsStyle({
  table: {
    marginTop: "3rem"
  },
  thead: {
    bgColor: 'table_tile',
  },
  tr: {
    fontSize: "1x"
  },
  th: {
  },
  tbody: {
  }

})
const baseStyle = definePartsStyle({
  // define the part you're going to style
  table: {
    border: "2px solid",
    borderColor:"gray.200",
  },
  thead: {
    bgColor: 'table_tile',
  },
  tr: {
    border: "1px",
    borderColor:"gray.200",
    height: "10px"
  },
  th: {
  },
  tbody: {
    textTransform: "uppercase",
    fontSize: "11px"
  }
})



export const tableTheme = defineMultiStyleConfig({ baseStyle,  variants: {list, sortTable} })