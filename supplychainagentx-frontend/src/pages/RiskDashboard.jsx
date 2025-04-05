// src/pages/RiskDashboard.jsx
import React, { useState, useEffect } from 'react';

// Import Material UI components
import {
  Card, CardContent, Typography, Button, Alert, Box, CircularProgress, Grid, Chip // Added Chip for tags
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber'; // Example icon

// Import API functions
import { fetchRiskIndicators, fetchRiskRecommendations, applyRecommendation } from '../services/api';

// Helper function to determine Alert severity based on risk severity
const getSeverity = (riskSeverity) => {
  switch (riskSeverity?.toLowerCase()) {
    case 'high':
    case 'critical':
      return 'error';
    case 'medium':
      return 'warning';
    case 'low':
      return 'info';
    default:
      return 'info';
  }
};

function RiskDashboard() {
  const [riskData, setRiskData] = useState([]);
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
        const [indicators, recData] = await Promise.all([
          fetchRiskIndicators(),
          fetchRiskRecommendations()
        ]);
        setRiskData(indicators);
        setRecommendations(recData);
      } catch (err) {
        console.error("Failed to load risk dashboard data:", err);
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
      console.log("Risk recommendation applied/acknowledged successfully!");
      // Maybe refetch indicators or show success message
    } catch (err) {
      console.error("Failed to apply risk recommendation:", err);
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
        <Typography sx={{ ml: 2 }}>Loading Risk Data...</Typography>
      </Box>
    );
  }

   if (error && !applying) {
    return <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>;
  }

  return (
    <Grid container spacing={3}>
      {/* Active Risks Section */}
      <Grid item xs={12} md={recommendations ? 8 : 12}> {/* Take full width if no recommendation */}
        <Typography variant="h5" component="h2" gutterBottom>
          Active Supply Chain Risks
        </Typography>
        {riskData.length > 0 ? (
          <Box>
            {riskData.map((risk) => (
              <Alert
                key={risk.id}
                severity={getSeverity(risk.severity)}
                icon={<WarningAmberIcon fontSize="inherit" />} // Example icon
                sx={{ mb: 2 }} // Margin bottom between alerts
              >
                <Typography variant="body1" component="div" sx={{ fontWeight: 'bold' }}>
                  {risk.description}
                </Typography>
                <Box sx={{ mt: 0.5 }}>
                  <Chip label={`Severity: ${risk.severity}`} size="small" sx={{ mr: 1 }} color={getSeverity(risk.severity)} />
                  <Chip label={`Status: ${risk.status}`} size="small" sx={{ mr: 1 }}/>
                  <Chip label={`Impact: ${risk.impact_area}`} size="small" sx={{ mr: 1 }}/>
                  <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                     Detected: {new Date(risk.detected_at).toLocaleDateString()}
                  </Typography>
                </Box>
              </Alert>
            ))}
          </Box>
        ) : (
          <Card>
            <CardContent>
              <Typography sx={{ textAlign: 'center', py: 4 }}>No active risks detected.</Typography>
            </CardContent>
          </Card>
        )}
      </Grid>

       {/* AI Recommendation Section (only if recommendation exists) */}
      {recommendations && (
         <Grid item xs={12} md={4}>
           <Card>
             <CardContent>
               <Typography variant="h6" component="h3" gutterBottom>
                 Risk Mitigation Recommendation
               </Typography>
                 <>
                   <Alert severity="warning" sx={{ mb: 2 }}>{recommendations.summary}</Alert>
                   <Typography variant="body2" sx={{ mb: 1 }}><strong>Details:</strong> {recommendations.details}</Typography>
                   <Typography variant="body2" sx={{ mb: 1 }}><strong>Reasoning:</strong> {recommendations.reasoning}</Typography>
                   <Typography variant="body2" sx={{ mb: 2 }}><strong>Expected Benefits:</strong> {recommendations.benefits}</Typography>
                   {error && applying && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                   <Button
                     variant="contained"
                     color="primary" // Or maybe 'warning' color for risk?
                     onClick={handleApplyRecommendation}
                     disabled={applying}
                     fullWidth
                   >
                     {applying ? <CircularProgress size={24} color="inherit" /> : 'Apply Mitigation'}
                   </Button>
                 </>
             </CardContent>
           </Card>
         </Grid>
      )}
    </Grid>
  );
}

export default RiskDashboard;