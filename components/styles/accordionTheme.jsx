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
        width: "60%",
        borderRadius: 'lg'
      },
    button: {
         bgColor: "table_tile",
         borderRadius: 'lg'
    },
    
    panel: {
      border: '1px',
      borderRadius: 'lg'
    },
    icon: {
      border: '1px solid',
      borderColor: 'gray.200',
      background: 'gray.200',
      borderRadius: 'full',
      color: 'gray.500',

      _dark: {
        borderColor: 'gray.600',
        background: 'gray.600',
        color: 'gray.400',
      },
    },
  })


const baseStyle = definePartsStyle({
    // define the part you're going to style
    container: {
    },
  })
  
export const accordionTheme = defineMultiStyleConfig({ 
    baseStyle,
    variants: { mainPage }
})
  