// src/ThemeContextProvider.jsx
import React, { useState, useMemo, createContext } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { red } from '@mui/material/colors';

// Import fonts (make sure these are installed: npm install @fontsource/poppins @fontsource/roboto)
import '@fontsource/poppins/300.css';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/700.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';

// Create a context for the color mode
export const ColorModeContext = createContext({ toggleColorMode: () => {} });

// Function to generate theme options based on mode
const getDesignTokens = (mode) => ({
  palette: {
    mode, // This is the key change: 'light' or 'dark'
    primary: {
      main: '#1565C0', // Keep primary consistent? Or adjust for dark mode?
      light: '#5e92f3',
      dark: '#003c8f',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#4CAF50',
      light: '#80e27e',
      dark: '#087f23',
      contrastText: mode === 'light' ? '#000000' : '#ffffff', // Adjust contrast text
    },
    error: { main: red[mode === 'light' ? 700 : 400] }, // Lighter red for dark mode
    warning: { main: '#FFA000' },
    info: { main: '#1976D2' },
    success: { main: '#388E3C' },
    ...(mode === 'light'
      ? { // Light Mode Specific Colors
          background: { default: '#f4f6f8', paper: '#ffffff' },
          text: { primary: '#212121', secondary: '#757575' },
          divider: 'rgba(0, 0, 0, 0.12)',
        }
      : { // Dark Mode Specific Colors
          background: { default: '#121212', paper: '#1e1e1e' }, // Common dark mode shades
          text: { primary: '#ffffff', secondary: 'rgba(255, 255, 255, 0.7)' },
          divider: 'rgba(255, 255, 255, 0.12)',
        }),
  },
  typography: {
      // Keep typography consistent or define mode-specific variations if needed
     fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
     // ... (rest of your typography settings from theme.js)
     h4: { fontWeight: 500, fontSize: '1.5rem' },
     h5: { fontWeight: 500, fontSize: '1.25rem' },
     h6: { fontWeight: 500, fontSize: '1.1rem' },
     button: { textTransform: 'none', fontWeight: 500 },
  },
   components: {
      // Define component overrides (can also be mode-specific if needed)
     MuiCard: { styleOverrides: { root: { borderRadius: 8, /* Softer shadow for dark? */ boxShadow: mode === 'dark' ? '0 4px 12px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.08)', } } },
     MuiButton: { styleOverrides: { root: { borderRadius: 6, padding: '8px 20px' } } },
     MuiAppBar: { styleOverrides: { root: { boxShadow: 'none', borderBottom: `1px solid ${mode === 'light' ? '#e0e0e0' : 'rgba(255, 255, 255, 0.12)'}` } } },
      MuiDrawer: { styleOverrides: { paper: { borderRight: 'none' } } }, // Ensure drawer border is off
     // ... (rest of your component overrides from theme.js)
       MuiAlert: {
            styleOverrides: { // Slightly adjusted dark mode alert colors
                root: { borderRadius: 6, },
                standardError: mode === 'light' ? { backgroundColor: '#ffebee', color: red[800], border: `1px solid ${red[200]}` } : { backgroundColor: '#2f1a1a', color: red[300], border: `1px solid ${red[900]}` },
                standardWarning: mode === 'light' ? { backgroundColor: '#fff8e1', color: '#b77c00', border: `1px solid #ffecb3` } : { backgroundColor: '#2f2818', color: '#ffd54f', border: `1px solid '#5f4900'` },
                standardInfo: mode === 'light' ? { backgroundColor: '#e3f2fd', color: '#0d47a1', border: `1px solid #bbdefb` } : { backgroundColor: '#18202c', color: '#90caf9', border: `1px solid '#0d3c61'` },
                standardSuccess: mode === 'light' ? { backgroundColor: '#e8f5e9', color: '#1b5e20', border: `1px solid #c8e6c9` } : { backgroundColor: '#1a291a', color: '#a5d6a7', border: `1px solid '#103d12'` },
            }
        }
  },
  shape: { borderRadius: 8 },
});

export default function ThemeContextProvider({ children }) {
  const [mode, setMode] = useState('light'); // Default to light mode

  // Memoize colorMode object to prevent unnecessary re-renders
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  // Memoize theme object based on mode
  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <MuiThemeProvider theme={theme}>
        {children}
      </MuiThemeProvider>
    </ColorModeContext.Provider>
  );
}