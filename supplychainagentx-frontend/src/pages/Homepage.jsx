// src/pages/Homepage.jsx
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown'; // Import the markdown renderer

// Import Material UI components
import {
  Container, Box, Typography, Card, CardContent, CircularProgress, Alert, Divider, Grid
} from '@mui/material';

// Mock API function (replace with actual fetch later)
const fetchBackendAnalysis = async () => {
  console.log("API Call: Fetching backend analysis text...");
  await new Promise(resolve => setTimeout(resolve, 800)); // Simulate delay

  // --- PASTE YOUR EXAMPLE BACKEND OUTPUT HERE ---
  const mockAnalysisOutput = `## Analysis of Supply Chain Issues:

Based on the provided information, we can identify the following potential issues:

**1. Quality Issues:**

*   **Product Design Flaw:** The new bottle design has been identified as a major issue. The new bottles cause less ketchup to come out per squeeze, which is a significant inconvenience for customers. This indicates a flaw in the product design and a lack of proper testing before implementation.

**2. Supplier Performance Problems:**

*   **Bottling Process Modification:** The FMCG company modified their bottle manufacturing process. While the specific details of the modification are not provided, it is implied that the change negatively impacted the product functionality. This suggests a potential problem with the supplier's execution or the company's internal oversight of the process.

**3. Customer Dissatisfaction:**

*   **Negative Customer Feedback:** The information implies that customers did not like the new bottle design. This indicates a lack of customer satisfaction and potentially negative word-of-mouth marketing.

**4. Potential Logistical Bottlenecks (Indirect):**

*   **Reduced Product Efficiency:** The reduced ketchup output per squeeze could potentially lead to slower product usage and increased consumer dissatisfaction. This might indirectly impact the company's logistics due to potential return requests, product replacements, or reduced sales volumes.

**Analysis:**

The primary issue appears to be a flawed bottle design. This flaw directly impacted product functionality and negatively affected customer satisfaction, leading to a decline in sales and profits. The information suggests a possible lack of thorough product testing before implementing the new bottle design. Additionally, there might be supplier performance issues associated with the implementation of the bottling process modification.

**Solution:**

The company needs to address the bottle design flaw as the primary solution. This could involve:

1.  **Re-designing the bottle:** They should prioritize a bottle design that offers ease of use and consistent ketchup output. This requires extensive testing and consumer feedback to ensure a successful redesign.
2.  **Reviewing the bottling process:** The company should review the modifications made to the bottling process and work with their supplier to ensure they meet quality standards and customer expectations.
3.  **Addressing customer concerns:** The company needs to actively address customer concerns regarding the new bottle design. This can be done through transparent communication, offering refunds or replacements, and actively seeking customer feedback for future improvements.
4.  **Implementing a robust product testing process:** The company should implement a rigorous product testing process before introducing any new design or process changes. This will help avoid similar issues in the future.

**Note:**

The provided information is limited, and a deeper analysis would require more information about the bottle design, the changes implemented in the manufacturing process, and the specific feedback received from customers.`;
  // ---------------------------------------------

  console.log("API Call: Received analysis text.");
  return mockAnalysisOutput;
};

