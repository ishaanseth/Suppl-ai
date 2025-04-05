import React from 'react';

// Import Material UI components
import CssBaseline from '@mui/material/CssBaseline'; // Normalizes styles across browsers
import AppBar from '@mui/material/AppBar';         // Top navigation bar
import Toolbar from '@mui/material/Toolbar';       // Lays out items inside AppBar
import Typography from '@mui/material/Typography';   // For text display
import Container from '@mui/material/Container';     // Centers and pads content
import Box from '@mui/material/Box';               // Generic container for styling

// Import your main dashboard component here later
// import InventoryDashboard from './pages/InventoryDashboard'; // Example path

function App() {
  // Remove the default Vite state (useState for count) if it's still here

  return (
    // React Fragment <>...</> allows returning multiple elements without adding an extra div to the DOM
    <>
      {/* Apply baseline CSS resets and theme defaults */}
      <CssBaseline />

      {/* Top Application Bar */}
      <AppBar position="static"> {/* 'static' makes it stay at the top, doesn't stick on scroll */}
        <Toolbar>
          {/* Application Title */}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            SupplyChainAgentX Optimization Platform
          </Typography>
          {/* You could add icons or buttons here later if needed */}
        </Toolbar>
      </AppBar>

      {/* Main Content Area */}
      <Container maxWidth="xl"> {/* Use 'xl', 'lg', 'md', 'sm', or 'xs' to control max width. 'xl' is wide. */}
        {/* Box adds padding/margin. my: 4 means margin-top and margin-bottom of theme spacing unit 4 (e.g., 32px) */}
        <Box sx={{ my: 4 }}>

          {/* --- Placeholder for your Dashboard --- */}
          {/* Replace this Typography with your actual dashboard component */}
          <Typography variant="h4" component="h1" gutterBottom>
            Dashboard Overview
          </Typography>
          <Typography paragraph>
            Inventory levels, recommendations, and other insights will be displayed here.
          </Typography>
          {/* Example of where to put your component later: */}
          {/* <InventoryDashboard /> */}
          {/* You might add routing here later to switch between different dashboards */}

          {/* --- End Placeholder --- */}

        </Box>
      </Container>

      {/* You could add a Footer component here later if needed */}
    </>
  );
}

export default App;