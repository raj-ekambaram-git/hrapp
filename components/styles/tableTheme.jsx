import { tableAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers, defineStyle } from '@chakra-ui/react'
import { mode } from "@chakra-ui/theme-tools"

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(tableAnatomy.keys)

  const numericStyles = defineStyle({
    "&[data-is-numeric=true]": {
      textAlign: "end",
    },
  })

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


const reportTableList = definePartsStyle((props) => {
  const { colorScheme: c } = props

  return {
    table:{
      borderColor: "black",
      borderSpacing: '1px',
      borderRadius: "full",
      border: "1px",
      borderColor: "black"
    },
    thead: {
      
    },
    tr:{
    },
    th: {
      color: mode("gray.600", "gray.400")(props),
      borderColor: mode(`${c}.100`, `${c}.700`)(props),
      ...numericStyles,
      fontSize: "13px",
      fontWeight: "900",
      fontcolor: "black",
      textTransform: "none",     
      height: "30px" 
    },
    td: {
      borderColor: mode(`${c}.100`, `${c}.700`)(props),
      ...numericStyles,
    },
    caption: {
      color: mode("gray.600", "gray.100")(props),
    },
    tbody: {
      tr: {
        
        fontSize: "12px",
        "&:nth-of-type(even)": {
          "th, td": {
            borderColor: mode(`${c}.50`, `${c}.50`)(props),
            width: "120px",
            height: "30px" 
          },
          td: {
            background: mode(`${c}.50`, `${c}.50`)(props),
            width: "142px",
            height: "30px" ,
            height: "30px" 
          },
        },
      },
    },
    tfoot: {
      tr: {
        "&:last-of-type": {
          th: { borderBottomWidth: 0 },
        },
      },
    },
  }
})

const tableInsideAccoridion = definePartsStyle({
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
    th: {
      
    }
  },
  tr: {
    border: "1px",
    borderColor:"gray.200",
  },
  th: {
  },
  td: {
    
  },
  tbody: {
    th:{
      wordBreak: "normal",
      overflow: "hidden",
      wordWrap: "break-word"
    }
  }
})



export const tableTheme = defineMultiStyleConfig({ baseStyle,  variants: {reportTableList, tableInsideAccoridion,list, sortTable, expensePayment} })