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
  
  export const generateMarkdown = (folderStructure) => {
    let markdown = '# Project Structure\n\n';
    
    const processEntry = (entry, path = '') => {
      const currentPath = path ? `${path}/${entry.name}` : entry.name;
      
      if (entry.kind === 'file') {
        markdown += `## File: \`${currentPath}\`\n\n`;
        
        if (entry.content !== undefined) {
          markdown += "```" + getFileExtension(entry.name) + "\n";
          markdown += entry.content;
          markdown += "\n```\n\n";
        } else {
          markdown += "*Binary or unreadable file*\n\n";
        }
      }
    };
    
    for (const entry of folderStructure) {
      processEntry(entry);
    }
    
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