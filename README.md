# FolderToMarkdown
FolderToMarkdown is a powerful desktop application that transforms your project's folder structure into a comprehensive Markdown document. It allows you to easily visualize and document your codebase for seamless integration with platforms like Obsidian.

## Features
- **Folder Structure Visualization**: Automatically generates a Markdown representation of your project's folder structure, including files and subdirectories.
- **Text File Preview**: Displays the contents of text-based files (e.g., .js, .md, .py) inline within the Markdown document.
- **Selective Processing**: Allows you to choose which files and folders to include in the generated Markdown document.
- **Markdown Generation**: Produces a well-formatted Markdown file that can be easily shared, stored, or imported into other applications.
- **Modern Desktop Interface**: Built with Electron and Material-UI for a native desktop experience with a clean, intuitive interface.

## Installation
1. Go to the [Releases](https://github.com/Johay90/FolderToMarkdown/releases) page
2. Download the latest `FolderToMarkdown-Setup-x.x.x.exe`
3. Run the installer
4. Launch FolderToMarkdown from your Start Menu

## Using the Application
1. **Select Folder**: Click the "SELECT FOLDER" button to choose the directory you want to document.
2. **Select Items**: In the folder structure view, select the files and directories you want to include in the Markdown document.
3. **Generate Markdown**: Click the "Generate Markdown" button to create the Markdown file.
4. **Preview and Export**: Review the generated Markdown content and use the copy or download buttons to save the file.

## Development
This project is built using Electron, React, and Material-UI. To set up the development environment:

1. Clone the repository:
```bash
git clone https://github.com/Johay90/FolderToMarkdown.git
cd FolderToMarkdown
```

2. Install dependencies:
```bash
npm install
```

3. Start the development environment:
```bash
# Start React development server
npm start

# In a separate terminal, start Electron
npm run electron
```

4. Build the application:
```bash
# Build React
npm run build

# Build Electron executable
npm run dist
```

### Project Structure
- `main.js`: Electron main process
- `src/`: React application source
  - `components/`: React components
  - `utils/`: Utility functions including file processing
  - `theme.js`: Material-UI theme configuration

### Automated Releases
The project uses GitHub Actions for automated builds and releases. When a new version tag (e.g., v1.0.0) is pushed, it automatically:
1. Builds the application
2. Creates a new GitHub release
3. Uploads the Windows installer
4. Generates release notes

## Contributing
Contributions are welcome! If you find any issues or have suggestions for improvements, please feel free to:
1. Open an issue
2. Submit a pull request
3. Suggest new features

## Building from Source
If you want to build the application yourself:
1. Clone the repository
2. Install dependencies: `npm install`
3. Build React: `npm run build`
4. Build Electron: `npm run dist`
5. Find the installer in the `dist` folder

## License
This project is licensed under the [MIT License](LICENSE).