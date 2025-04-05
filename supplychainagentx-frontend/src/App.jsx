// src/App.jsx
import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { BrowserRouter, Routes, Route, Link as RouterLink } from 'react-router-dom';

// Import NEW page components
import Homepage from './pages/Homepage';
// We will create these later
// import DataDashboard from './pages/DataDashboard';
// import SummaryDashboard from './pages/SummaryDashboard';
// import AddDataContext from './pages/AddDataContext';

// Remove OLD page imports (InventoryDashboard, LogisticsDashboard, etc.)

function App() {
  return (
    <BrowserRouter>
      <>
        <CssBaseline />
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Supply Chain Analysis Platform
            </Typography>

            {/* --- NEW Navigation Links --- */}
            <Button color="inherit" component={RouterLink} to="/" sx={{ ml: 2 }}> Analysis Home </Button>
            <Button color="inherit" component={RouterLink} to="/data" sx={{ ml: 1 }}> Data View </Button>
            <Button color="inherit" component={RouterLink} to="/summary" sx={{ ml: 1 }}> Risk Summary </Button>
            <Button color="inherit" component={RouterLink} to="/add-data" sx={{ ml: 1 }}> Add Context </Button>
            {/* ---------------------------- */}

          </Toolbar>
        </AppBar>

        <Container maxWidth="xl"> {/* Keep it wide for potentially large text blocks */}
          <Box sx={{ my: 4 }}>
            {/* --- NEW Routes --- */}
            <Routes>
              <Route path="/" element={<Homepage />} />
              {/* Add routes for other pages later */}
              {/* <Route path="/data" element={<DataDashboard />} /> */}
              {/* <Route path="/summary" element={<SummaryDashboard />} /> */}
              {/* <Route path="/add-data" element={<AddDataContext />} /> */}

              {/* Optional: A catch-all route for 404 Not Found pages */}
              {/* <Route path="*" element={<NotFound />} /> */}
            </Routes>
             {/* ---------------- */}
          </Box>
        </Container>
      </>
    </BrowserRouter>
  );
}

export default App;