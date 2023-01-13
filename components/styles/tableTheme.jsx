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
  },
  td: {
    // .css-hpoh76{text-align:start;-webkit-padding-start:var(--chakra-space-6);padding-inline-start:var(--chakra-space-6);-webkit-padding-end:var(--chakra-space-6);padding-inline-end:var(--chakra-space-6);padding-top:var(--chakra-space-4);padding-bottom:var(--chakra-space-4);line-height: 10px;
    paddingTop: '6px',
    paddingBottom: '6px'
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
  },
  th: {
  },
  tbody: {
    textTransform: "uppercase",
    fontSize: "13px"
  }
})



export const tableTheme = defineMultiStyleConfig({ baseStyle,  variants: {list, sortTable} })