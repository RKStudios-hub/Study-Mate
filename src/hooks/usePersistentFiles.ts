import { useState, useEffect, useCallback } from 'react';
import { PersistentFileMetadata, File } from '../types';
import { addFileToIndexedDB, getFileFromIndexedDB, deleteFileFromIndexedDB } from '../utils/indexedDB';

const METADATA_KEY = 'persistentFilesMetadata';

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
    default: return 'application/octet-stream';
  }
}

export const usePersistentFiles = () => {
  const [persistentFiles, setPersistentFiles] = useState<PersistentFileMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMetadata = async () => {
      try {
        const value = localStorage.getItem(METADATA_KEY);
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

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(METADATA_KEY, JSON.stringify(persistentFiles));
    }
  }, [persistentFiles, isLoading]);

  const savePersistentFile = useCallback(async (file: globalThis.File, folderId: string): Promise<PersistentFileMetadata> => {
    const fileId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const fileName = file.name;
    const fileExtension = fileName.split('.').pop()?.toLowerCase() || '';
    const fileType = getMimeType(fileName);

    const persistentPath = fileId;
    
    try {
      await addFileToIndexedDB(fileId, file);

      const newMetadata: PersistentFileMetadata = {
        id: fileId,
        name: fileName,
        persistentPath,
        type: fileExtension,
        size: (file.size / 1024).toFixed(2) + ' KB',
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

  const loadPersistentFileDataUrl = useCallback(async (persistentPath: string, fileName: string): Promise<string> => {
    try {
      const blob = await getFileFromIndexedDB(persistentPath);
      if (!blob) {
        throw new Error('File not found');
      }
      const mimeType = getMimeType(fileName);
      return `data:${mimeType};base64,${await blobToBase64(blob)}`;
    } catch (error) {
      console.error('Error loading persistent file:', error);
      throw error;
    }
  }, []);

  const deletePersistentFile = useCallback(async (fileId: string): Promise<void> => {
    try {
      const fileToDelete = persistentFiles.find(f => f.id === fileId);
      if (fileToDelete) {
        await deleteFileFromIndexedDB(fileId);
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

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
