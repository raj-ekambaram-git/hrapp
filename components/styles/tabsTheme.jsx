import { tabsAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'
import { getColor } from "@chakra-ui/theme-tools"

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(tabsAnatomy.keys)

  const reports = definePartsStyle((props) => {
    
    const { colorScheme: c, theme } = props
    return {
      tab: {
        borderRadius: "5px",
        fontWeight: "semibold",
        color: "gray.600",
        bg: "table_tile",
        _selected: {
          color: "black",
          bg: "header_actions",
        },
        border: "1px",        
      },
      tabpanels: {
        border: "1px",
        borderRadius: "5px",
        borderColor: "gray.600"
      },      
    }
  })

  const accountSetting = definePartsStyle((props) => {
    
    const { colorScheme: c, theme } = props
    return {
      root: {
        width: "1220px"
      },
      tab: {
        borderRadius: "5px",
        fontWeight: "semibold",
        color: "gray.600",
        bg: "table_tile",
        _selected: {
          color: "black",
          bg: "header_actions",
        },
        border: "1px",        
      },
      tabpanels: {
      
        borderRadius: "5px",
        borderColor: "gray.600"
      },      
    }
  })  

const baseStyle = definePartsStyle({
    // define the part you're going to style
    container: {
    },
  })
  
export const tabsTheme = defineMultiStyleConfig({ 
    baseStyle,
    variants: { reports, accountSetting }
})
  