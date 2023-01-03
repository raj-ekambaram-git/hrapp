

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
    },
    Table: {
      borders: {
        border_size: '3px'
      }
    },
    Input: {
      sizes: {
        timeentryBox: '4px'
      }
    }
  },
  semanticTokens: {
    borders: {
      accordion_border: '3px',
      table_border: '1px',
      box_border: '1px'
    },
    colors: {
      tooltip_color: 'red',
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
    fontSizes: {
        table_display_value: 'sm'
    },    
    space:{
      table_display_value: '1'
    },
    sizes: {
      project: {
        add_project: 'lg'
      }
    }
  },
  colors: {
    black: '#16161D',
    heading: '#319795',
    error: '#C53030',
    tooltip_bg_color: 'gray.300',
    tooltip_color: 'red',
    table_tile: '#e4eaee',
    paid_status: '#48BB78',
    pending_status: '#E53E3E',
    button_background: '#16161D',
    cancel_button: '#e4eaee',
    inner_table_tile: '#EDF2F7',
    timesheet: {
      pending_status: "#48BB78",
      approved_status: "#319795",
      rejected_status: "#FC8181",
      save: "#3182CE",
      discard: "#3182CE",
      submit: "#3182CE",
      nameDropDown: "white",
      entryError: "red"
    },
    project: {

    },
    button: {
      primary: {
        color: '#319795',
      },
      secondary: '#e4eaee'
    }
  },
  sizes: {
    timesheet: {
      nameDropDown: "230px",
      entry_project_header: "10px",
      entry_header:  "60px",
      entry: {
        input: "50px"
      },
      entry_project: "",
      project_drop_down: "600px",
      project_timesheets_name: "20%",
      project_timesheets_resource: "37%",
      project_timesheets_hours: "4%",
      project_timesheets_status: "4%",
      project_timesheets_approved_on: "4%",
      project_timesheets_approved_by: "37%",
      project_timesheets_last_update: "4%",
      project_timesheets_button: "20%"
    },      
    project: {
      add_resource: "md",
      add_project: "lg",
      details: {
        column1: '20%'
      }
    },
    button: {
      primary: {
        width: '50%'
      },
      login: {
        width: '25%'
      }
    },
    invoice: {
      quantity_input: '50%',
      total_input: '50%',
      price_input: '50%',
    }
  },
  borderWidths: {
    timesheet: {
      entry: "5px",
      entry_project: "10px",

    }
  },
  letterSpacings: {
    timesheet: {
      entry: "300rem"
    }
  },
  fonts,
  breakpoints,
  container: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
  width: {
    accoridion_width: '50%'
  }
})

export default theme