import { defineStyle, defineStyleConfig } from "@chakra-ui/styled-system"

const baseStyle = defineStyle({
  container: {    
    _focusWithin: {
      label: {
        transform: "scale(0.85) translateY(-24px)",
        backgroundColor: "white",
        fontSize: "15px",
      }
    },
    "input:not(:placeholder-shown) + label, .chakra-select__wrapper + label, textarea:not(:placeholder-shown) ~ label": {
      transform: "scale(0.85) translateY(-24px)"
    },
    label: {
      top: 0,
      left: 0,
      zIndex: 2,
      position: "absolute",
      backgroundColor: "gray.50",
      pointerEvents: "none",
      mx: 3,
      px: 1,
      my: 2,
      transformOrigin: "left top",
      fontSize: "13px",
      fontWeight: "900"
    },
 
  },

})



export const formTheme = defineStyleConfig({
  baseStyle,
  variants: {}
})