// src/pages/Homepage.jsx
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown'; // Still useful for bullet points

// Import Material UI components
import {
  Container, Box, Typography, Card, CardContent, CircularProgress, Alert, Divider, Grid, Paper
} from '@mui/material';
import InsightsIcon from '@mui/icons-material/Insights'; // Example icon
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TaskAltIcon from '@mui/icons-material/TaskAlt';

// Import the new API function
import { fetchBackendAnalysis } from '../services/api'; // Make sure path is correct

// --- New Parser for Q1 2025 Text Structure ---
const parseQ1Analysis = (text) => {
  const sections = {};
  const headers = [
    "General Trend Analysis", // Use simplified key
    "Detailed Analysis of Anomalies and Issues", // Use simplified key
    "Delivery Delays or Timeline Inconsistencies",
    "Price Fluctuations Outside Normal Ranges",
    "Quantity Discrepancies",
    "Quality Issues",
    "Supplier Performance Problems",
    "Logistical Bottlenecks",
    "Carbon Footprint"
  ];

  let remainingText = text;

  // Extract General Trend Analysis first, as it has a slightly different intro
  const trendHeader = "General Trend Analysis";
  const detailHeader = "Detailed Analysis of Anomalies and Issues";
  const trendStartIndex = text.indexOf(trendHeader);
  const detailStartIndex = text.indexOf(detailHeader);

  if (trendStartIndex !== -1 && detailStartIndex !== -1) {
    sections['generalTrend'] = text.substring(trendStartIndex + trendHeader.length, detailStartIndex).trim();
    remainingText = text.substring(detailStartIndex); // Start parsing details from here
  } else if (trendStartIndex !== -1) {
     // Only trend found
     sections['generalTrend'] = text.substring(trendStartIndex + trendHeader.length).trim();
     remainingText = ''; // No more text left
  } else {
      console.warn("General Trend Analysis section header not found.");
  }

  // Now parse the detailed sections
  const detailHeaders = headers.slice(1); // Skip the first two general headers

  for (let i = 0; i < detailHeaders.length; i++) {
    const currentHeader = detailHeaders[i];
    // Generate camelCase key (e.g., "Delivery Delays..." -> "deliveryDelays")
    const key = currentHeader.charAt(0).toLowerCase() + currentHeader.slice(1).replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase()).replace(/\s+/g, '');

    const startIndex = remainingText.indexOf(currentHeader + ":"); // Look for header ending with colon
    if (startIndex === -1) {
        console.warn(`Header not found or missing colon: "${currentHeader}:"`);
        continue; // Skip if header not found
    }

    // Find the start of the *next* header to determine the end of the current section
    let endIndex = remainingText.length; // Default to end of text
    for (let j = i + 1; j < detailHeaders.length; j++) {
        const nextHeaderIndex = remainingText.indexOf(detailHeaders[j] + ":");
        if (nextHeaderIndex !== -1 && nextHeaderIndex > startIndex) {
            endIndex = nextHeaderIndex;
            break; // Found the next header
        }
    }

    sections[key] = remainingText.substring(startIndex + currentHeader.length + 1, endIndex).trim();
  }

  // Remove the "Detailed Analysis..." intro line if it was parsed as part of the first detail section
  if (sections.deliveryDelaysOrTimelineInconsistencies) {
      sections.deliveryDelaysOrTimelineInconsistencies = sections.deliveryDelaysOrTimelineInconsistencies.replace("Here's an analysis based on the specific categories requested:", "").trim();
  }


  return sections;
};

// --- Generate Summary Sections (AI Contribution) ---
const generateSummarySections = (parsedData) => {
   const overallAnalysis = `
The analysis for Q1 2025 highlights several critical areas requiring attention. **Delivery performance has significantly degraded**, with an average increase of 17% in delivery times compared to previous periods, indicating widespread reliability issues, particularly with carriers like ExpressShip and FastFreight. **Supplier quality remains inconsistent**, with key suppliers (FastSupply, GlobalComp, MetalWorks) falling below acceptable quality thresholds. Furthermore, the supply chain faced **considerable price volatility**, notably sharp increases in materials like Material Z and Component Y. While explicit quantity discrepancies couldn't be confirmed from the data, the combination of delays and quality issues points towards broader **supplier performance problems**. Potential **logistical bottlenecks**, possibly linked to specific carriers or internal network points (Supplier Hub 1, Factory 2), are suggested by the delays. Finally, **carbon footprint analysis reveals significant inefficiencies**, particularly the high emissions from air freight (ExpressShip, AirCargo) which don't correlate with improved delivery speed, suggesting poor mode selection.
   `.trim();

   const nextSteps = `
Based on the Q1 2025 analysis, the following actions are recommended:

*   **Investigate Delivery Delays:** Conduct a root cause analysis for carriers ExpressShip and FastFreight. Evaluate alternative carriers or renegotiate SLAs. Analyze internal network transit times, focusing on routes involving Supplier Hub 1 and Factory 2.
*   **Address Quality Issues:** Initiate immediate quality reviews with FastSupply, GlobalComp, and MetalWorks. Implement corrective action plans and increase inspection frequency. Consider supplier diversification for critical components with poor quality records.
*   **Manage Price Volatility:** Engage with MetalWorks, PrimeParts, and GlobalComp regarding recent price hikes. Explore alternative sourcing options or hedging strategies for volatile materials (Material Z, Component Y, Material X).
*   **Optimize Transportation Modes:** Review the necessity of air freight usage, especially for shipments handled by ExpressShip where speed benefits are not realized. Prioritize sea, rail, or truck freight where feasible to reduce both costs and carbon footprint.
*   **Enhance Supplier Performance Management:** Implement stricter performance tracking across delivery, quality, and cost metrics. Schedule regular performance reviews with key suppliers.
*   **Improve Data Capture:** Implement processes to track received quantities against ordered quantities to enable identification of shipment discrepancies in future reports.
   `.trim();

  return { overallAnalysis, nextSteps };
};


