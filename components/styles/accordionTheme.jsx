import { accordionAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers, defineStyle } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(accordionAnatomy.keys)

const custom = definePartsStyle({
    container: {
        bg: 'red.200', // change the backgroundColor of the container
      },
    button: {

    },
  panel: {
    border: '1px solid',
    borderColor: 'blue',
    background: 'gray.50',
    borderRadius: 'full',

    // Let's also provide dark mode alternatives
    _dark: {
      borderColor: 'gray.600',
      background: 'gray.800',
    },
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


export const accordionTheme = defineMultiStyleConfig({
    defaultProps: {
      size: 'xl',
      variant: 'custom',
    },
  })