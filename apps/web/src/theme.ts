import { alpha, createTheme } from '@mui/material/styles'

const baseTypography = {
  fontFamily: '"Inter", "Plus Jakarta Sans", "Roboto", sans-serif',
  h1: { fontWeight: 700, letterSpacing: '-0.02em' },
  h2: { fontWeight: 700, letterSpacing: '-0.02em' },
  h3: { fontWeight: 700 },
  h4: { fontWeight: 600 },
  h5: { fontWeight: 600 },
  button: { textTransform: 'none', fontWeight: 600 },
}

const baseShape = {
  borderRadius: 16,
}

const appPrimaryMain = '#14624A'
const appPrimaryLight = '#1F7A60'
const appPrimaryDark = '#0B3D2D'
const appSecondaryMain = '#1B4B91'
const appSecondaryLight = '#3C6EA5'
const appSecondaryDark = '#103053'
const appBackgroundDefault = '#f3f6f7'
const appBackgroundPaper = '#ffffff'
const appTextPrimary = '#162427'
const appTextSecondary = '#58656B'

export const appTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: appPrimaryMain,
      light: appPrimaryLight,
      dark: appPrimaryDark,
      contrastText: '#ffffff',
    },
    secondary: {
      main: appSecondaryMain,
      light: appSecondaryLight,
      dark: appSecondaryDark,
      contrastText: '#ffffff',
    },
    background: {
      default: appBackgroundDefault,
      paper: appBackgroundPaper,
    },
    text: {
      primary: appTextPrimary,
      secondary: appTextSecondary,
    },
    success: {
      main: '#2E7D32',
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
    divider: alpha(appTextPrimary, 0.1),
  },
  shape: baseShape,
  typography: baseTypography,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: appBackgroundDefault,
          color: appTextPrimary,
          backgroundImage:
            'radial-gradient(circle at 18% 12%, rgba(20,98,74,0.14), transparent 48%), radial-gradient(circle at 82% 0%, rgba(27,75,145,0.12), transparent 52%)',
        },
        '*::selection': {
          backgroundColor: alpha(appPrimaryMain, 0.25),
          color: '#ffffff',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          paddingInline: 24,
          paddingBlock: 10,
        },
        containedPrimary: {
          background: `linear-gradient(135deg, ${appPrimaryMain} 0%, ${appPrimaryLight} 100%)`,
          boxShadow: `0 12px 28px ${alpha(appPrimaryMain, 0.25)}`,
          '&:hover': {
            background: `linear-gradient(135deg, ${appPrimaryDark} 0%, ${appPrimaryMain} 100%)`,
            boxShadow: `0 14px 36px ${alpha(appPrimaryMain, 0.32)}`,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          backgroundColor: appBackgroundPaper,
          backgroundImage: 'none',
          border: `1px solid ${alpha(appPrimaryMain, 0.08)}`,
          boxShadow: `0 20px 46px ${alpha('#0B3D2D', 0.12)}`,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          backgroundColor: appBackgroundPaper,
          border: `1px solid ${alpha(appPrimaryMain, 0.1)}`,
          boxShadow: `0 24px 52px ${alpha('#0B3D2D', 0.1)}`,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: 'linear-gradient(210deg, #081310 0%, #04100D 60%, #020807 100%)',
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
          backgroundColor: 'rgba(255,255,255,0.9)',
          borderBottom: `1px solid ${alpha(appTextPrimary, 0.08)}`,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: alpha(appTextPrimary, 0.08),
        },
      },
    },
  },
})

const lightPrimaryMain = '#14624A'
const lightPrimaryLight = '#1F7A60'
const lightPrimaryDark = '#0B3D2D'
const lightSecondaryMain = '#1B4B91'
const lightBackgroundDefault = '#f2f5f7'
const lightBackgroundPaper = '#ffffff'
const lightTextPrimary = '#162427'
const lightTextSecondary = '#58656B'

export const landingTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: lightPrimaryMain,
      light: lightPrimaryLight,
      dark: lightPrimaryDark,
      contrastText: '#ffffff',
    },
    secondary: {
      main: lightSecondaryMain,
      light: '#3C6EA5',
      dark: '#103053',
      contrastText: '#ffffff',
    },
    background: {
      default: lightBackgroundDefault,
      paper: lightBackgroundPaper,
    },
    text: {
      primary: lightTextPrimary,
      secondary: lightTextSecondary,
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
  shape: baseShape,
  typography: baseTypography,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: lightBackgroundDefault,
          color: lightTextPrimary,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          paddingInline: 24,
          paddingBlock: 10,
        },
        containedPrimary: {
          background: `linear-gradient(135deg, ${lightPrimaryMain} 0%, ${lightPrimaryLight} 100%)`,
          boxShadow: '0 12px 24px rgba(20,98,74,0.25)',
          '&:hover': {
            background: `linear-gradient(135deg, ${lightPrimaryDark} 0%, ${lightPrimaryMain} 100%)`,
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
