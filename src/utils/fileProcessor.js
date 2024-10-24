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
    
    const processStructure = (entries, level = 0) => {
      // First process directories
      entries
        .filter(entry => entry.kind === 'directory')
        .sort((a, b) => a.name.localeCompare(b.name))
        .forEach(entry => {
          const indentation = '  '.repeat(level);
          markdown += `${indentation}## 📁 ${entry.name}\n\n`;
          processStructure(entry.entries, level + 1);
        });
  
      // Then process files
      entries
        .filter(entry => entry.kind === 'file' && selectedFiles.includes(entry.name))
        .sort((a, b) => a.name.localeCompare(b.name))
        .forEach(entry => {
          const indentation = '  '.repeat(level);
          const displayName = entry.name.split('/').pop();
          const isMarkdown = displayName.toLowerCase().endsWith('.md');
  
          markdown += `${indentation}### File: \`${displayName}\`\n\n`;
  
          if (entry.content !== undefined) {
            if (isMarkdown) {
              markdown += `${indentation}> [!note]- View content\n`;
              // Indent the content to make it part of the callout
              const indentedContent = entry.content
                .split('\n')
                .map(line => `${indentation}> ${line}`)
                .join('\n');
              markdown += `${indentedContent}\n\n`;
            } else {
              markdown += `${indentation}\`\`\`${getFileExtension(displayName)}\n`;
              markdown += entry.content;
              markdown += `\n${indentation}\`\`\`\n\n`;
            }
          } else {
            markdown += `${indentation}*Binary or unreadable file*\n\n`;
          }
        });
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