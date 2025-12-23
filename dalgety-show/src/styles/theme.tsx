import { createTheme } from '@mui/material/styles';

const components = {
  MuiUseMediaQuery: {
    defaultProps: {
      noSsr: true,
    }
  }
}

 

export const darkTheme = createTheme(
  { 
    components: components, 
    typography: {
      fontFamily: "font-arvo"
    },
    palette: { 
      mode: 'dark',
      secondary: {
        main: '#364153',
      },
      text: {
        primary: '#ffffff',
      },
    } 
  }
)


export const lightTheme = createTheme(
  { 
    components: components, 
    typography: {
      fontFamily: "font-arvo"
    },
    palette: { 
      mode: 'light', 
      primary: {
        main: '#28719f',
        contrastText: 'rgba(0,0,0,0.89)',
      },
      secondary: {
        main:  '#fbfcfb',
      },
        text: {
          primary: '#202020ff',
      },
    } 
  }
)

