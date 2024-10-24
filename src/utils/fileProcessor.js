// src/utils/fileProcessor.js
export const isTextFile = (filename) => {
    const textExtensions = [
      '.txt', '.js', '.jsx', '.ts', '.tsx', '.html', '.css', '.scss', '.json', 
      '.md', '.markdown', '.py', '.java', '.c', '.cpp', '.h', '.hpp', '.cs', 
      '.php', '.rb', '.swift', '.kt', '.go', '.rs', '.sh', '.bash', '.yml', 
      '.yaml', '.toml', '.ini', '.conf', '.xml', '.svg', '.vue', '.jsx', '.env',
      '.gitignore', '.dockerignore', 'Dockerfile', '.sql', '.prisma', '.graphql',
      '.sol', '.R', '.m', '.mm', '.scala', '.clj', '.erl', '.ex', '.exs'
    ];
    
    const ext = '.' + filename.split('.').pop().toLowerCase();
    return textExtensions.includes(ext) || !filename.includes('.');
  };
  
  export const generateMarkdown = (folderStructure, selectedFiles) => {
    let markdown = '# Project Structure\n\n';
    const processedFiles = new Set(); // Keep track of processed files
    
    const getDirectParentPath = (filePath) => {
      const parts = filePath.split('/');
      return parts.length > 1 ? parts.slice(0, -1).join('/') : '';
    };
  
    const processStructure = (entries, currentPath = '') => {
      // Group entries by directories and files
      const directories = entries
        .filter(entry => entry.kind === 'directory')
        .sort((a, b) => a.name.localeCompare(b.name));
        
      const files = entries
        .filter(entry => 
          entry.kind === 'file' && 
          selectedFiles.includes(entry.name) &&
          !processedFiles.has(entry.name) && // Check if file hasn't been processed
          getDirectParentPath(entry.name) === currentPath
        )
        .sort((a, b) => a.name.localeCompare(b.name));
  
      // Process directories first
      directories.forEach(dir => {
        const dirName = dir.name.split('/').pop();
        markdown += `## 📁 ${dirName}\n\n`;
  
        // Process files in this directory
        if (dir.entries) {
          const dirFiles = dir.entries.filter(entry => 
            entry.kind === 'file' && 
            selectedFiles.includes(entry.name) &&
            !processedFiles.has(entry.name) && // Check if file hasn't been processed
            getDirectParentPath(entry.name) === dir.name
          );
  
          dirFiles.sort((a, b) => a.name.localeCompare(b.name))
            .forEach(file => {
              processFile(file);
              processedFiles.add(file.name); // Mark file as processed
            });
  
          // Then process subdirectories
          processStructure(dir.entries, dir.name);
        }
      });
  
      // Process files at current level
      files.forEach(file => {
        processFile(file);
        processedFiles.add(file.name); // Mark file as processed
      });
    };
  
    const processFile = (file) => {
      const displayName = file.name.split('/').pop();
      const isMarkdown = displayName.toLowerCase().endsWith('.md');
  
      markdown += `### File: \`${displayName}\`\n\n`;
  
      if (file.content !== undefined) {
        if (isMarkdown) {
          markdown += `> [!note]- View content\n`;
          const contentLines = file.content
            .split('\n')
            .map(line => `> ${line}`)
            .join('\n');
          markdown += `${contentLines}\n\n`;
        } else {
          markdown += `\`\`\`${getFileExtension(displayName)}\n`;
          markdown += file.content;
          if (!file.content.endsWith('\n')) markdown += '\n';
          markdown += `\`\`\`\n\n`;
        }
      } else {
        markdown += `*Binary or unreadable file*\n\n`;
      }
    };
  
    processStructure(folderStructure);
    return markdown;
  };
  
  const getFileExtension = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    const extensionMap = {
      'js': 'javascript',
      'jsx': 'javascript',
      'ts': 'typescript',
      'tsx': 'typescript',
      'py': 'python',
      'rb': 'ruby',
      'php': 'php',
      'java': 'java',
      'cpp': 'cpp',
      'c': 'c',
      'cs': 'csharp',
      'go': 'go',
      'rs': 'rust',
      'swift': 'swift',
      'kt': 'kotlin',
      'r': 'r',
      'scala': 'scala',
      'sh': 'bash',
      'yml': 'yaml',
      'yaml': 'yaml',
      'json': 'json',
      'md': 'markdown',
      'sql': 'sql',
      'html': 'html',
      'css': 'css',
      'scss': 'scss',
      'xml': 'xml',
      'graphql': 'graphql',
      'sol': 'solidity'
    };
    
    return extensionMap[ext] || 'plaintext';
  };