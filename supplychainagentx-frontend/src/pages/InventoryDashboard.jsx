// src/pages/InventoryDashboard.jsx
import React, { useState, useEffect } from 'react';

// Import Material UI components
import {
  Card, CardContent, Typography, Button, Alert, Box, CircularProgress, Grid
} from '@mui/material';

// Import Recharts components
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

// Import API functions
import { fetchInventorySummary, fetchInventoryRecommendations, applyRecommendation } from '../services/api';

function InventoryDashboard() {
  const [inventoryData, setInventoryData] = useState([]);
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applying, setApplying] = useState(false); // State for apply button loading

  // Fetch data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch in parallel for efficiency
        const [summaryData, recData] = await Promise.all([
          fetchInventorySummary(),
          fetchInventoryRecommendations() // Assuming this returns one pending rec or null
        ]);
        setInventoryData(summaryData);
        setRecommendations(recData);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
        setError("Failed to load data. Please try refreshing.");
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Optional: Set up EventSource for real-time updates if backend supports it
    // const eventSource = new EventSource('/api/recommendations/stream'); // Adjust endpoint
    // eventSource.onmessage = (event) => {
    //   const newRecommendation = JSON.parse(event.data);
    //   // Only update if it's relevant to inventory and pending
    //   if (newRecommendation.agent_type === 'InventoryAgent' && newRecommendation.status === 'pending') {
    //      console.log("Received real-time recommendation:", newRecommendation);
    //      setRecommendations(newRecommendation);
    //   }
    // };
    // eventSource.onerror = (err) => {
    //   console.error("EventSource failed:", err);
    //   eventSource.close();
    // };
    // // Cleanup function to close connection when component unmounts
    // return () => {
    //   eventSource.close();
    // };

  }, []); // Empty dependency array means this runs once on mount

  // Handler for applying recommendation
  const handleApplyRecommendation = async () => {
    if (!recommendations || applying) return; // Prevent double-click or applying null

    setApplying(true);
    setError(null); // Clear previous errors
    try {
      await applyRecommendation(recommendations.id);
      // Optimistic update: Remove recommendation from UI immediately
      setRecommendations(null);
      // You might want to refetch data here or show a success message
      console.log("Recommendation applied successfully!");
      // Consider adding a Snackbar notification for better UX
    } catch (err) {
      console.error("Failed to apply recommendation:", err);
      setError("Failed to apply recommendation. Please try again.");
    } finally {
      setApplying(false);
    }
  };

  // --- Render Logic ---

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading Inventory Data...</Typography>
      </Box>
    );
  }

  if (error && !applying) { // Don't show general error while applying action might cause its own error
    return <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>;
  }

  return (
    <Grid container spacing={3}> {/* Use Grid for layout */}
      {/* Inventory Levels Chart */}
      <Grid item xs={12} md={8}> {/* Chart takes more space on medium+ screens */}
        <Card>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              Inventory Levels (Units)
            </Typography>
            {inventoryData.length > 0 ? (
               <ResponsiveContainer width="100%" height={350}>
                 <LineChart
                   data={inventoryData}
                   margin={{ top: 5, right: 30, left: 0, bottom: 5 }} // Adjusted margins
                 >
                   <CartesianGrid strokeDasharray="3 3" />
                   <XAxis dataKey="date" />
                   <YAxis />
                   <Tooltip />
                   <Legend />
                   <Line type="monotone" dataKey="current" stroke="#8884d8" strokeWidth={2} name="Current Level"/>
                   <Line type="monotone" dataKey="optimal" stroke="#82ca9d" strokeWidth={2} name="Recommended Level" strokeDasharray="5 5"/>
                 </LineChart>
               </ResponsiveContainer>
            ) : (
              <Typography sx={{ textAlign: 'center', py: 4 }}>No inventory data available.</Typography>
            )}
          </CardContent>
        </Card>
      </Grid>

       {/* AI Recommendation Section (only if recommendation exists) */}
      {recommendations && (
         <Grid item xs={12} md={4}> {/* Recommendation takes less space */}
           <Card>
             <CardContent>
               <Typography variant="h6" component="h3" gutterBottom>
                 AI Recommendation
               </Typography>
               <Alert severity="info" sx={{ mb: 2 }}>{recommendations.summary}</Alert>
               <Typography variant="body2" sx={{ mb: 1 }}>
                 <strong>Details:</strong> {recommendations.details}
               </Typography>
               <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Reasoning:</strong> {recommendations.reasoning}
               </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  <strong>Expected Benefits:</strong> {recommendations.benefits}
               </Typography>
               {error && applying && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>} {/* Show apply-specific error */}
               <Button
                 variant="contained"
                 color="primary"
                 onClick={handleApplyRecommendation}
                 disabled={applying}
                 fullWidth // Make button take full width of card content area
               >
                 {applying ? <CircularProgress size={24} color="inherit" /> : 'Apply Recommendation'}
               </Button>
               {/* Optional: Add a Reject button */}
               {/* <Button variant="outlined" color="secondary" onClick={handleRejectRecommendation} disabled={applying} fullWidth sx={{ mt: 1 }}>
                 Reject
               </Button> */}
             </CardContent>
           </Card>
         </Grid>
      )}

      {/* Show a message if no recommendations are pending */}
       {!recommendations && !loading && (
         <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="h3" gutterBottom>
                    AI Recommendation
                </Typography>
                <Typography sx={{ textAlign: 'center', py: 4 }}>
                  No pending recommendations.
                </Typography>
              </CardContent>
            </Card>
         </Grid>
       )}

    </Grid>
  );
}

export default InventoryDashboard;