import { useState, useEffect, useCallback } from 'react';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { PersistentFileMetadata, File } from '../types';

const METADATA_KEY = 'persistentFilesMetadata';
const FILES_BASE_DIR = 'uploaded_study_files';

// Utility function to convert File to Base64
async function fileToBase64(file: globalThis.File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]); // Extract Base64 part
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Utility to get MIME type from file extension
function getMimeType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'pdf': return 'application/pdf';
    case 'png': return 'image/png';
    case 'jpg':
    case 'jpeg': return 'image/jpeg';
    case 'mp3': return 'audio/mpeg';
    case 'mp4': return 'video/mp4';
    case 'gif': return 'image/gif';
    case 'webp': return 'image/webp';
    case 'svg': return 'image/svg+xml';
    case 'txt': return 'text/plain';
    case 'html': return 'text/html';
    case 'css': return 'text/css';
    case 'js': return 'application/javascript';
    default: return 'application/octet-stream'; // Generic binary file
  }
}

export const usePersistentFiles = () => {
  const [persistentFiles, setPersistentFiles] = useState<PersistentFileMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load all file metadata from Preferences on mount
  useEffect(() => {
    const loadMetadata = async () => {
      try {
        const { value } = await Preferences.get({ key: METADATA_KEY });
        if (value) {
          setPersistentFiles(JSON.parse(value));
        }
      } catch (error) {
        console.error('Error loading persistent file metadata:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadMetadata();
  }, []);

  // Save metadata to Preferences whenever persistentFiles changes
  useEffect(() => {
    if (!isLoading) {
      Preferences.set({ key: METADATA_KEY, value: JSON.stringify(persistentFiles) });
    }
  }, [persistentFiles, isLoading]);

  // Save a new file to Capacitor Filesystem and update metadata
  const savePersistentFile = useCallback(async (file: globalThis.File, folderId: string): Promise<PersistentFileMetadata> => {
    const fileId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const fileName = file.name;
    const fileExtension = fileName.split('.').pop()?.toLowerCase() || '';
    const fileType = getMimeType(fileName); // Determine MIME type

    // Ensure the base directory exists
    await Filesystem.mkdir({
      path: FILES_BASE_DIR,
      directory: Directory.Data,
      recursive: true,
    }).catch(e => {
      // Ignore if directory already exists, specifically checking for the exact error message
      if (e.message !== 'Current directory does already exist.' && e.message !== 'Path exists' && e.message !== `directory at '${FILES_BASE_DIR}' already exists, cannot be overwritten`) {
        console.error('Error creating base directory:', e);
        throw e;
      }
    });

    const persistentPath = `${FILES_BASE_DIR}/${fileId}_${fileName}`;
    
    try {
      const base64Data = await fileToBase64(file);
      await Filesystem.writeFile({
        path: persistentPath,
        data: base64Data,
                  directory: Directory.Data,
                  encoding: Encoding.Base64,      });

      const newMetadata: PersistentFileMetadata = {
        id: fileId,
        name: fileName,
        persistentPath,
        type: fileExtension, // Store extension as type, mime type will be derived on display
        size: (file.size / 1024).toFixed(2) + ' KB', // Basic size formatting
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        folderId,
      };

      setPersistentFiles(prev => [...prev, newMetadata]);
      return newMetadata;
    } catch (error) {
      console.error('Error saving persistent file:', error);
      throw error;
    }
  }, []);

  // Load a file's content and return a data URL for display
  const loadPersistentFileDataUrl = useCallback(async (persistentPath: string, fileName: string): Promise<string> => {
    try {
      const result = await Filesystem.readFile({
        path: persistentPath,
        directory: Directory.Data,
        encoding: Encoding.Base64,
      });

      const mimeType = getMimeType(fileName);
      return `data:${mimeType};base64,${result.data}`;
    } catch (error) {
      console.error('Error loading persistent file:', error);
      throw error;
    }
  }, []);

  // Delete a file from Capacitor Filesystem and update metadata
  const deletePersistentFile = useCallback(async (fileId: string): Promise<void> => {
    try {
      const fileToDelete = persistentFiles.find(f => f.id === fileId);
      if (fileToDelete) {
        await Filesystem.deleteFile({
          path: fileToDelete.persistentPath,
          directory: Directory.Data,
        });
        setPersistentFiles(prev => prev.filter(f => f.id !== fileId));
      }
    } catch (error) {
      console.error('Error deleting persistent file:', error);
      throw error;
    }
  }, [persistentFiles]);

  return {
    persistentFiles,
    isLoading,
    savePersistentFile,
    loadPersistentFileDataUrl,
    deletePersistentFile,
  };
};