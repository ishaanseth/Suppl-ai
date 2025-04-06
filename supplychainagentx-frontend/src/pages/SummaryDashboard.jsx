// src/pages/SummaryDashboard.jsx
import React, { useState, useEffect, useMemo } from 'react';
// Removed ReactMarkdown as we will display plain text or structure differently

// Import Material UI components
import {
  Container, Box, Typography, Card, CardContent, CircularProgress, Alert, Grid, Paper, Chip, Divider, List, ListItem, ListItemText, ListItemIcon
} from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'; // Red
import WarningAmberIcon from '@mui/icons-material/WarningAmber'; // Yellow
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'; // Blue
import RecommendIcon from '@mui/icons-material/Recommend'; // For Recommendations

// Import the API function to get the full JSON data
import { fetchDashboardData } from '../services/api'; // Adjust path if needed

// --- Helper Function to Process Data and Categorize Risks/Anomalies ---
// This function now uses the structured JSON data for better categorization.
const processAndCategorizeAnomalies = (data) => {
  const categories = {
    high: [],   // Red
    medium: [], // Yellow
    low: [],    // Blue
  };

  if (!data || !data.anomalyNotes || !data.deliveryPerformance || !data.supplierQuality || !data.priceFluctuations) {
    console.warn("Missing data required for risk categorization.");
    return categories;
  }

  // Process Anomaly Notes and assign severity based on related data
  data.anomalyNotes.forEach(note => {
    let severity = 'low'; // Default
    let description = note.text;
    let relatedDataInfo = ''; // Add context if found

    // Rule-based severity assignment
    if (note.id === 1) { // ExpressShip delivery delays
        const expressShipDelays = data.deliveryPerformance.filter(d => d.Supplier === 'ExpressShip');
        const maxVariance = Math.max(...expressShipDelays.map(d => d.Variance));
        if (maxVariance >= 10) severity = 'high';
        else if (maxVariance >= 7) severity = 'medium';
        relatedDataInfo = `(Max Delay: +${maxVariance} days)`;
    } else if (note.id === 2) { // GlobalComp & FastSupply quality
        const gcScore = data.supplierQuality.find(s => s.Supplier === 'GlobalComp')?.QualityScore;
        const fsScore = data.supplierQuality.find(s => s.Supplier === 'FastSupply')?.QualityScore;
        // If either is significantly below threshold (< 80), make it high risk
        if ((gcScore && gcScore < 80) || (fsScore && fsScore < 80)) severity = 'high';
        else severity = 'medium'; // Otherwise medium as they are below 85
        relatedDataInfo = `(Scores: GC=${gcScore || 'N/A'}, FS=${fsScore || 'N/A'})`;
    } else if (note.id === 3) { // Air freight emissions/efficiency
        severity = 'medium'; // Inefficiency is usually medium unless costs are extreme
        // Could potentially link to cost data if available
    } else if (note.id === 4) { // Inventory below reorder point
        severity = 'medium'; // Potential stockout risk
        // Check how far below reorder point if needed for high severity
    } else if (note.id === 5) { // Material Z price increase
        const priceHike = data.priceFluctuations.find(p => p.Product === 'Material Z');
        if (priceHike && priceHike.Deviation >= 10) severity = 'high'; // Large single hike
        else if (priceHike && priceHike.Deviation >= 5) severity = 'medium';
        relatedDataInfo = `(+${priceHike?.Deviation.toFixed(2) || 'N/A'}%)`;
    }

    categories[severity].push({
        id: `anomaly-${note.id}`,
        text: description,
        details: relatedDataInfo // Add extra context from data
    });
  });

  return categories;
};


function SummaryDashboard() {
  const [riskCategories, setRiskCategories] = useState({ high: [], medium: [], low: [] });
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAndProcess = async () => {
      setLoading(true);
      setError(null);
      try {
        const fullData = await fetchDashboardData(); // Fetch the comprehensive JSON
        const categorizedData = processAndCategorizeAnomalies(fullData);
        setRiskCategories(categorizedData);
        setRecommendations(fullData.recommendations || []); // Store recommendations
      } catch (err) {
        console.error("Failed to load or process summary data:", err);
        setError("Failed to process summary. Please try refreshing.");
      } finally {
        setLoading(false);
      }
    };
    loadAndProcess();
  }, []);

  // Helper to render a list of risks/anomalies for a given category
  const renderRiskCategory = (title, anomalies, color, Icon) => (
    <Grid item xs={12} md={4}>
      <Typography variant="h6" component="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: `${color}.main` }}>
        <Icon sx={{ mr: 1 }} /> {title} ({anomalies.length})
      </Typography>
      <Divider sx={{ mb: 2 }} />
      {anomalies.length > 0 ? (
        anomalies.map((anomaly) => (
          <Paper key={anomaly.id} elevation={1} sx={{ p: 1.5, mb: 2, borderLeft: `4px solid ${color}.main` }}>
            <Typography variant="body2">{anomaly.text}</Typography>
            {anomaly.details && <Typography variant="caption" color="text.secondary">{anomaly.details}</Typography>}
          </Paper>
        ))
      ) : (
        <Typography variant="body2" sx={{ textAlign: 'center', fontStyle: 'italic', mt: 2 }}>
          No items identified in this category.
        </Typography>
      )}
    </Grid>
  );

  // --- Render Logic ---

  if (loading) { /* ... keep loading indicator ... */ }
  if (error) { /* ... keep error alert ... */ }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
        Supply Chain Risk & Recommendation Summary
      </Typography>

      {/* Section 1: Categorized Anomalies */}
       <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 2 }}>
            Key Anomalies by Severity (Q1 2025)
        </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {renderRiskCategory("High Severity", riskCategories.high, 'error', ErrorOutlineIcon)}
        {renderRiskCategory("Medium Severity", riskCategories.medium, 'warning', WarningAmberIcon)}
        {renderRiskCategory("Low Severity", riskCategories.low, 'info', InfoOutlinedIcon)}
      </Grid>

      {/* Section 2: Recommendations */}
      <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 2 }}>
            Recommendations
      </Typography>
       <Card elevation={2}>
            <CardContent>
                 <List dense> {/* Use dense list for recommendations */}
                    {recommendations.length > 0 ? (
                        recommendations.map((rec) => (
                            <ListItem key={rec.id} disablePadding sx={{ pb: 0.5 }}>
                                <ListItemIcon sx={{ minWidth: '32px'}}> {/* Smaller icon padding */}
                                    <RecommendIcon color="action" fontSize="small"/>
                                </ListItemIcon>
                                <ListItemText primary={rec.text} primaryTypographyProps={{ variant: 'body2' }} />
                            </ListItem>
                        ))
                    ) : (
                        <Typography variant="body2" sx={{ fontStyle: 'italic', textAlign: 'center' }}>
                            No specific recommendations provided in this report.
                        </Typography>
                    )}
                 </List>
            </CardContent>
        </Card>
    </Container>
  );
}

export default SummaryDashboard;