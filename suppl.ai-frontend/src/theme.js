// src/theme.js
import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors'; // Example import for error color

// --- Choose Your Fonts ---
// Import font weights from Google Fonts in your main HTML (public/index.html) or using a package like @fontsource
// Example using @fontsource (install first: npm install @fontsource/poppins @fontsource/roboto)
import '@fontsource/poppins/300.css';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/700.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';

// --- Define Your Palette ---
// Example Palette (Cool & Professional)
const palette = {
  primary: {
    // main: '#0D47A1', // Deep Blue
    main: '#1565C0', // Slightly Lighter Blue
    light: '#5e92f3',
    dark: '#003c8f',
    contrastText: '#ffffff',
  },
  secondary: {
    // main: '#FF6F00', // Amber/Orange accent
    main: '#4CAF50', // Green accent for Success/Apply?
    light: '#80e27e',
    dark: '#087f23',
    contrastText: '#000000', // Or white depending on main color shade
  },
  error: {
    main: red[700], // Using imported red shade
  },
  warning: {
    main: '#FFA000', // Amber
  },
  info: {
    main: '#1976D2', // Default Blue Info
  },
  success: {
      main: '#388E3C', // Darker Green
  },
  background: {
    default: '#f4f6f8', // Light grey background
    paper: '#ffffff', // White background for cards, paper etc.
  },
  text: {
    primary: '#212121', // Dark grey for primary text
    secondary: '#757575', // Lighter grey for secondary text
  },
};

// --- Define Typography ---
const typography = {
  fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif', // Primary font
  h1: { fontWeight: 700, fontSize: '2.5rem' },
  h2: { fontWeight: 700, fontSize: '2rem' },
  h3: { fontWeight: 500, fontSize: '1.75rem' },
  h4: { fontWeight: 500, fontSize: '1.5rem' }, // Page Titles
  h5: { fontWeight: 500, fontSize: '1.25rem' }, // Card Headers
  h6: { fontWeight: 500, fontSize: '1.1rem' }, // Sub-headers
  subtitle1: { fontWeight: 500 },
  body1: { fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif', fontSize: '1rem' }, // Use Roboto for body for readability?
  body2: { fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif', fontSize: '0.875rem' },
  button: {
    textTransform: 'none', // Buttons without ALL CAPS
    fontWeight: 500,
  },
  caption: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
};

// --- Define Component Overrides (Optional but powerful) ---
const components = {
  // Example: Style all Cards
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 8, // Slightly more rounded corners
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)', // Softer shadow
        // transition: 'box-shadow 0.3s ease-in-out', // Add transition on hover/focus
        // '&:hover': {
        //   boxShadow: '0 8px 16px rgba(0,0,0,0.12)', // Slightly larger shadow on hover
        // }
      },
    },
  },
  // Example: Style all Buttons
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 6, // Match card radius slightly
        padding: '8px 20px', // Adjust padding
      },
      containedPrimary: { // Style for primary contained buttons
        // Example: Add subtle gradient or darker hover
         '&:hover': {
             backgroundColor: palette.primary.dark,
         }
      },
       containedSecondary: { // Style for secondary contained buttons
         '&:hover': {
             backgroundColor: palette.secondary.dark,
         }
      },
    },
  },
  // Example: Style the AppBar
  MuiAppBar: {
    styleOverrides: {
      root: {
         boxShadow: 'none', // Flatter look? Or keep default shadow
         // backgroundColor: palette.background.paper, // Use paper color for AppBar?
         // color: palette.text.primary, // Adjust text color if background changes
         borderBottom: `1px solid #e0e0e0` // Add subtle border if removing shadow
      },
    },
  },
  // Example: Style Alerts
  MuiAlert: {
      styleOverrides: {
          root: {
              borderRadius: 6,
          },
          // Customize standard alerts for more visual distinction
          standardError: { backgroundColor: '#ffebee', color: red[800], border: `1px solid ${red[200]}` },
          standardWarning: { backgroundColor: '#fff8e1', color: '#b77c00', border: `1px solid #ffecb3` },
          standardInfo: { backgroundColor: '#e3f2fd', color: '#0d47a1', border: `1px solid #bbdefb` },
          standardSuccess: { backgroundColor: '#e8f5e9', color: '#1b5e20', border: `1px solid #c8e6c9` },
      }
  }
  // Add overrides for other components like TextField, Chip, etc. as needed
};

// --- Create the Theme ---
const theme = createTheme({
  palette: palette,
  typography: typography,
  components: components,
  shape: {
    borderRadius: 8, // Global border radius default
  },
  // You can also customize spacing, breakpoints, shadows, transitions etc.
  // spacing: 8, // Default spacing unit (8px)
});

export default theme;