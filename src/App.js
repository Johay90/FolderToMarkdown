// src/App.js

import React from 'react';
import Header from './components/Header';
import Description from './components/Description';
import FolderSelector from './components/FolderSelector';
import { CssBaseline, ThemeProvider, Box } from '@mui/material';
import theme from './theme';

function App() {
  const handleSelectFolder = async () => {
    try {
      const dirHandle = await window.showDirectoryPicker();
      console.log('Selected directory:', dirHandle);
      // Future implementation: Process the selected folder
    } catch (err) {
      console.error('Folder selection cancelled or failed:', err);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      <Box
        sx={{
          minHeight: 'calc(100vh - 64px)', // Adjust for AppBar height
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'background.default',
          padding: 2,
        }}
      >
        <Description />
        <FolderSelector onSelectFolder={handleSelectFolder} />
      </Box>
    </ThemeProvider>
  );
}

export default App;
