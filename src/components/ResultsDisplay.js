// src/components/ResultsDisplay.js
import React from 'react';
import { Box, Button, Stack } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadIcon from '@mui/icons-material/Download';
import FolderIcon from '@mui/icons-material/Folder';

const ResultsDisplay = ({ markdown, onBack, onNewScan }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(markdown);
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
    <Box 
      sx={{ 
        width: '100%', 
        maxWidth: '1200px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center' // Center align all content
      }}
    >
      <Stack 
        direction="row" 
        spacing={2} 
        sx={{ 
          mb: 2,
          justifyContent: 'center' // Center align the buttons
        }}
      >
        <Button
          variant="contained"
          color="primary"
          startIcon={<FolderIcon />}
          onClick={onNewScan}
        >
          Scan New Folder
        </Button>
        <Button
          variant="outlined"
          startIcon={<ContentCopyIcon />}
          onClick={handleCopy}
        >
          Copy to Clipboard
        </Button>
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={handleDownload}
        >
          Download
        </Button>
      </Stack>
      <Box
        sx={{
          backgroundColor: 'background.paper',
          borderRadius: 1,
          p: 2,
          maxHeight: '70vh',
          overflow: 'auto',
          width: '100%' // Ensure full width for content
        }}
      >
        <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          {markdown}
        </pre>
      </Box>
    </Box>
  );
};

export default ResultsDisplay;