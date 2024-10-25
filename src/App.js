// src/App.js
import React, { useState, useCallback } from "react";
import Header from "./components/Header";
import Description from "./components/Description";
import FolderSelector from "./components/FolderSelector";
import FolderStructureSelector from "./components/FolderStructureSelector";
import FileSelector from "./components/FileSelector";
import ResultsDisplay from "./components/ResultsDisplay";
import {
  CssBaseline,
  ThemeProvider,
  Box,
  CircularProgress,
  Alert,
  Typography,
} from "@mui/material";
import theme from "./theme";
import { isTextFile, generateMarkdown } from "./utils/fileProcessor";

const BATCH_SIZE = 50; // Number of files to process in each batch
const BATCH_DELAY = 10; // ms delay between batches

function App() {
  const [initialStructure, setInitialStructure] = useState(null);
  const [folderStructure, setFolderStructure] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [markdown, setMarkdown] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progressStatus, setProgressStatus] = useState("");
  const [currentFile, setCurrentFile] = useState("");
  const [processed, setProcessed] = useState(0);
  const [total, setTotal] = useState(0);

  // Helper function to process items in batches
  const processBatch = async (items, processFn, onProgress) => {
    const results = [];
    let processedCount = 0;

    for (let i = 0; i < items.length; i += BATCH_SIZE) {
      const batch = items.slice(i, i + BATCH_SIZE);
      const batchResults = await Promise.all(batch.map(processFn));
      results.push(...batchResults.filter(Boolean));

      processedCount += batch.length;
      onProgress?.(processedCount, items.length);

      // Add small delay between batches to prevent UI freezing
      await new Promise((resolve) => setTimeout(resolve, BATCH_DELAY));
    }

    return results;
  };

  const getBasicFileEntry = async (entry, parentPath = "") => {
    const currentPath = parentPath ? `${parentPath}/${entry.name}` : entry.name;
    setCurrentFile(entry.name);

    if (entry.kind === "file") {
      // Only return file entries for text files we can process
      if (isTextFile(entry.name)) {
        return {
          kind: "file",
          name: entry.name,
          path: currentPath,
        };
      }
      // Return null for non-text files so they're filtered out
      return null;
    }

    if (entry.kind === "directory") {
      // Skip common large folders in initial scan
      const skipFolders = ["node_modules", ".git", "dist", "build", "coverage"];
      if (skipFolders.includes(entry.name)) {
        return {
          kind: "directory",
          name: entry.name,
          path: currentPath,
          entries: [],
        };
      }

      const entries = [];
      try {
        const childEntries = [];
        for await (const childEntry of entry.values()) {
          childEntries.push(childEntry);
        }

        // Process child entries in batches
        const processedEntries = await processBatch(
          childEntries,
          async (childEntry) => getBasicFileEntry(childEntry, currentPath),
          (processed, total) => {
            setProgressStatus(
              `Scanning ${entry.name}: ${processed}/${total} items...`
            );
          }
        );

        // Only add directories that have processable entries
        const filteredEntries = processedEntries.filter(Boolean);
        if (filteredEntries.length > 0) {
          entries.push(...filteredEntries);
          return {
            kind: "directory",
            name: entry.name,
            path: currentPath,
            entries,
          };
        }
      } catch (error) {
        console.warn(`Skipping inaccessible directory: ${currentPath}`);
      }

      // Return null for empty directories or those with no processable files
      return null;
    }
  };

  const processFileEntry = async (entry, parentPath = "", selectedPaths) => {
    try {
      const currentPath = parentPath
        ? `${parentPath}/${entry.name}`
        : entry.name;
      setCurrentFile(entry.name);

      // Check if this path or any parent path is selected
      const isSelected = selectedPaths.some(
        (path) =>
          currentPath === path ||
          currentPath.startsWith(path + "/") ||
          path.startsWith(currentPath + "/")
      );

      if (!isSelected) {
        return null;
      }

      if (entry.kind === "file") {
        if (isTextFile(entry.name)) {
          try {
            const file = await entry.getFile();
            const content = await file.text();
            setProcessed((prev) => prev + 1);
            return {
              kind: "file",
              name: currentPath,
              content,
            };
          } catch (error) {
            console.error(`Error reading file ${currentPath}:`, error);
            return {
              kind: "file",
              name: currentPath,
            };
          }
        } else {
          return {
            kind: "file",
            name: currentPath,
          };
        }
      }

      if (entry.kind === "directory") {
        console.log("Processing directory:", currentPath);
        const entries = [];
        try {
          const childEntries = [];
          for await (const childEntry of entry.values()) {
            childEntries.push(childEntry);
          }

          const processedEntries = await processBatch(
            childEntries,
            async (childEntry) =>
              processFileEntry(childEntry, currentPath, selectedPaths),
            (processed, total) => {
              setProgressStatus(
                `Processing ${entry.name}: ${processed}/${total} items...`
              );
            }
          );

          entries.push(...processedEntries.filter(Boolean));

          // Include directory even if empty if it's explicitly selected
          if (entries.length > 0 || selectedPaths.includes(currentPath)) {
            return {
              kind: "directory",
              name: currentPath,
              entries: entries,
            };
          }
        } catch (error) {
          console.error(`Error processing directory ${currentPath}:`, error);
          throw error;
        }
      }
    } catch (error) {
      console.error("Error in processFileEntry:", error);
      throw error;
    }
    return null;
  };

  const handleNewScan = useCallback(() => {
    setInitialStructure(null);
    setFolderStructure(null);
    setSelectedFiles([]);
    setMarkdown("");
    setError(null);
    setProgressStatus("");
    setCurrentFile("");
    setProcessed(0);
    setTotal(0);
  }, []);

  const handleSelectFolder = async () => {
    try {
      setLoading(true);
      setError(null);
      setProgressStatus("Initializing folder selection...");
      setProcessed(0);
      setTotal(0);

      const dirHandle = await window.showDirectoryPicker();
      setProgressStatus("Scanning folder structure...");

      const getInitialStructure = async (handle) => {
        const entries = [];
        try {
          const rootEntries = [];
          for await (const entry of handle.values()) {
            rootEntries.push(entry);
          }
          setTotal(rootEntries.length);

          // Process root entries in batches
          const processedEntries = await processBatch(
            rootEntries,
            async (entry) => {
              setProgressStatus(`Scanning root level: ${entry.name}`);
              return await getBasicFileEntry(entry);
            },
            (processed, total) => {
              setProgressStatus(
                `Scanning root folder: ${processed}/${total} items...`
              );
            }
          );

          entries.push(...processedEntries);
        } catch (error) {
          console.error("Error scanning directory:", error);
          throw new Error("Failed to scan directory structure");
        }
        return entries;
      };

      const initialStruct = await getInitialStructure(dirHandle);
      setInitialStructure({ handle: dirHandle, structure: initialStruct });
      setProgressStatus("Scan complete! Please select items to process.");
    } catch (err) {
      console.error("Folder selection failed:", err);
      setError(err.message || "Failed to process folder");
      setProgressStatus("");
    } finally {
      setLoading(false);
    }
  };

  const handleProcessSelected = async (selectedPaths) => {
    try {
      setLoading(true);
      setError(null);
      setProgressStatus("Starting to process selected items...");
      setProcessed(0);

      const processDirectory = async (handle) => {
        const entries = [];
        const rootEntries = [];

        for await (const entry of handle.values()) {
          rootEntries.push(entry);
        }

        setTotal(selectedPaths.length);

        const processedEntries = await processBatch(
          rootEntries,
          async (entry) => processFileEntry(entry, "", selectedPaths),
          (processed, total) => {
            setProgressStatus(
              `Processing selected items: ${processed}/${total}...`
            );
          }
        );

        entries.push(...processedEntries.filter(Boolean));
        return entries;
      };

      const structure = await processDirectory(initialStructure.handle);
      setFolderStructure(structure);

      // Set selected files to be the same as the processed paths
      setSelectedFiles(selectedPaths);

      // Generate markdown immediately
      const generatedMarkdown = generateMarkdown(structure, selectedPaths);
      setMarkdown(generatedMarkdown);

      setInitialStructure(null);
      setProgressStatus("Processing complete!");
    } catch (err) {
      console.error("Processing failed:", err);
      setError(err.message || "Failed to process selected items");
      setProgressStatus("");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFile = useCallback((filename, forcedState) => {
    setSelectedFiles((prev) => {
      if (typeof forcedState === "boolean") {
        if (forcedState) {
          return prev.includes(filename) ? prev : [...prev, filename];
        } else {
          return prev.filter((f) => f !== filename);
        }
      } else {
        return prev.includes(filename)
          ? prev.filter((f) => f !== filename)
          : [...prev, filename];
      }
    });
  }, []);

  const handleGenerateMarkdown = useCallback(() => {
    try {
      setProgressStatus("Generating markdown...");
      const generatedMarkdown = generateMarkdown(
        folderStructure,
        selectedFiles
      );
      setMarkdown(generatedMarkdown);
      setProgressStatus("");
    } catch (err) {
      console.error("Error generating markdown:", err);
      setError("Failed to generate markdown");
    }
  }, [folderStructure, selectedFiles]);

  const handleBack = useCallback(() => {
    setMarkdown("");
    setError(null);
  }, []);

  const handleRetry = useCallback(() => {
    setError(null);
    setLoading(false);
    setInitialStructure(null);
    setFolderStructure(null);
    setSelectedFiles([]);
    setMarkdown("");
    setProgressStatus("");
    setCurrentFile("");
    setProcessed(0);
    setTotal(0);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      <Box
        sx={{
          minHeight: "calc(100vh - 64px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "background.default",
          padding: 2,
          gap: 2,
        }}
      >
        <Description />

        {error && (
          <Alert
            severity="error"
            onClose={handleRetry}
            sx={{ width: "100%", maxWidth: 600 }}
          >
            {error}
          </Alert>
        )}

        {!initialStructure && !folderStructure && !loading && !error && (
          <FolderSelector onSelectFolder={handleSelectFolder} />
        )}

        {initialStructure && !folderStructure && !loading && (
          <FolderStructureSelector
            initialStructure={initialStructure.structure}
            onConfirm={handleProcessSelected}
            onCancel={() => setInitialStructure(null)}
          />
        )}

        {loading && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              textAlign: "center",
              maxWidth: "600px",
            }}
          >
            <CircularProgress />
            <Typography variant="body1">{progressStatus}</Typography>
            {currentFile && (
              <Typography variant="body2" color="text.secondary">
                Current file: {currentFile}
              </Typography>
            )}
            {total > 0 && (
              <Typography variant="body2" color="text.secondary">
                Progress: {processed}/{total} (
                {Math.round((processed / total) * 100)}%)
              </Typography>
            )}
          </Box>
        )}

        {folderStructure && !loading && !markdown && (
          <FileSelector
            folderStructure={folderStructure}
            selectedFiles={selectedFiles}
            onToggleFile={handleToggleFile}
            onProceed={handleGenerateMarkdown}
          />
        )}

        {markdown && !loading && (
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center", 
            }}
          >
            <ResultsDisplay
              markdown={markdown}
              onBack={handleBack}
              onNewScan={handleNewScan}
            />
          </Box>
        )}
      </Box>
    </ThemeProvider>
  );
}

export default App;
