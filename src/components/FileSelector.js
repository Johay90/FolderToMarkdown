// src/components/FileSelector.js
import React from 'react';
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
  Collapse
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import FolderIcon from '@mui/icons-material/Folder';

const FileTreeItem = ({ entry, selectedFiles, onToggleFile, level = 0 }) => {
  const [expanded, setExpanded] = React.useState(true);
  const isDirectory = entry.kind === 'directory';

  const handleToggle = (e) => {
    e.stopPropagation();
    if (isDirectory) {
      setExpanded(!expanded);
    } else {
      onToggleFile(entry.name);
    }
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
        onClick={handleToggle}
      >
        <ListItemIcon sx={{ minWidth: 40 }}>
          {isDirectory ? (
            expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />
          ) : (
            <Checkbox
              edge="start"
              checked={selectedFiles.includes(entry.name)}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => onToggleFile(entry.name)}
            />
          )}
        </ListItemIcon>
        <ListItemIcon sx={{ minWidth: 40 }}>
          {isDirectory ? <FolderIcon /> : <InsertDriveFileIcon />}
        </ListItemIcon>
        <ListItemText 
          primary={entry.name.split('/').pop()} 
          sx={{ 
            '& .MuiTypography-root': { 
              fontSize: '0.9rem',
              color: isDirectory ? 'primary.main' : 'text.primary'
            } 
          }} 
        />
      </ListItem>
      {isDirectory && (
        <Collapse in={expanded}>
          <List disablePadding>
            {entry.entries.map((childEntry, index) => (
              <FileTreeItem
                key={childEntry.name + index}
                entry={childEntry}
                selectedFiles={selectedFiles}
                onToggleFile={onToggleFile}
                level={level + 1}
              />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
};

const FileSelector = ({ folderStructure, selectedFiles, onToggleFile, onProceed }) => {
  const selectAll = () => {
    const getAllFiles = (entries) => {
      return entries.reduce((acc, entry) => {
        if (entry.kind === 'file') {
          acc.push(entry.name);
        } else if (entry.kind === 'directory') {
          acc.push(...getAllFiles(entry.entries));
        }
        return acc;
      }, []);
    };
    const allFiles = getAllFiles(folderStructure);
    allFiles.forEach(file => onToggleFile(file, true));
  };

  const deselectAll = () => {
    const getAllFiles = (entries) => {
      return entries.reduce((acc, entry) => {
        if (entry.kind === 'file') {
          acc.push(entry.name);
        } else if (entry.kind === 'directory') {
          acc.push(...getAllFiles(entry.entries));
        }
        return acc;
      }, []);
    };
    const allFiles = getAllFiles(folderStructure);
    allFiles.forEach(file => onToggleFile(file, false));
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
        <Typography variant="h6">Select Files to Include</Typography>
        <Box>
          <Button onClick={selectAll} sx={{ mr: 1 }}>Select All</Button>
          <Button onClick={deselectAll} sx={{ mr: 1 }}>Deselect All</Button>
          <Button 
            variant="contained" 
            color="primary"
            onClick={onProceed}
            disabled={selectedFiles.length === 0}
          >
            Generate Markdown
          </Button>
        </Box>
      </Box>
      <List disablePadding>
        {folderStructure.map((entry, index) => (
          <FileTreeItem
            key={entry.name + index}
            entry={entry}
            selectedFiles={selectedFiles}
            onToggleFile={onToggleFile}
          />
        ))}
      </List>
    </Paper>
  );
};

export default FileSelector;