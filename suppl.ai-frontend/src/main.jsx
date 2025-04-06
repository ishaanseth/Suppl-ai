// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
// Removed default index.css import if you handle all styling via MUI/theme
// import './index.css';

// --- Import ThemeProvider and your custom theme ---
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import ThemeContextProvider from './ThemeContextProvider';
// ----------------------------------------------------

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* --- Wrap App with ThemeContextProvider --- */}
    <ThemeContextProvider>
      {/* CssBaseline now goes inside ThemeContextProvider */}
      {/* to ensure it uses the correct theme */}
      <CssBaseline />
      <App />
    </ThemeContextProvider>
    {/* ----------------------------------------- */}
  </React.StrictMode>,
);