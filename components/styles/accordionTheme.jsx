import { accordionAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers, defineStyle } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(accordionAnatomy.keys)

const mainPage = definePartsStyle({
    root: {
      borderRadius: 'lg',
    },
    container: {
        marginBottom: "1rem",
        width: "100%",
        borderRadius: 'lg'
      },
    button: {
         bgColor: "table_tile",
         borderRadius: 'lg',
         fontSize: "14px"
    },
    
    panel: {
      border: '1px',
      borderRadius: 'lg'
    },
    icon: {
      border: '1px solid',
      borderColor: 'gray.800',
      background: 'gray.200',
      borderRadius: 'full',
      color: 'gray.800',

      _dark: {
        borderColor: 'gray.600',
        background: 'gray.600',
        color: 'gray.400',
      },
    },
  })

  const vendorReport = definePartsStyle({
    container: {
        marginTop: "2rem",        
      },
    button: {
         bgColor: "table_tile",
         borderRadius: "5px",
    },
    
    panel: {          
    },
    icon: {
      border: '2px solid',
      borderColor: 'black',
      background: 'gray.200',
      borderRadius: 'full',
      color: 'black',
    },
  })

const baseStyle = definePartsStyle({
    // define the part you're going to style
    container: {
    },
  })
  
export const accordionTheme = defineMultiStyleConfig({ 
    baseStyle,
    variants: { mainPage,vendorReport }
})
  