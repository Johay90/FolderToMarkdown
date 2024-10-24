// src/components/ResultsDisplay.js
import React from 'react';
import { 
  Paper, 
  Typography, 
  Button, 
  Box, 
  IconButton, 
  Snackbar 
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadIcon from '@mui/icons-material/Download';

const ResultsDisplay = ({ markdown }) => {
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(markdown);
    setSnackbarOpen(true);
  };

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'project-structure.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '1200px', margin: '0 auto', mt: 4 }}>
      <Paper
        elevation={6}
        sx={{
          p: 3,
          borderRadius: 2,
          backgroundColor: 'background.paper',
          position: 'relative',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Typography variant="h6" component="h2">
            Generated Markdown
          </Typography>
          <Box>
            <IconButton 
              onClick={handleCopy} 
              color="primary"
              sx={{ mr: 1 }}
            >
              <ContentCopyIcon />
            </IconButton>
            <IconButton 
              onClick={handleDownload} 
              color="secondary"
            >
              <DownloadIcon />
            </IconButton>
          </Box>
        </Box>
        
        <Paper
          elevation={0}
          sx={{
            p: 2,
            backgroundColor: 'rgba(0,0,0,0.2)',
            borderRadius: 1,
            maxHeight: '600px',
            overflow: 'auto',
          }}
        >
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {markdown}
          </pre>
        </Paper>
      </Paper>
      
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        message="Copied to clipboard"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
};

export default ResultsDisplay;