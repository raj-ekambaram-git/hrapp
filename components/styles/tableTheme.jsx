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

const expensePayment = definePartsStyle({
  table: {
  },
  thead: {
    bgColor: 'table_tile',
  },
  tbody: {
    th: {
      maxW: "350px"
    }
  },

})

const sortTable = definePartsStyle({
  table: {
    marginTop: "1rem",    
  },
  thead: {
    bgColor: 'table_tile',
    textTransform: "uppercase",  
  },
  tr: {
    
  },
  th: {
    fontSize: "12px",
    paddingTop: '7px',
    paddingBottom: '6px',
    columnWidth: "60px",
    wordWrap: "break-word",
    textTransform: "none",  
  },
  tbody: {
  },
  td: {
    // .css-hpoh76{text-align:start;-webkit-padding-start:var(--chakra-space-6);padding-inline-start:var(--chakra-space-6);-webkit-padding-end:var(--chakra-space-6);padding-inline-end:var(--chakra-space-6);padding-top:var(--chakra-space-4);padding-bottom:var(--chakra-space-4);line-height: 10px;
    fontSize: "12px",
    paddingTop: '2px',
    paddingBottom: '6px',
    columnWidth: "60px",
    wordWrap: "break-word",
    textTransform: "none",  
    
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
    fontSize: "11px",

  }
})



export const tableTheme = defineMultiStyleConfig({ baseStyle,  variants: {list, sortTable, expensePayment} })