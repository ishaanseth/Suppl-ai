// src/pages/AddDataContext.jsx
import React, { useState, useRef } from 'react';

// Import Material UI components
import {
  Container, Box, Typography, Card, CardContent, Button, TextField, CircularProgress, Alert, Chip
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile'; // Icon for button

// Import API function
import { uploadContextAndQuery } from '../services/api';

function AddDataContext() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Ref for the hidden file input
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    setError(null); // Clear error on new file selection
    setSuccessMessage(null); // Clear previous success
    const file = event.target.files[0];
    if (file) {
      // Basic validation: Check if it's a PDF
      if (file.type !== 'application/pdf') {
        setError('Invalid file type. Please upload a PDF.');
        setSelectedFile(null);
         // Clear the input value so the same invalid file can be detected again if re-selected
        if(fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        return;
      }
      // Optional: Add file size validation here
      // if (file.size > MAX_FILE_SIZE) { ... }

      setSelectedFile(file);
    } else {
      setSelectedFile(null);
    }
  };

  const handleQueryChange = (event) => {
    setQuery(event.target.value);
     if (successMessage) setSuccessMessage(null); // Clear success when typing new query
     if (error) setError(null); // Clear error when typing
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission
    setError(null);
    setSuccessMessage(null);

    // Validation
    if (!selectedFile) {
      setError('Please select a PDF file to upload.');
      return;
    }
    if (!query.trim()) {
      setError('Please enter a query.');
      return;
    }

    setIsLoading(true);

    // Create FormData to send file and text
    const formData = new FormData();
    formData.append('pdfFile', selectedFile); // Key 'pdfFile' - backend needs to expect this
    formData.append('queryText', query);     // Key 'queryText' - backend needs to expect this

    try {
      const result = await uploadContextAndQuery(formData);
      setSuccessMessage(result.message || "Submission successful!");
      // Clear the form on success
      setSelectedFile(null);
      setQuery('');
       if(fileInputRef.current) {
            fileInputRef.current.value = ''; // Reset file input
        }
      // Consider if a forced reload is *really* needed here or if other pages
      // should just refetch data next time they load.
      // For hackathon demo, maybe force reload after short delay:
      // setTimeout(() => window.location.reload(), 2000); // Force reload after 2s (Use with caution!)

    } catch (err) {
      console.error("Upload failed:", err);
      setError(err.message || 'An unexpected error occurred during submission.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="md"> {/* Medium container for a form page */}
      <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
        Add Context and Query
      </Typography>

      <Card elevation={2}>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>

            {/* File Upload Section */}
            <Typography variant="h6" gutterBottom>Upload Context PDF</Typography>
            <input
              type="file"
              accept=".pdf" // Only allow PDF files
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: 'none' }} // Hide the default input
              id="context-pdf-upload"
            />
            <label htmlFor="context-pdf-upload">
              <Button
                variant="outlined"
                component="span" // Makes button act like a label trigger
                startIcon={<UploadFileIcon />}
                sx={{ mb: 1 }}
              >
                Select PDF File
              </Button>
            </label>
            {/* Display selected file name */}
            {selectedFile && (
              <Chip
                label={selectedFile.name}
                onDelete={() => {
                   setSelectedFile(null);
                   if(fileInputRef.current) { fileInputRef.current.value = '';}
                }}
                sx={{ ml: 2, verticalAlign: 'middle' }}
              />
            )}
            <Typography variant="caption" display="block" sx={{ mb: 3 }}>
              Upload a PDF containing tables on: Delivery Performance, Supplier Quality, Carbon Footprint, Price Fluctuation, Inventory Level.
            </Typography>


            {/* Query Input Section */}
            <Typography variant="h6" gutterBottom>Enter Your Query</Typography>
            <TextField
              label="e.g., How was performance in Q1 2024?"
              multiline
              rows={4}
              fullWidth
              value={query}
              onChange={handleQueryChange}
              variant="outlined"
              sx={{ mb: 3 }}
              disabled={isLoading}
            />

             {/* Error Display */}
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
            )}

             {/* Success Display */}
             {successMessage && (
                <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>
             )}

            {/* Submit Button */}
            <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isLoading}
                sx={{ px: 5, py: 1.5 }} // Make button slightly larger
              >
                Submit Context & Query
              </Button>
              {/* Loading Spinner */}
              {isLoading && (
                <CircularProgress
                  size={24}
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    marginTop: '-12px', // Center spinner
                    marginLeft: '-12px', // Center spinner
                  }}
                />
              )}
            </Box>

          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}

export default AddDataContext;