// src/components/FolderSelector.js
import React from 'react';
import { Button, Container, Box, Paper } from '@mui/material';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';

const FolderSelector = ({ onSelectFolder }) => {
  const handleClick = async () => {
    if (onSelectFolder) {
      await onSelectFolder();
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper
        elevation={0}
        sx={{
          mt: 2,
          textAlign: 'center',
          backgroundColor: 'transparent',
        }}
      >
        <Button
          variant="contained"
          color="secondary"
          startIcon={<FolderOpenIcon />}
          onClick={handleClick}
          size="large"
          sx={{
            padding: '16px 32px',
            fontSize: '1.1rem',
            fontWeight: 500,
            minWidth: '240px',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 24px rgba(3,218,198,0.2)',
            },
          }}
        >
          SELECT FOLDER
        </Button>
      </Paper>
    </Container>
  );
};

export default FolderSelector;