'use client';
import { createTheme } from '@mui/material/styles';


declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    xs: true;
    sm: true;
    md: true;
    lg: true;
    xl: true;
    xxl: true;
  }
}


const components = {
  MuiUseMediaQuery: {
    defaultProps: {
      noSsr: true,
    }
  }
}

const breakpoints = {
  values: {
    xs: 0,
    sm: 600,
    md: 900,
    lg: 1200,
    xl: 1536,
    xxl: 2200
  },
}

const typography = {
  fontFamily: "var(--font-arvo)"
}

export const darkTheme = createTheme(
  { 
    components: components, 
    breakpoints: breakpoints,
    typography: typography,
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
    breakpoints: breakpoints,
    typography: typography,
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