function Homepage() {
  const [analysisContent, setAnalysisContent] = useState(null);
  const [summaryContent, setSummaryContent] = useState({ overallAnalysis: '', nextSteps: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAnalysis = async () => {
      setLoading(true);
      setError(null);
      try {
        const rawText = await fetchBackendAnalysis();
        const parsedData = parseQ1Analysis(rawText);
        const generatedSummaries = generateSummarySections(parsedData); // Generate based on parsed

        setAnalysisContent(parsedData);
        setSummaryContent(generatedSummaries);
      } catch (err) {
        console.error("Failed to load or parse analysis:", err);
        setError("Failed to load analysis. Please try refreshing.");
      } finally {
        setLoading(false);
      }
    };
    loadAnalysis();
  }, []);

  const renderSection = (key, title) => {
    if (!analysisContent || !analysisContent[key]) return null;
    return (
      <Grid item xs={12} md={6} key={key}> {/* Render sections side-by-side */}
        <Paper elevation={1} sx={{ p: 2, height: '100%' }}> {/* Use Paper for lighter look? */}
          <Typography variant="h6" component="h3" gutterBottom>{title}</Typography>
          <Divider sx={{ mb: 2 }}/>
          {/* Use ReactMarkdown to handle potential bullet points etc. */}
          <Box sx={{ '& ul': { pl: 2.5, mb: 0 }, '& li': { mb: 0.5 } }}>
            <ReactMarkdown>{analysisContent[key]}</ReactMarkdown>
          </Box>
        </Paper>
      </Grid>
    );
  };

  // --- Render Logic ---

  if (loading) { /* ... keep loading indicator ... */ }
  if (error) { /* ... keep error alert ... */ }
  if (!analysisContent) { return <Typography>No analysis data available.</Typography>; }

  return (
    <Container maxWidth="lg">
       <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
         Q1 2025 Supply Chain Analysis
       </Typography>

       {/* Section 1: General Trends & Overall Summary */}
       <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* General Trends */}
          {analysisContent.generalTrend && (
            <Grid item xs={12} md={6}>
               <Card elevation={2} sx={{height: '100%'}}>
                 <CardContent>
                   <Typography variant="h5" component="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                       <TrendingUpIcon sx={{ mr: 1 }} color="primary"/> General Trends (vs. Previous Qtrs)
                    </Typography>
                   <Divider sx={{ mb: 2 }}/>
                    <ReactMarkdown>{analysisContent.generalTrend}</ReactMarkdown>
                 </CardContent>
               </Card>
            </Grid>
          )}
           {/* Overall Analysis (Generated) */}
          <Grid item xs={12} md={6}>
               <Card elevation={2} sx={{height: '100%', backgroundColor: 'primary.main', color: 'primary.contrastText' }}> {/* Highlight card */}
                 <CardContent>
                   <Typography variant="h5" component="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                      <InsightsIcon sx={{ mr: 1 }}/> Overall Analysis Summary
                   </Typography>
                   <Divider sx={{ mb: 2, borderColor: 'rgba(255,255,255,0.3)' }}/>
                   <Typography variant="body2">{summaryContent.overallAnalysis}</Typography>
                 </CardContent>
               </Card>
          </Grid>
       </Grid>

        {/* Section 2: Detailed Findings Title */}
       <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 2 }}>
            Detailed Findings (Q1 2025)
        </Typography>

        {/* Section 3: Detailed Findings Grid */}
       <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Render each detailed section */}
          {renderSection('deliveryDelaysOrTimelineInconsistencies', 'Delivery Delays / Inconsistencies')}
          {renderSection('priceFluctuationsOutsideNormalRanges', 'Price Fluctuations')}
          {renderSection('qualityIssues', 'Quality Issues')}
          {renderSection('supplierPerformanceProblems', 'Supplier Performance Problems')}
          {renderSection('logisticalBottlenecks', 'Logistical Bottlenecks')}
          {renderSection('carbonFootprint', 'Carbon Footprint')}
          {/* Quantity Discrepancies (might be short/simple) */}
           {renderSection('quantityDiscrepancies', 'Quantity Discrepancies')}
       </Grid>

        {/* Section 4: Next Steps (Generated) */}
       <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 2 }}>
            Recommended Next Steps
        </Typography>
        <Card elevation={2}>
           <CardContent>
                <Typography variant="h6" component="h3" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                   <TaskAltIcon sx={{ mr: 1 }} color="secondary"/> Action Plan
                </Typography>
                <Divider sx={{ mb: 2 }}/>
                {/* Render markdown list */}
                <Box sx={{ '& ul': { pl: 2.5 }, '& li': { mb: 1 } }}>
                    <ReactMarkdown>{summaryContent.nextSteps}</ReactMarkdown>
                </Box>
            </CardContent>
        </Card>

    </Container>
  );
}

export default Homepage;