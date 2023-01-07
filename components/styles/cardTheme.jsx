import { cardAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

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

const replies = definePartsStyle({
  container: {
    alignContent: 'center',
    width: '80%',
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
  container: {
  },
  header: {
    bgColor:"table_tile",
    padding:"page.heading"
  },
  body: {
    
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

export const cardTheme = defineMultiStyleConfig({ baseStyle, sizes, variants: {comment, replies} })