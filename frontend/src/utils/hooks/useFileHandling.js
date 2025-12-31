import { useState } from 'react';
import { compressImage } from '../imageCompression';

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export function useFileHandling() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [fileError, setFileError] = useState("");

  const handleFileSelect = async (e, fileInputRef) => {
    setFileError("");
    const files = Array.from(e.target.files || e.dataTransfer.files);
    if (files.length === 0) return;
    
    const processedFiles = [];
    for (const file of files) {
      if (file.size <= MAX_FILE_SIZE) {
        processedFiles.push(file);
        continue;
      }
      
      if (file.type.startsWith('image/')) {
        try {
          const compressed = await compressImage(file);
          if (compressed.size <= MAX_FILE_SIZE) {
            processedFiles.push(compressed);
          } else {
            setFileError(`Image "${file.name}" is too large even after compression (max 10MB).`);
          }
        } catch {
          setFileError(`Failed to compress image "${file.name}" or it is too large.`);
        }
      } else {
        setFileError(`File "${file.name}" is too large (max 10MB).`);
      }
    }
    
    if (processedFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...processedFiles]);
    }
    
    if (fileInputRef && fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragOver(false);
    await handleFileSelect(e);
  };

  const clearFiles = () => {
    setSelectedFiles([]);
  };

  return {
    selectedFiles,
    setSelectedFiles,
    isDragOver,
    fileError,
    handleFileSelect,
    removeFile,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    clearFiles
  };
}