// Simple function to split text into sections (can be improved)
const parseAnalysisText = (text) => {
  const sections = {
    introduction: '',
    identifiedIssues: '',
    analysis: '',
    solution: '',
    note: '',
  };

  // Split logic (adjust markers as needed based on actual consistent output)
  const analysisMarker = "\n**Analysis:**\n";
  const solutionMarker = "\n**Solution:**\n";
  const noteMarker = "\n**Note:**\n"; // Assuming "Note:" is always preceded by **

  const noteIndex = text.indexOf(noteMarker);
  const solutionIndex = text.indexOf(solutionMarker);
  const analysisIndex = text.indexOf(analysisMarker);

  // Extract sections based on markers
  if (noteIndex !== -1) {
    sections.note = text.substring(noteIndex + noteMarker.length).trim();
    text = text.substring(0, noteIndex); // Remove note part from text
  }
  if (solutionIndex !== -1) {
    sections.solution = text.substring(solutionIndex + solutionMarker.length).trim();
     text = text.substring(0, solutionIndex); // Remove solution part
  }
   if (analysisIndex !== -1) {
    sections.analysis = text.substring(analysisIndex + analysisMarker.length).trim();
     text = text.substring(0, analysisIndex); // Remove analysis part
  }

  // The remaining text is introduction + identified issues
  const introEndMarker = "\nBased on the provided information"; // Find end of intro roughly
  const introEndIndex = text.indexOf(introEndMarker);
  if (introEndIndex !== -1) {
       const issuesStartIndex = text.indexOf("\n**1."); // Find start of numbered issues
       if (issuesStartIndex !== -1) {
           sections.introduction = text.substring(0, issuesStartIndex).replace("## Analysis of Supply Chain Issues:", "").trim();
           sections.identifiedIssues = text.substring(issuesStartIndex).trim();
       } else {
            // Fallback if numbered list isn't found after intro marker
           sections.identifiedIssues = text.replace("## Analysis of Supply Chain Issues:", "").trim();
       }
  } else {
       // Fallback if intro marker not found
       sections.identifiedIssues = text.replace("## Analysis of Supply Chain Issues:", "").trim();
  }


  return sections;
}


function Homepage() {
  const [analysisSections, setAnalysisSections] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAnalysis = async () => {
      setLoading(true);
      setError(null);
      try {
        const rawText = await fetchBackendAnalysis();
        const parsedData = parseAnalysisText(rawText);
        setAnalysisSections(parsedData);
      } catch (err) {
        console.error("Failed to load backend analysis:", err);
        setError("Failed to load analysis. Please try refreshing.");
      } finally {
        setLoading(false);
      }
    };
    loadAnalysis();
  }, []);

  // --- Render Logic ---

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading Analysis...</Typography>
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>;
  }

  if (!analysisSections) {
      return <Typography>No analysis data available.</Typography>; // Should not happen if loading/error handled
  }

  return (
    <Container maxWidth="lg"> {/* Use a slightly narrower container if preferred */}
       <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
         Supply Chain Issue Analysis
       </Typography>

       <Grid container spacing={3}>

        {/* Identified Issues Section */}
        <Grid item xs={12}>
          <Card elevation={2}>
             <CardContent>
               <Typography variant="h6" component="h2" gutterBottom>Identified Potential Issues</Typography>
               <Divider sx={{ mb: 2 }}/>
               {/* Render markdown content for this section */}
               <Box sx={{ '& h3': { mt: 2, mb: 1, fontSize: '1.1rem' }, '& li': { mb: 0.5 } }}>
                 <ReactMarkdown>{analysisSections.identifiedIssues}</ReactMarkdown>
               </Box>
             </CardContent>
          </Card>
        </Grid>

         {/* Analysis Section */}
         <Grid item xs={12} md={6}>
            <Card elevation={2}>
              <CardContent>
                 <Typography variant="h6" component="h2" gutterBottom>Overall Analysis</Typography>
                 <Divider sx={{ mb: 2 }}/>
                 <ReactMarkdown>{analysisSections.analysis}</ReactMarkdown>
              </CardContent>
            </Card>
         </Grid>

          {/* Solution Section */}
         <Grid item xs={12} md={6}>
             <Card elevation={2}>
               <CardContent>
                 <Typography variant="h6" component="h2" gutterBottom>Proposed Solution / Next Steps</Typography>
                  <Divider sx={{ mb: 2 }}/>
                  {/* Add styling specifically for ordered lists if needed */}
                  <Box sx={{ '& ol': { pl: 2.5 }, '& li': { mb: 0.5 } }}>
                     <ReactMarkdown>{analysisSections.solution}</ReactMarkdown>
                  </Box>
               </CardContent>
             </Card>
          </Grid>

           {/* Note Section (Optional) */}
          {analysisSections.note && (
             <Grid item xs={12}>
                 <Alert severity="info" variant="outlined">
                    <Typography variant="h6" component="h3" sx={{ fontSize: '1rem', mb: 1 }}>Note</Typography>
                    <ReactMarkdown>{analysisSections.note}</ReactMarkdown>
                 </Alert>
              </Grid>
          )}

       </Grid>
    </Container>
  );
}

export default Homepage;