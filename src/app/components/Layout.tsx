import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Library, BarChart3, Settings as SettingsIcon } from 'lucide-react';
import { BottomNav } from './BottomNav';
import { Sidebar } from './Sidebar';
import { FileViewerModal } from './FileViewerModal';
import { File, Folder, OutletContext, RssFeed, PersistentFileMetadata } from '../../types';
import { usePersistentFiles } from '../../hooks/usePersistentFiles'; // Import the new hook

const Layout: React.FC = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize persistent file management
  const {
    persistentFiles,
    isLoading: isPersistentFilesLoading,
    savePersistentFile,
    loadPersistentFileDataUrl,
    deletePersistentFile,
  } = usePersistentFiles();

  const [timeStudied, setTimeStudied] = useState<number>(() => {
    const savedTime = localStorage.getItem('timeStudied');
    return savedTime ? parseInt(savedTime, 10) : 0;
  });
  const [isRunning, setIsRunning] = useState(false);

  // Folders state will now be derived from persistentFiles
  const [folders, setFolders] = useState<Folder[]>(() => {
    // Initial state will be empty or loaded from localStorage,
    // but actual files will come from persistentFiles after they load.
    const savedFolders = localStorage.getItem('folders');
    if (savedFolders) {
      const parsedFolders: Folder[] = JSON.parse(savedFolders);
      const ensureFoldersArray = (items: Folder[]): Folder[] => {
        return items.map(item => ({
          ...item,
          folders: item.folders ? ensureFoldersArray(item.folders) : [],
          files: item.files || [],
          isExpanded: item.isExpanded || false,
        }));
      };
      return ensureFoldersArray(parsedFolders);
    }
    return [];
  });

  // Reconstruct folders with persistent files once persistentFiles are loaded
  useEffect(() => {
    if (!isPersistentFilesLoading) {
      const buildFoldersWithPersistentFiles = (currentFolders: Folder[]): Folder[] => {
        return currentFolders.map(folder => {
          const filesInFolder = persistentFiles.filter(pf => pf.folderId === folder.id)
            .map(pf => ({
              id: pf.id,
              name: pf.name,
              persistentPath: pf.persistentPath,
              type: pf.type,
              size: pf.size,
              date: pf.date,
            }));
          return {
            ...folder,
            files: filesInFolder,
            folders: buildFoldersWithPersistentFiles(folder.folders),
          };
        });
      };
      // Only set folders if they haven't been populated from persistentFiles yet
      // This prevents overwriting user-created folder structure on every persistentFiles change
      if (folders.every(f => f.files.length === 0) && persistentFiles.length > 0) {
         // Create a default "My Files" folder if none exist but persistent files do
        if (folders.length === 0 && persistentFiles.length > 0) {
          const defaultFolderId = 'default-my-files';
          const defaultFolder: Folder = {
            id: defaultFolderId,
            name: 'My Files',
            files: persistentFiles.filter(pf => pf.folderId === defaultFolderId).map(pf => ({
              id: pf.id,
              name: pf.name,
              persistentPath: pf.persistentPath,
              type: pf.type,
              size: pf.size,
              date: pf.date,
            })),
            folders: [],
            isExpanded: true,
            color: '#6B46C1', // Purple
          };
          setFolders([defaultFolder]);
        } else {
          setFolders(buildFoldersWithPersistentFiles(folders));
        }
      } else if (persistentFiles.length === 0 && folders.some(f => f.files.length > 0)) {
        // If all persistent files are deleted, clear files from folders state
         const clearFilesInFolders = (currentFolders: Folder[]): Folder[] => {
           return currentFolders.map(folder => ({
             ...folder,
             files: [],
             folders: clearFilesInFolders(folder.folders),
           }));
         };
         setFolders(clearFilesInFolders(folders));
      } else {
        // This handles cases where only file properties change or files are added/deleted
        // without affecting the folder structure, ensuring files in state match persistentFiles
        const updateFilesInFolders = (currentFolders: Folder[]): Folder[] => {
          return currentFolders.map(folder => {
            const filesInFolder = persistentFiles.filter(pf => pf.folderId === folder.id)
              .map(pf => ({
                id: pf.id,
                name: pf.name,
                persistentPath: pf.persistentPath,
                type: pf.type,
                size: pf.size,
                date: pf.date,
              }));
            return {
              ...folder,
              files: filesInFolder,
              folders: updateFilesInFolders(folder.folders),
            };
          });
        };
        setFolders(updateFilesInFolders(folders));
      }
    }
  }, [persistentFiles, isPersistentFilesLoading]);


  const [rssFeeds, setRssFeeds] = useState<RssFeed[]>(() => {
    const savedRssFeeds = localStorage.getItem('rssFeeds');
    return savedRssFeeds ? JSON.parse(savedRssFeeds) : [];
  });

  const addRssFeed = (feed: RssFeed) => {
    setRssFeeds(prev => [...prev, feed]);
  };

  const updateRssFeed = (updatedFeed: RssFeed) => {
    setRssFeeds(prev => prev.map(feed => (feed.id === updatedFeed.id ? updatedFeed : feed)));
  };

  const deleteRssFeed = (id: string) => {
    setRssFeeds(prev => prev.filter(feed => feed.id !== id));
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('rssFeeds', JSON.stringify(rssFeeds));
  }, [rssFeeds]);

  // Persist folders structure to localStorage (files content handled by usePersistentFiles)
  useEffect(() => {
    // Only store folder structure and file metadata references
    const serializableFolders = (currentFolders: Folder[]): Folder[] => {
      return currentFolders.map(folder => ({
        id: folder.id,
        name: folder.name,
        color: folder.color,
        isExpanded: folder.isExpanded,
        // Files array contains only the references needed to match with persistentFiles
        files: folder.files.map(file => ({
          id: file.id,
          name: file.name,
          persistentPath: file.persistentPath,
          type: file.type,
          size: file.size,
          date: file.date,
        })),
        folders: serializableFolders(folder.folders),
      }));
    };
    localStorage.setItem('folders', JSON.stringify(serializableFolders(folders)));
  }, [folders]);

  const calculateTotalFiles = () => {
    let count = 0;
    const countFilesInFolders = (currentFolders: Folder[]) => {
      currentFolders.forEach(folder => {
        count += folder.files.length;
        if (folder.folders) {
          countFilesInFolders(folder.folders);
        }
      });
    };
    countFilesInFolders(folders);
    return count;
  };

  const [totalFiles, setTotalFiles] = useState(calculateTotalFiles());

  useEffect(() => {
    setTotalFiles(calculateTotalFiles());
  }, [folders]);

  // File Viewer Modal state
  const [isFileViewerOpen, setIsFileViewerOpen] = useState(false);
  const [fileToView, setFileToView] = useState<File | null>(null);
  const [fileDataUrl, setFileDataUrl] = useState<string | null>(null); // To store the loaded data URL

  const openFileViewer = useCallback(async (file: File) => {
    if (file.persistentPath) {
      // Load the file content from persistent storage
      const dataUrl = await loadPersistentFileDataUrl(file.persistentPath, file.name);
      setFileDataUrl(dataUrl);
      setFileToView(file);
      setIsFileViewerOpen(true);
    } else {
      console.error('File does not have a persistent path:', file);
    }
  }, [loadPersistentFileDataUrl]);

  const closeFileViewer = useCallback(() => {
    setIsFileViewerOpen(false);
    setFileToView(null);
    setFileDataUrl(null); // Clear the data URL when closing
  }, []);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning) {
      interval = setInterval(() => {
        setTimeStudied(prevTime => prevTime + 1);
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
      localStorage.setItem('timeStudied', timeStudied.toString());
    };
  }, [isRunning, timeStudied]);

  useEffect(() => {
    if (!isRunning) {
      localStorage.setItem('timeStudied', timeStudied.toString());
    }
  }, [isRunning, timeStudied]);

  const onToggleTimer = useCallback(() => setIsRunning(prev => !prev), []);
  const onResetTimer = useCallback(() => {
    setTimeStudied(0);
    setIsRunning(false);
  }, []);

  const formatTime = useCallback((totalSeconds: number) => {
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    const format = (num: number) => num.toString().padStart(2, '0');

    if (days > 0) {
      return `${format(days)}:${format(hours)}:${format(minutes)}:${format(seconds)}`;
    } else {
      return `${format(hours)}:${format(minutes)}:${format(seconds)}`;
    }
  }, []);

  const formatTotalStudyTime = useCallback((totalSeconds: number) => {
    const years = Math.floor(totalSeconds / (365 * 24 * 3600));
    totalSeconds %= (365 * 24 * 3600);
    const days = Math.floor(totalSeconds / (24 * 3600));
    totalSeconds %= (24 * 3600);
    const hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    const minutes = Math.floor(totalSeconds / 60);

    const format = (num: number) => num.toString().padStart(2, '0');

    let result = '';
    if (years > 0) result += `${years}y:`;
    if (days > 0 || years > 0) result += `${format(days)}d:`;
    result += `${format(hours)}h:${format(minutes)}m`;

    return result;
  }, []);

  const filterFoldersRecursive = useCallback((currentFolders: Folder[], term: string): Folder[] => {
    if (!term) {
      return currentFolders;
    }

    const lowerCaseSearchTerm = term.toLowerCase();
    return currentFolders.map(folder => {
      const folderMatches = folder.name.toLowerCase().includes(lowerCaseSearchTerm);
      const filteredFiles = folder.files.filter(file =>
        file.name.toLowerCase().includes(lowerCaseSearchTerm)
      );
      const filteredSubfolders = folder.folders ? filterFoldersRecursive(folder.folders, term) : [];

      if (folderMatches || filteredFiles.length > 0 || filteredSubfolders.length > 0) {
        return {
          ...folder,
          isExpanded: true,
          files: folderMatches ? folder.files : filteredFiles,
          folders: filteredSubfolders,
        };
      }
      return null;
    }).filter(Boolean) as Folder[];
  }, [folders]); // Add folders to dependency array to re-calculate when folders change

  const [searchTerm, setSearchTerm] = useState('');
  const filteredFolders = filterFoldersRecursive(folders, searchTerm);

  const saveUploadedFile = useCallback(async (file: globalThis.File, folderId: string): Promise<File | undefined> => {
    try {
      const metadata = await savePersistentFile(file, folderId);
      const newFile: File = {
        id: metadata.id,
        name: metadata.name,
        persistentPath: metadata.persistentPath,
        type: metadata.type,
        size: metadata.size,
        date: metadata.date,
      };
      // No need to update folders here, useEffect dependent on persistentFiles will handle it
      return newFile;
    } catch (error) {
      console.error("Error in saveUploadedFile:", error);
      return undefined;
    }
  }, [savePersistentFile]);

  const deleteUploadedFile = useCallback(async (folderId: string, fileId: string): Promise<void> => {
    try {
      await deletePersistentFile(fileId);
      // No need to update folders here, useEffect dependent on persistentFiles will handle it
    } catch (error) {
      console.error("Error in deleteUploadedFile:", error);
    }
  }, [deletePersistentFile]);

  return (
    <div className="min-h-screen relative overflow-hidden pb-20 bg-white dark:bg-dark-background">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="min-h-screen">
        <Outlet context={{
          timeStudied,
          formatTime,
          totalFiles,
          folders,
          setFolders, // Keep setFolders to allow folder structure changes
          searchTerm,
          setSearchTerm,
          filteredFolders,
          isRunning,
          onToggleTimer,
          onResetTimer,
          setSidebarOpen,
          rssFeeds,
          setRssFeeds,
          addRssFeed,
          updateRssFeed,
          deleteRssFeed,
          isFileViewerOpen,
          fileToView: fileToView, // Pass the File object to the viewer
          openFileViewer,
          closeFileViewer,
          formatTotalStudyTime,
          isDarkMode,
          setIsDarkMode,
          saveUploadedFile, // New
          deleteUploadedFile, // New
        } as OutletContext} />
      </main>

      <BottomNav />

      {/* File Viewer Modal */}
      <FileViewerModal
        isOpen={isFileViewerOpen}
        onClose={closeFileViewer}
        file={fileToView} // Pass the file object
        fileDataUrl={fileDataUrl} // Pass the data URL for rendering
      />
    </div>
  );
};

export default Layout;