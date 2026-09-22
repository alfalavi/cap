import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2f6fed',
      light: '#dfeaff',
      dark: '#1f4db3',
    },
    secondary: {
      main: '#101828',
      light: '#64748b',
      dark: '#0f172a',
    },
    success: {
      main: '#12a36b',
      light: '#dff9ee',
    },
    warning: {
      main: '#f59e0b',
      light: '#fff3d9',
    },
    error: {
      main: '#dc2626',
    },
    background: {
      default: '#f5f7fb',
      paper: '#ffffff',
    },
    text: {
      primary: '#162033',
      secondary: '#5f6d87',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: { fontWeight: 800, letterSpacing: '-0.05em' },
    h2: { fontWeight: 800, letterSpacing: '-0.04em' },
    h3: { fontWeight: 800, letterSpacing: '-0.04em' },
    h4: { fontWeight: 700, letterSpacing: '-0.03em' },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    overline: {
      letterSpacing: '0.14em',
      fontWeight: 700,
      textTransform: 'uppercase',
    },
  },
  shape: {
    borderRadius: 4,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid rgba(148, 163, 184, 0.18)',
          borderRadius: 4,
          boxShadow: '0 18px 40px rgba(15, 23, 42, 0.06)',
          backgroundImage: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 4,
          fontWeight: 700,
          boxShadow: 'none',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 700,
          borderRadius: 999,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 4,
          },
        },
      },
    },
  },
});

export default theme;
