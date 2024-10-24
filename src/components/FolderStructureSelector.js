// src/components/FolderStructureSelector.js
import React, { useState } from 'react';
import { 
  Paper, 
  Typography, 
  Checkbox, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Button,
  Box,
  Collapse,
  CircularProgress
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

const FileTreeItem = ({ entry, selectedPaths, onTogglePath, level = 0 }) => {
  const [expanded, setExpanded] = useState(true);

  const handleToggle = (e) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };

  const handleCheckboxToggle = (e) => {
    e.stopPropagation();
    onTogglePath(entry.path);
  };

  return (
    <>
      <ListItem
        sx={{
          pl: level * 3,
          py: 0.5,
          '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.05)',
          },
        }}
      >
        <ListItemIcon sx={{ minWidth: 40 }}>
          {entry.kind === 'directory' && (
            <Button
              size="small"
              onClick={handleToggle}
              sx={{ minWidth: 'auto', p: 0 }}
            >
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </Button>
          )}
        </ListItemIcon>
        <ListItemIcon sx={{ minWidth: 40 }}>
          <Checkbox
            edge="start"
            checked={selectedPaths.includes(entry.path)}
            onChange={handleCheckboxToggle}
            size="small"
          />
        </ListItemIcon>
        <ListItemIcon sx={{ minWidth: 40 }}>
          {entry.kind === 'directory' ? <FolderIcon /> : <InsertDriveFileIcon />}
        </ListItemIcon>
        <ListItemText 
          primary={entry.name} 
          sx={{ 
            '& .MuiTypography-root': { 
              fontSize: '0.9rem',
              color: entry.kind === 'directory' ? 'primary.main' : 'text.primary'
            } 
          }} 
        />
      </ListItem>
      {entry.kind === 'directory' && entry.entries && (
        <Collapse in={expanded}>
          <List disablePadding>
            {entry.entries.map((childEntry, index) => (
              <FileTreeItem
                key={childEntry.path + index}
                entry={childEntry}
                selectedPaths={selectedPaths}
                onTogglePath={onTogglePath}
                level={level + 1}
              />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
};

const FolderStructureSelector = ({ initialStructure, onConfirm, onCancel }) => {
  const [selectedPaths, setSelectedPaths] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleTogglePath = (path) => {
    setSelectedPaths(prev => {
      const isSelected = prev.includes(path);
      if (isSelected) {
        return prev.filter(p => !p.startsWith(path));
      } else {
        const newPaths = [...prev];
        const addPath = (entry) => {
          if (!newPaths.includes(entry.path)) {
            newPaths.push(entry.path);
          }
          if (entry.kind === 'directory' && entry.entries) {
            entry.entries.forEach(addPath);
          }
        };
        const findAndAddPath = (entries) => {
          for (const entry of entries) {
            if (entry.path === path) {
              addPath(entry);
              break;
            } else if (entry.kind === 'directory' && entry.entries) {
              findAndAddPath(entry.entries);
            }
          }
        };
        findAndAddPath(initialStructure);
        return newPaths;
      }
    });
  };

  const handleSelectAll = () => {
    const getAllPaths = (entries) => {
      const paths = [];
      const addEntry = (entry) => {
        paths.push(entry.path);
        if (entry.kind === 'directory' && entry.entries) {
          entry.entries.forEach(addEntry);
        }
      };
      entries.forEach(addEntry);
      return paths;
    };
    setSelectedPaths(getAllPaths(initialStructure));
  };

  const handleDeselectAll = () => {
    setSelectedPaths([]);
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm(selectedPaths);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      elevation={6}
      sx={{
        width: '100%',
        maxWidth: '800px',
        mt: 4,
        p: 2,
        backgroundColor: 'background.paper',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Select Items to Process</Typography>
        <Box>
          <Button onClick={handleDeselectAll} sx={{ mr: 1 }}>Deselect All</Button>
          <Button onClick={handleSelectAll} sx={{ mr: 1 }}>Select All</Button>
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleConfirm}
            disabled={loading || selectedPaths.length === 0}
          >
            {loading ? <CircularProgress size={24} /> : 'Process Selected'}
          </Button>
        </Box>
      </Box>
      <List disablePadding>
        {initialStructure.map((entry, index) => (
          <FileTreeItem
            key={entry.path + index}
            entry={entry}
            selectedPaths={selectedPaths}
            onTogglePath={handleTogglePath}
          />
        ))}
      </List>
    </Paper>
  );
};

export default FolderStructureSelector;