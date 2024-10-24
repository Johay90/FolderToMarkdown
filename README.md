# FolderToMarkdown

FolderToMarkdown is a powerful tool that transforms your project's folder structure into a comprehensive Markdown document. It allows you to easily visualize and document your codebase for seamless integration with platforms like Obsidian.

## Features

- **Folder Structure Visualization**: Automatically generates a Markdown representation of your project's folder structure, including files and subdirectories.
- **Text File Preview**: Displays the contents of text-based files (e.g., .js, .md, .py) inline within the Markdown document.
- **Selective Processing**: Allows you to choose which files and folders to include in the generated Markdown document.
- **Markdown Generation**: Produces a well-formatted Markdown file that can be easily shared, stored, or imported into other applications.
- **Responsive and Modern UI**: Utilizes Material-UI components to provide a clean, intuitive, and visually appealing user interface.

## Getting Started

1. **Select Folder**: Click the "SELECT FOLDER" button to choose the directory you want to document.
2. **Select Items**: In the folder structure view, select the files and directories you want to include in the Markdown document.
3. **Generate Markdown**: Click the "Generate Markdown" button to create the Markdown file.
4. **Preview and Export**: Review the generated Markdown content and use the copy or download buttons to save the file.

## Running the Project

To run the FolderToMarkdown application, follow these steps:

1. **Install Dependencies**: Make sure you have Node.js and npm installed on your system. Then, navigate to the project directory in your terminal and run `npm install` to install all the required dependencies.
2. **Start the Development Server**: After the installation is complete, run `npm start` to start the development server. This will compile the React application and launch it in your default web browser.
3. **Select a Folder**: Click the "SELECT FOLDER" button to choose the directory you want to document. The application will scan the folder structure and display it in the UI.
4. **Select Files and Folders**: In the folder structure view, select the files and directories you want to include in the Markdown document.
5. **Generate Markdown**: Click the "Generate Markdown" button to create the Markdown file. The generated content will be displayed in the preview area.
6. **Preview and Export**: Review the generated Markdown content and use the copy or download buttons to save the file to your local machine.

Make sure you have the necessary permissions to access the folder you want to document. If you encounter any issues or have questions, feel free to open an issue on the project's GitHub repository.

## Development

This project was built using React, Material-UI, and various utility functions. The main components and their responsibilities are:

- `App`: The main application component that manages the state and flow of the application.
- `Description`: Provides a brief description and introduction to the tool.
- `FolderSelector`: Allows the user to select a folder to document.
- `FolderStructureSelector`: Displays the folder structure and enables the user to select files and folders.
- `FileSelector`: Manages the selection of files to be included in the Markdown document.
- `ResultsDisplay`: Renders the generated Markdown content and provides copy/download functionality.
- `fileProcessor.js`: Contains utility functions for processing the folder structure and generating the Markdown output.

The project uses a custom Material-UI theme with a dark mode color scheme and various style overrides.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please feel free to open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).