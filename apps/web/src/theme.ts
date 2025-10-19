import { createTheme, responsiveFontSizes } from '@mui/material/styles'

const primaryMain = '#14624A'
const primaryLight = '#1F7A60'
const primaryDark = '#0B3D2D'
const secondaryMain = '#1B4B91'
const backgroundDefault = '#f2f5f7'
const backgroundPaper = '#ffffff'
const textPrimary = '#162427'
const textSecondary = '#58656B'

let baseTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: primaryMain,
      light: primaryLight,
      dark: primaryDark,
      contrastText: '#ffffff',
    },
    secondary: {
      main: secondaryMain,
      light: '#3C6EA5',
      dark: '#103053',
      contrastText: '#ffffff',
    },
    background: {
      default: backgroundDefault,
      paper: backgroundPaper,
    },
    text: {
      primary: textPrimary,
      secondary: textSecondary,
    },
    success: {
      main: '#2E7D32',
      light: '#4CAF50',
      dark: '#1B5E20',
    },
    warning: {
      main: '#F5A524',
      dark: '#C27C00',
    },
    error: {
      main: '#E53935',
      dark: '#B71C1C',
    },
    info: {
      main: '#0288D1',
      dark: '#01579B',
    },
  },
  shape: {
    borderRadius: 16,
  },
  typography: {
    fontFamily: '"Inter", "Plus Jakarta Sans", "Roboto", sans-serif',
    h1: { fontWeight: 700, letterSpacing: '-0.02em' },
    h2: { fontWeight: 700, letterSpacing: '-0.02em' },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          paddingInline: 24,
          paddingBlock: 10,
        },
        containedPrimary: {
          background: `linear-gradient(135deg, ${primaryMain} 0%, ${primaryLight} 100%)`,
          boxShadow: '0 12px 24px rgba(20,98,74,0.25)',
          '&:hover': {
            background: `linear-gradient(135deg, ${primaryDark} 0%, ${primaryMain} 100%)`,
            boxShadow: '0 12px 32px rgba(20,98,74,0.3)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 24,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          border: '1px solid rgba(20,98,74,0.08)',
          boxShadow: '0 20px 45px rgba(15,61,45,0.08)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#0F1F1D',
          color: '#E9F5F1',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          marginBlock: 4,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(16px)',
          backgroundColor: 'rgba(15,31,29,0.85)',
        },
      },
    },
  },
})

export const theme = responsiveFontSizes(baseTheme)


