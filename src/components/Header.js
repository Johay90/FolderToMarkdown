// src/components/Header.js
import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';

const Header = () => {
  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        backdropFilter: 'blur(8px)',
        backgroundColor: 'rgba(30,30,30,0.8)',
      }}
    >
      <Toolbar sx={{ justifyContent: 'center' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <CodeIcon 
            sx={{ 
              fontSize: 28,
              color: theme => theme.palette.primary.main 
            }} 
          />
          <Typography 
            variant="h6" 
            component="div"
            sx={{
              fontWeight: 500,
              letterSpacing: '0.05em',
              color: 'rgba(255,255,255,0.95)',
            }}
          >
            FolderToMarkdown
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;