// src/components/Description.js
import React from 'react';
import { Typography, Container, Box, Paper } from '@mui/material';
import { keyframes } from '@mui/system';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Description = () => {
  return (
    <Container maxWidth="md">
      <Paper
        elevation={6}
        sx={{
          mt: 4,
          mb: 6,
          textAlign: 'center',
          padding: { xs: 3, md: 6 },
          borderRadius: 4,
          backgroundColor: 'background.paper',
          animation: `${fadeIn} 0.6s ease-out`,
          '&:hover': {
            boxShadow: '0 8px 24px rgba(187,134,252,0.12)',
          },
        }}
      >
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom
          sx={{
            background: 'linear-gradient(45deg, #BB86FC 30%, #03DAC6 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 3
          }}
        >
          Organize Your Projects Effortlessly
        </Typography>
        <Typography 
          variant="body1" 
          paragraph
          sx={{
            color: 'rgba(255,255,255,0.87)',
            maxWidth: '800px',
            margin: '0 auto',
          }}
        >
          FolderToMarkdown is a powerful tool that transforms your project's folder structure into a comprehensive Markdown document. Easily visualize and document your codebase for seamless integration with platforms like Obsidian.
        </Typography>
      </Paper>
    </Container>
  );
};

export default Description;