// src/theme.js
import { createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#BB86FC',
      light: '#D4A7FF',
      dark: '#9459FF',
    },
    secondary: {
      main: '#03DAC6',
      light: '#66FFF8',
      dark: '#00B3A6',
    },
    background: {
      default: '#121212',
      paper: '#1E1E1E',
    },
  },
  typography: {
    h4: {
      fontWeight: 600,
      letterSpacing: '0.02em',
    },
    body1: {
      lineHeight: 1.7,
      fontSize: '1.1rem',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          padding: '12px 24px',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1E1E1E',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        },
      },
    },
  },
});

export default theme;