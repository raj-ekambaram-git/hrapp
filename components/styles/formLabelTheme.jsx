import { defineStyle, defineStyleConfig } from "@chakra-ui/styled-system"

const baseStyle = defineStyle({
  fontSize: "14px",
  marginEnd: "3",
  mb: "2",
  fontWeight: "500",
  transitionProperty: "common",
  transitionDuration: "normal",
  opacity: 1,
  _disabled: {
    opacity: 0.4,
  },
})

export const formLabelTheme = defineStyleConfig({
  baseStyle,
})