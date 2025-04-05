// src/pages/DemandDashboard.jsx
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
import { fetchDemandTrends, fetchDemandRecommendations, applyRecommendation } from '../services/api';

function DemandDashboard() {
  const [demandData, setDemandData] = useState([]);
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applying, setApplying] = useState(false);

  // Fetch data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch in parallel
        const [trendsData, recData] = await Promise.all([
          fetchDemandTrends(), // Maybe add product filter later
          fetchDemandRecommendations()
        ]);
        setDemandData(trendsData);
        setRecommendations(recData);
      } catch (err) {
        console.error("Failed to load demand dashboard data:", err);
        setError("Failed to load data. Please try refreshing.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Handler for applying recommendation
  const handleApplyRecommendation = async () => {
    if (!recommendations || applying) return;
    setApplying(true);
    setError(null);
    try {
      await applyRecommendation(recommendations.id);
      setRecommendations(null); // Optimistic update
      console.log("Demand recommendation applied successfully!");
      // Maybe refetch trends or show success message
    } catch (err) {
      console.error("Failed to apply demand recommendation:", err);
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
        <Typography sx={{ ml: 2 }}>Loading Demand Data...</Typography>
      </Box>
    );
  }

  if (error && !applying) {
    return <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>;
  }

  // Filter out future data points that don't have 'actual' for the actual line
  const actualDemandData = demandData.filter(d => d.actual !== undefined && d.actual !== null);

  return (
    <Grid container spacing={3}>
      {/* Demand Forecast Chart */}
      <Grid item xs={12} md={8}>
        <Card>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              Demand Forecast vs. Actual (Units)
            </Typography>
            {demandData.length > 0 ? (
               <ResponsiveContainer width="100%" height={350}>
                 <LineChart
                   data={demandData} // Use full data for forecast line
                   margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                 >
                   <CartesianGrid strokeDasharray="3 3" />
                   <XAxis dataKey="date" />
                   <YAxis />
                   <Tooltip />
                   <Legend />
                   {/* Actual line only uses data points where actual exists */}
                   <Line type="monotone" data={actualDemandData} dataKey="actual" stroke="#8884d8" strokeWidth={2} name="Actual Demand"/>
                   {/* Forecast line uses all data */}
                   <Line type="monotone" dataKey="forecast" stroke="#82ca9d" strokeWidth={2} name="Forecasted Demand" strokeDasharray="5 5"/>
                 </LineChart>
               </ResponsiveContainer>
            ) : (
              <Typography sx={{ textAlign: 'center', py: 4 }}>No demand data available.</Typography>
            )}
          </CardContent>
        </Card>
      </Grid>

       {/* AI Recommendation Section */}
       <Grid item xs={12} md={4}>
         <Card>
            <CardContent>
              <Typography variant="h6" component="h3" gutterBottom>
                Demand AI Recommendation
              </Typography>
              {recommendations ? (
                 <>
                   <Alert severity="info" sx={{ mb: 2 }}>{recommendations.summary}</Alert>
                   <Typography variant="body2" sx={{ mb: 1 }}><strong>Details:</strong> {recommendations.details}</Typography>
                   <Typography variant="body2" sx={{ mb: 1 }}><strong>Reasoning:</strong> {recommendations.reasoning}</Typography>
                   <Typography variant="body2" sx={{ mb: 2 }}><strong>Expected Benefits:</strong> {recommendations.benefits}</Typography>
                   {error && applying && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                   <Button
                     variant="contained"
                     color="primary"
                     onClick={handleApplyRecommendation}
                     disabled={applying}
                     fullWidth
                   >
                     {applying ? <CircularProgress size={24} color="inherit" /> : 'Apply Demand Recommendation'}
                   </Button>
                 </>
               ) : (
                 <Typography sx={{ textAlign: 'center', py: 4 }}>
                   No pending demand recommendations.
                 </Typography>
               )}
            </CardContent>
          </Card>
        </Grid>
    </Grid>
  );
}

export default DemandDashboard;