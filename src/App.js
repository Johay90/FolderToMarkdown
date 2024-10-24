// src/App.js
import React, { useState } from 'react';
import Header from './components/Header';
import Description from './components/Description';
import FolderSelector from './components/FolderSelector';
import ResultsDisplay from './components/ResultsDisplay';
import { CssBaseline, ThemeProvider, Box, CircularProgress } from '@mui/material';
import theme from './theme';
import { isTextFile, generateMarkdown } from './utils/fileProcessor';

function App() {
  const [markdown, setMarkdown] = useState('');
  const [loading, setLoading] = useState(false);

  const processFileEntry = async (entry, path = '') => {
    const currentPath = path ? `${path}/${entry.name}` : entry.name;
    
    if (entry.kind === 'file') {
      if (isTextFile(entry.name)) {
        try {
          const file = await entry.getFile();
          const content = await file.text();
          return {
            kind: 'file',
            name: currentPath,
            content
          };
        } catch (error) {
          console.error(`Error reading file ${currentPath}:`, error);
          return {
            kind: 'file',
            name: currentPath
          };
        }
      } else {
        return {
          kind: 'file',
          name: currentPath
        };
      }
    }
    
    // For directories
    if (entry.kind === 'directory') {
      const dirReader = entry.entries();
      const entries = [];
      for await (const childEntry of dirReader) {
        const processedEntry = await processFileEntry(childEntry, currentPath);
        if (processedEntry) {
          entries.push(processedEntry);
        }
      }
      return {
        kind: 'directory',
        name: currentPath,
        entries
      };
    }
  };

  const handleSelectFolder = async () => {
    try {
      setLoading(true);
      const dirHandle = await window.showDirectoryPicker();
      
      const processDirectory = async (handle, path = '') => {
        const entries = [];
        for await (const entry of handle.values()) {
          const processedEntry = await processFileEntry(entry, path);
          if (processedEntry) {
            entries.push(processedEntry);
          }
        }
        return entries;
      };

      const folderStructure = await processDirectory(dirHandle);
      const generatedMarkdown = generateMarkdown(folderStructure);
      setMarkdown(generatedMarkdown);
    } catch (err) {
      console.error('Folder selection cancelled or failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      <Box
        sx={{
          minHeight: 'calc(100vh - 64px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: 'background.default',
          padding: 2,
        }}
      >
        <Description />
        <FolderSelector onSelectFolder={handleSelectFolder} />
        
        {loading && (
          <Box sx={{ mt: 4 }}>
            <CircularProgress />
          </Box>
        )}
        
        {markdown && !loading && (
          <ResultsDisplay markdown={markdown} />
        )}
      </Box>
    </ThemeProvider>
  );
}

export default App;