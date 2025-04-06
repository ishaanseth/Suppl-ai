// src/App.jsx
import React, { useState, useContext } from 'react'; // Added useState, useContext
import { BrowserRouter, Routes, Route, Link as RouterLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// MUI Imports
import {
    Box, CssBaseline, AppBar, Toolbar, Typography, Drawer, IconButton, // Added IconButton
    List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Container, useTheme // Added useTheme
} from '@mui/material';

// Icons
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Brightness4Icon from '@mui/icons-material/Brightness4'; // Dark mode icon
import Brightness7Icon from '@mui/icons-material/Brightness7'; // Light mode icon
import HomeIcon from '@mui/icons-material/Home';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SummarizeIcon from '@mui/icons-material/Summarize';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

// Page Imports
import Homepage from './pages/Homepage';
import AddDataContext from './pages/AddDataContext';
import SummaryDashboard from './pages/SummaryDashboard';
import DataDashboard from './pages/DataDashboard';

// Context Import
import { ColorModeContext } from './ThemeContextProvider'; // Adjust path if needed

const drawerWidth = 240;

// --- Animation Settings (keep from previous step) ---
const pageVariants = { /* ... */ initial: { opacity: 0 }, in: { opacity: 1 }, out: { opacity: 0 } };
const pageTransition = { type: "tween", ease: "anticipate", duration: 0.4 };
// --- End Animation ---

// Main Layout Component
function MainLayout() {
    const location = useLocation();
    const theme = useTheme(); // Access the current theme
    const colorMode = useContext(ColorModeContext); // Get the toggle function

    const [isDrawerOpen, setIsDrawerOpen] = useState(true); // State for drawer visibility

    const handleDrawerToggle = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

    const navigationItems = [ /* ... keep your navigation items ... */
        { text: 'Analysis Home', icon: <HomeIcon />, path: '/' },
        { text: 'Data View', icon: <AssessmentIcon />, path: '/data' },
        { text: 'Risk Summary', icon: <SummarizeIcon />, path: '/summary' },
        { text: 'Add Context', icon: <AddCircleOutlineIcon />, path: '/add-data' },
    ];

    const drawer = (
        <div>
             {/* Add Header with Toggle Button */}
             <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', px: [1], ...theme.mixins.toolbar }}>
                
                <Typography  variant="h5" component="div" sx={{ flexGrow: 1, textAlign: 'center', fontWeight: 'bold' }}>Suppl.ai</Typography>
                 <IconButton onClick={handleDrawerToggle}>
                     <ChevronLeftIcon />
                 </IconButton>
             </Toolbar>
            <Divider />
            <List>
             {navigationItems.map((item) => ( /* ... Keep ListItem mapping ... */
                <ListItem key={item.text} disablePadding>
                 <ListItemButton component={RouterLink} to={item.path} selected={location.pathname === item.path} sx={{ /*... Keep styles ...*/ }}>
                   <ListItemIcon>{item.icon}</ListItemIcon>
                   <ListItemText primary={item.text} />
                 </ListItemButton>
                </ListItem>
            ))}
            </List>
        </div>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            {/* CssBaseline removed from here, handled by ThemeContextProvider */}
            <AppBar
                position="fixed"
                 // Apply transition for smooth opening/closing
                sx={{
                    width: { sm: `calc(100% - ${isDrawerOpen ? drawerWidth : 0}px)` }, // Adjust width
                    ml: { sm: `${isDrawerOpen ? drawerWidth : 0}px` }, // Adjust margin
                    transition: theme.transitions.create(['margin', 'width'], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.leavingScreen,
                    }),
                    ...(isDrawerOpen && { // Styles when drawer is open
                        width: `calc(100% - ${drawerWidth}px)`,
                        marginLeft: `${drawerWidth}px`,
                        transition: theme.transitions.create(['margin', 'width'], {
                            easing: theme.transitions.easing.easeOut,
                            duration: theme.transitions.duration.enteringScreen,
                        }),
                    }),
                    // Keep other AppBar styles
                     backgroundColor: 'background.paper',
                     color: 'text.primary',
                     boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                     borderBottom: `1px solid ${theme.palette.divider}`
                 }}
                elevation={0}
            >
                <Toolbar>
                    {/* Drawer Toggle Button (only shows when closed) */}
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerToggle}
                        edge="start"
                        sx={{ mr: 2, ...(isDrawerOpen && { display: 'none' }) }} // Hide when drawer open
                    >
                        <MenuIcon />
                    </IconButton>
                     {/* Title */}
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                         {navigationItems.find(item => item.path === location.pathname)?.text || 'Supply Chain Analysis'}
                    </Typography>
                    {/* Dark Mode Toggle Button */}
                     <IconButton sx={{ ml: 1 }} onClick={colorMode.toggleColorMode} color="inherit">
                        {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                    </IconButton>
                </Toolbar>
            </AppBar>

            {/* Drawer (changed variant, added open prop) */}
            <Drawer
                variant="persistent" // Or "temporary" if you want overlay
                anchor="left"
                open={isDrawerOpen} // Control visibility with state
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        borderRight: 'none', // Ensure no default border
                        backgroundColor: 'background.paper' // Use theme paper color
                    },
                }}
            >
                {drawer}
            </Drawer>

            {/* Main Content Area (adjusted sx for transition) */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    bgcolor: 'background.default',
                    p: 3,
                    marginTop: '64px', // AppBar height offset
                    transition: theme.transitions.create('margin', { // Transition margin
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.leavingScreen,
                    }),
                    marginLeft: `-${drawerWidth}px`, // Start shifted left
                    ...(isDrawerOpen && { // Styles when drawer is open
                        transition: theme.transitions.create('margin', {
                            easing: theme.transitions.easing.easeOut,
                            duration: theme.transitions.duration.enteringScreen,
                        }),
                        marginLeft: 0, // Shift back to 0 margin
                    }),
                    // Add width adjustment if needed, though flexGrow often handles it
                    // width: `calc(100% - ${isDrawerOpen ? drawerWidth : 0}px)`,
                }}
            >
                <AnimatePresence mode="wait">
                    <Routes location={location} key={location.pathname}>
                         {/* --- Keep route definitions with motion.div wrappers --- */}
                        <Route path="/" element={<motion.div /*...*/><Homepage /></motion.div>} />
                        <Route path="/data" element={<motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}><DataDashboard /></motion.div>} />
                        <Route path="/summary" element={<motion.div /*...*/><SummaryDashboard /></motion.div>} />
                        <Route path="/add-data" element={<motion.div /*...*/><AddDataContext /></motion.div>} />\
                        {/* --------------------------------------------------------- */}
                    </Routes>
                </AnimatePresence>
            </Box>
        </Box>
    );
}

function App() {
   return (
     <BrowserRouter>
       <MainLayout />
     </BrowserRouter>
   );
}

export default App;