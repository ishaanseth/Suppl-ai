// src/pages/LogisticsDashboard.jsx
import React, { useState, useEffect } from 'react';

// Import Material UI components
import {
  Card, CardContent, Typography, Button, Alert, Box, CircularProgress, Grid, Paper // Added Paper for KPI display
} from '@mui/material';

// Import Recharts components (Optional: If adding charts later)
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Import API functions
import { fetchLogisticsPerformance, fetchLogisticsRecommendations, applyRecommendation } from '../services/api';

// Helper component to display a single KPI
const KpiCard = ({ title, value, unit = '' }) => (
  <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
    <Typography color="text.secondary" gutterBottom>{title}</Typography>
    <Typography variant="h5" component="div">
      {value}{unit}
    </Typography>
  </Paper>
);

function LogisticsDashboard() {
  const [kpiData, setKpiData] = useState(null);
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
        const [performanceData, recData] = await Promise.all([
          fetchLogisticsPerformance(),
          fetchLogisticsRecommendations()
        ]);
        setKpiData(performanceData);
        setRecommendations(recData);
      } catch (err) {
        console.error("Failed to load logistics dashboard data:", err);
        setError("Failed to load data. Please try refreshing.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Handler for applying recommendation (reusing the same logic/API call)
  const handleApplyRecommendation = async () => {
    if (!recommendations || applying) return;
    setApplying(true);
    setError(null);
    try {
      await applyRecommendation(recommendations.id);
      setRecommendations(null); // Optimistic update
      // Potentially refetch KPIs or show success message
      console.log("Logistics recommendation applied successfully!");
    } catch (err) {
      console.error("Failed to apply logistics recommendation:", err);
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
        <Typography sx={{ ml: 2 }}>Loading Logistics Data...</Typography>
      </Box>
    );
  }

  if (error && !applying) {
    return <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>;
  }

  return (
    <Grid container spacing={3}>
      {/* Logistics KPIs Section */}
      <Grid item xs={12}>
        <Typography variant="h5" component="h2" gutterBottom>
          Logistics Performance KPIs
        </Typography>
        {kpiData ? (
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}> <KpiCard title="On-Time Delivery" value={kpiData.onTimeDelivery} unit="%" /> </Grid>
            <Grid item xs={6} sm={3}> <KpiCard title="Transport Cost/Unit" value={kpiData.transportCostPerUnit} unit="$" /> </Grid>
            <Grid item xs={6} sm={3}> <KpiCard title="Vehicle Utilization" value={kpiData.vehicleUtilization} unit="%" /> </Grid>
            <Grid item xs={6} sm={3}> <KpiCard title="Carbon Footprint" value={Math.round(kpiData.carbonFootprintKgCo2).toLocaleString()} unit=" kg CO₂" /> </Grid>
            {/* Add more KPIs if needed */}
          </Grid>
        ) : (
           <Typography sx={{ textAlign: 'center', py: 4 }}>No KPI data available.</Typography>
        )}
      </Grid>

      {/* AI Recommendation Section (only if recommendation exists) */}
      {recommendations && (
         <Grid item xs={12}> {/* Recommendation takes full width below KPIs */}
           <Card sx={{ mt: 2 }}> {/* Add margin top */}
             <CardContent>
               <Typography variant="h6" component="h3" gutterBottom>
                 Logistics AI Recommendation
               </Typography>
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
                 {applying ? <CircularProgress size={24} color="inherit" /> : 'Apply Logistics Recommendation'}
               </Button>
             </CardContent>
           </Card>
         </Grid>
      )}

      {/* Message if no recommendations */}
      {!recommendations && !loading && kpiData && ( // Only show if KPIs loaded but no recs
         <Grid item xs={12}>
           <Card sx={{ mt: 2 }}>
             <CardContent>
               <Typography variant="h6" component="h3" gutterBottom>Logistics AI Recommendation</Typography>
               <Typography sx={{ textAlign: 'center', py: 4 }}>No pending logistics recommendations.</Typography>
             </CardContent>
           </Card>
         </Grid>
       )}
    </Grid>
  );
}

export default LogisticsDashboard;