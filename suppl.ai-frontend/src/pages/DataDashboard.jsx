// src/pages/DataDashboard.jsx
import React, { useState, useEffect, useMemo } from 'react';
import {
  Container, Grid, Card, CardContent, Typography, Box, CircularProgress, Alert,
  TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, useTheme
} from '@mui/material';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, ScatterChart, Scatter, ZAxis
} from 'recharts';
import { fetchDashboardData } from '../services/api'; // Adjust path if needed

// Helper to format currency (optional)
const formatCurrency = (value) => `$${Number(value).toFixed(2)}`;

// Helper to aggregate data (example for emissions by mode)
const aggregateEmissionsByMode = (data) => {
    if (!data) return [];
    const aggregation = data.reduce((acc, item) => {
        const mode = item.TransportMode || 'Unknown';
        acc[mode] = (acc[mode] || 0) + (item.CarbonEmissions || 0);
        return acc;
    }, {});
    return Object.entries(aggregation).map(([name, value]) => ({ name, value }));
};

// Helper to aggregate quality score by supplier
const aggregateQualityBySupplier = (data) => {
    if (!data) return [];
    // Simple mapping for this example, could average if multiple entries per supplier
    return data.map(item => ({ name: item.Supplier, QualityScore: item.QualityScore, RejectionRate: item.RejectionRate }));
};


function DataDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme(); // Access theme for colors

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchDashboardData();
        setData(result);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
        setError("Failed to load data. Please try refreshing.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Memoize aggregated data to prevent recalculation on every render
  const emissionsByMode = useMemo(() => aggregateEmissionsByMode(data?.carbonFootprint), [data?.carbonFootprint]);
  const qualityBySupplier = useMemo(() => aggregateQualityBySupplier(data?.supplierQuality), [data?.supplierQuality]);

  // Colors for Pie Chart
  const PIE_COLORS = [theme.palette.primary.main, theme.palette.secondary.main, theme.palette.error.main, theme.palette.warning.main, theme.palette.info.main];

  // --- Render Logic ---
  if (loading) { return <Box sx={{ /* ... loading styles ... */ }}><CircularProgress /><Typography sx={{ ml: 2 }}>Loading Data...</Typography></Box>; }
  if (error) { return <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>; }
  if (!data) { return <Typography>No data available.</Typography>; }

  return (
    <Container maxWidth="xl"> {/* Use wide container */}
      <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
        Supply Chain Data View (Q1 2025)
      </Typography>

      <Grid container spacing={3}>

        {/* Delivery Performance Chart */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Delivery Time vs. Expected (Days)</Typography>
              <ResponsiveContainer width="110%" height={300}>
                <LineChart data={data.deliveryPerformance} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="Date" tickFormatter={(tick) => new Date(tick).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="DeliveryTime" stroke={theme.palette.primary.main} name="Actual Time" />
                  <Line type="monotone" dataKey="ExpectedTime" stroke={theme.palette.secondary.main} name="Expected Time" strokeDasharray="5 5"/>
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Supplier Quality Score Chart */}
        <Grid item xs={12} md={12}>
            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>Supplier Quality Score (%)</Typography>
                     <ResponsiveContainer width="101%" height={300}>
                        <BarChart data={qualityBySupplier} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                             <CartesianGrid strokeDasharray="3 3" />
                             <XAxis dataKey="name" angle={-30} textAnchor="end" height={60} interval={0} fontSize="0.8rem"/>
                             <YAxis domain={[0, 100]}/>
                             <Tooltip />
                             <Legend />
                             <Bar dataKey="QualityScore" fill={theme.palette.info.main} name="Quality Score"/>
                             {/* Optional: Add RejectionRate on secondary axis or separate chart */}
                             {/* <Bar dataKey="RejectionRate" fill={theme.palette.error.light} name="Rejection Rate (%)"/> */}
                        </BarChart>
                     </ResponsiveContainer>
                </CardContent>
            </Card>
        </Grid>

        
         {/* Inventory Levels Chart */}
        <Grid item xs={12} sm={6} md={7} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Inventory Levels (Units - Sample: Product 1)</Typography>
              {/* Filter data for chart - could add controls later */}
              <ResponsiveContainer width="110%" height={300}>
                <LineChart data={data.inventoryLevels.filter(d => d.Product === 'Product 1')} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="Date" tickFormatter={(tick) => new Date(tick).toLocaleDateString('en-US', { month: 'short' })}/>
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="CurrentStock" stroke={theme.palette.primary.main} name="Current Stock" />
                  <Line type="monotone" dataKey="OptimalStock" stroke={theme.palette.secondary.main} name="Optimal Level" strokeDasharray="5 5"/>
                   <Line type="monotone" dataKey="ReorderPoint" stroke={theme.palette.error.main} name="Reorder Point" strokeDasharray="2 2"/>
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Carbon Emissions Pie Chart */}
        <Grid item xs={12} sm={6} md={5} lg={4}>
            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>CO₂ Emissions by Transport Mode</Typography>
                     <ResponsiveContainer width="100%" height={300}>
                         <PieChart>
                             <Pie
                                data={emissionsByMode}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                                nameKey="name"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {emissionsByMode.map((entry, index) => (
                                     <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                ))}
                             </Pie>
                             <Tooltip formatter={(value) => `${value.toLocaleString()} kg CO₂`} />
                             <Legend />
                         </PieChart>
                     </ResponsiveContainer>
                </CardContent>
            </Card>
        </Grid>


        {/* Price Fluctuations Table (Example) */}
        <Grid item xs={12} md={6}>
             <Card>
                <CardContent>
                     <Typography variant="h6" gutterBottom>Recent Price Fluctuations</Typography>
                     <TableContainer component={Paper} elevation={0} sx={{ maxHeight: 300 }}>
                         <Table stickyHeader size="small">
                             <TableHead>
                                 <TableRow>
                                     <TableCell>Date</TableCell>
                                     <TableCell>Product</TableCell>
                                     <TableCell>Supplier</TableCell>
                                     <TableCell align="right">Actual Price</TableCell>
                                     <TableCell align="right">Deviation (%)</TableCell>
                                 </TableRow>
                             </TableHead>
                             <TableBody>
                                {data.priceFluctuations.map((row, index) => (
                                 <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                     <TableCell>{new Date(row.Date).toLocaleDateString()}</TableCell>
                                     <TableCell>{row.Product}</TableCell>
                                     <TableCell>{row.Supplier}</TableCell>
                                     <TableCell align="right">{formatCurrency(row.ActualPrice)}</TableCell>
                                     <TableCell align="right" sx={{ color: row.Deviation > 0 ? 'error.main' : 'success.main' }}>
                                         {row.Deviation.toFixed(2)}%
                                     </TableCell>
                                 </TableRow>
                                ))}
                             </TableBody>
                         </Table>
                     </TableContainer>
                 </CardContent>
             </Card>
         </Grid>

         {/* Anomaly Notes Table (Example) */}
         <Grid item xs={12} md={6}>
             <Card>
                 <CardContent>
                     <Typography variant="h6" gutterBottom>Anomaly Notes</Typography>
                     <TableContainer component={Paper} elevation={0} sx={{ maxHeight: 300 }}>
                         <Table stickyHeader size="small">
                            <TableHead><TableRow><TableCell>Note</TableCell></TableRow></TableHead>
                             <TableBody>
                                {data.anomalyNotes.map((note) => (
                                 <TableRow key={note.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                     <TableCell>{note.text}</TableCell>
                                 </TableRow>
                                ))}
                             </TableBody>
                         </Table>
                     </TableContainer>
                 </CardContent>
             </Card>
         </Grid>
         {/* Add more Grid items for other data sections (Network, Recommendations Table etc.) */}

      </Grid>
    </Container>
  );
}

export default DataDashboard;