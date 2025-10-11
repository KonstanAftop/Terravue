import { createTheme } from '@mui/material/styles'

// Earth-tone color palette for sustainability theme
export const theme = createTheme({
  palette: {
    primary: {
      main: '#2E7D32', // Forest Green
      light: '#4CAF50',
      dark: '#1B5E20',
    },
    secondary: {
      main: '#6D4C41', // Brown
      light: '#8D6E63',
      dark: '#4E342E',
    },
    info: {
      main: '#0288D1', // Ocean Blue
      light: '#03A9F4',
      dark: '#01579B',
    },
    success: {
      main: '#4CAF50',
    },
    warning: {
      main: '#FF9800',
    },
    error: {
      main: '#F44336',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 600,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
  },
})


