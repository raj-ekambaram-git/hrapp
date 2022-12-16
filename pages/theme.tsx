

import { extendTheme } from '@chakra-ui/react'

const fonts = { mono: `'Menlo', monospace` }

const breakpoints = {
  sm: '40em',
  md: '52em',
  lg: '64em',
  xl: '80em',
}

const theme = extendTheme({
  components: {
    Accordion: {
      AccordionItem: {
        borders: {
          vendor: '3px'
        }
      }
    }
  },
  semanticTokens: {
    colors: {
      text: {
        default: '#0000FF',
        _dark: '#ade3b8',
      },
      heroGradientStart: {
        default: '#7928CA',
        _dark: '#e3a7f9',
      },
      heroGradientEnd: {
        default: '#FF0080',
        _dark: '#fbec8f',
      },
    },
    radii: {
      button: '12px',
    },
  },
  colors: {
    black: '#16161D',
    heading: '#319795',
    table_tile: '#e4eaee',
    paid_status: '#48BB78',
    pending_status: '#E53E3E',
    button_background: '#16161D',
    cancel_button: 'e4eaee',
    inner_table_tile: '#EDF2F7'
  },
  fonts,
  breakpoints,
  container: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
  borders: {
    accordion_border: '3px'
  },
  width: {
    accoridion_width: '50%'
  }
})

export default theme