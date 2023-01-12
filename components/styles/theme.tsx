

import { extendTheme } from '@chakra-ui/react';
import {cardTheme, accordionTheme, buttonTheme, drawerTheme, popoverTheme, boxTheme, tableTheme, flexTheme} from '.';



const fonts = { mono: `'Menlo', monospace`,
heading: `'Roboto Condensed', sans-serif`,
body: `'Roboto Condensed', sans-serif`,}

const breakpoints = {
  sm: '40em',
  md: '52em',
  lg: '64em',
  xl: '80em',
}

const theme = extendTheme({
  components: {
    Card: cardTheme,
    Accordion: accordionTheme,
    Button: buttonTheme,
    Drawer: drawerTheme,
    Popover: popoverTheme,
    Box: boxTheme,
    Table: tableTheme,
    Flext: flexTheme

  },
  semanticTokens: {
    borders: {
      accordion_border: '3px',
      table_border: '1px',
      box_border: '1px'
    },
    colors: {
      dollor_input: 'gray.300',
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
      button: '30px',
    },
    fontSizes: {
        table_display_value: 'sm',
        dollar_left_element: '1.2em'
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
    dollor_input: 'gray.300',
    black: '#16161D',
    heading: '#319795',
    header_actions: '#4FD1C5',
    secondary_button: '#81E6D9',
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
      pending_status: "#E53E3E",
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
  space: {
    page: {
      heading: ".75rem",
      heading_marginBottom: "2rem",
      sub_heading: ".5rem",
      sub_heading_marginBottom: "1rem"
    }
  },
  sizes: {
    page: {
      heading_width: "100%",
      sub_heading_width: "100%",
      single_input: "40%",
      sub_accordion_width: "100%"
    },
    timesheet: {
      nameDropDown: "230px",
      entry_project_header: "10px",
      entry_header:  "60px",
      entry: {
        input: "50px"
      },
      entry_project: "",
      project_drop_down: "600px",
      project_timesheets_name: "30%",
      project_timesheets_resource: "30%",
      project_timesheets_hours: "4%",
      project_timesheets_status: "4%",
      project_timesheets_approved_on: "4%",
      project_timesheets_approved_by: "30%",
      project_timesheets_last_update: "4%",
      project_timesheets_button: "20%",
      note_hover_width: '200px'
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