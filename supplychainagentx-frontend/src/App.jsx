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

// Page/Component Imports
import InventoryDashboard from './pages/InventoryDashboard';
import LogisticsDashboard from './pages/LogisticsDashboard';
import DemandDashboard from './pages/DemandDashboard';
import RiskDashboard from './pages/RiskDashboard'; // <-- Import Risk Dashboard

function App() {
  return (
    <BrowserRouter>
      <>
        <CssBaseline />
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              SupplyChainAgentX Platform
            </Typography>

            {/* Navigation Links */}
            <Button color="inherit" component={RouterLink} to="/" sx={{ ml: 2 }}> Inventory </Button>
            <Button color="inherit" component={RouterLink} to="/logistics" sx={{ ml: 1 }}> Logistics </Button>
            <Button color="inherit" component={RouterLink} to="/demand" sx={{ ml: 1 }}> Demand </Button>
             {/* --- Add Risk Button --- */}
            <Button color="inherit" component={RouterLink} to="/risk" sx={{ ml: 1 }}> Risk </Button>
            {/* ----------------------- */}

          </Toolbar>
        </AppBar>

        <Container maxWidth="xl">
          <Box sx={{ my: 4 }}>
            <Routes>
              <Route path="/" element={<InventoryDashboard />} />
              <Route path="/logistics" element={<LogisticsDashboard />} />
              <Route path="/demand" element={<DemandDashboard />} />
               {/* --- Add Risk Route --- */}
              <Route path="/risk" element={<RiskDashboard />} />
              {/* ---------------------- */}
              {/* <Route path="*" element={<NotFound />} /> */}
            </Routes>
          </Box>
        </Container>
      </>
    </BrowserRouter>
  );
}

export default App;