import { cardAnatomy } from '@chakra-ui/anatomy'
import { border, createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(cardAnatomy.keys)


const comment = definePartsStyle({
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

const timesheetDailyNotes = definePartsStyle({
  container: {
    borderWidth: '1px',
    borderRadius: 'lg',
    overflow: 'hidden', 
    border: "1px",
    marginBottom: '10px'
  },

})

const document = definePartsStyle({
  container: {
    borderWidth: '1px',
    borderRadius: 'lg',
    overflow: 'hidden', 
    border: "1px",
    width: "50%"
    
  },
  footer: {
    maxH: "5px",
    alignItems: "center",
    fontSize: '15px',
    fontWeight: "400",
    bgColor: '#EDF2F7'
  },
  body: {
    
  }

})

const replies = definePartsStyle({
  header: {
    bgColor: '#E6FFFA',
    border: '1px',
    fontSize: '12px',
    fontWeight: 'bold'
  },
  container: {
    marginTop: '1rem',
    marginBottom: '1rem',
    marginLeft: '3rem',
    width: '90%',
    borderWidth: '1px',
    borderRadius: 'lg',
    overflow: 'hidden', 
    border: "1px",
    alignSelf: "right"
    
  },
  footer: {
    maxH: "5px",
    alignItems: "center",
    fontSize: '12px',
    bgColor: '#EDF2F7'
  },
  body: {
    
  }

})


const replyDetails = definePartsStyle({
  header: {
  },
  container: {
    borderWidth: '1px',
    borderRadius: 'lg',
    overflow: 'hidden', 
    border: "1px",
    alignSelf: "right",
    marginBottom: '1rem'
  },
  footer: {
    maxH: "5px",
    alignItems: "center",
    fontSize: '12px',
    bgColor: '#EDF2F7'
  },
  body: {
    
  }

})

const projectFinancialSummary = definePartsStyle({
  container: {
    width: "100%",
    border: "1px",
    borderRadius: "5px",
  },
  body: {
  }

})
  
const baseStyle = definePartsStyle({
  // define the part you're going to style
  container: {
    borderRadius: "50px"
  },
  header: {
    bgColor:"table_tile",
    padding:"page.heading",
    borderRadius: "5px"
  },
  body: {
    rounded: "40px",
    borderRadius: 'lg',
  },
  footer: {
    
  },
})

const sizes = definePartsStyle({
  md: {
    container: {
      borderRadius: '0px',
    },
  },
})

export const cardTheme = defineMultiStyleConfig({ baseStyle, sizes, variants: {comment, replies, replyDetails, document, timesheetDailyNotes, projectFinancialSummary} })