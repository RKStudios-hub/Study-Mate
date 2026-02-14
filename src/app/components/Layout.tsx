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
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('isDarkMode');
    return saved ? JSON.parse(saved) : false;
  });

  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved || 'kawaii';
  });

  const [fontFamily, setFontFamily] = useState(() => {
    const saved = localStorage.getItem('fontFamily');
    return saved || 'Default';
  });

  useEffect(() => {
    document.body.setAttribute('data-theme', theme === 'kawaii' ? '' : theme);
  }, [theme]);

  useEffect(() => {
    const fonts: { [key: string]: string } = {
      'Default': 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      'Serif': 'Georgia, "Times New Roman", Times, serif',
      'Monospace': '"Courier New", Courier, monospace',
      'Rounded': '"Nunito", "Comic Sans MS", sans-serif',
    };
    document.body.style.fontFamily = fonts[fontFamily] || fonts['Default'];
    localStorage.setItem('fontFamily', fontFamily);
  }, [fontFamily]);

  // Debug data - all in one place
  const getDebugData = () => {
    const saved = localStorage.getItem('studyMateDebug');
    return saved ? JSON.parse(saved) : {
      dailyTimeStudied: 0,
      dailyTimeDate: '',
      totalTimeStudied: 0,
      weeklyStudyData: [],
      weeklyStudyDate: '',
      folders: [],
      rssFeeds: []
    };
  };

  const [debugData, setDebugData] = useState(getDebugData);

  // Save debug data helper
  const saveDebugData = (updates: Partial<typeof debugData>) => {
    setDebugData(prev => {
      const newData = { ...prev, ...updates };
      localStorage.setItem('studyMateDebug', JSON.stringify(newData));
      return newData;
    });
  };

  const [weeklyStudyData, setWeeklyStudyData] = useState<{ day: string; hours: number; date: string }[]>(() => {
    const data = getDebugData();
    if (data.weeklyStudyData && data.weeklyStudyData.length > 0) {
      const today = new Date();
      const todayStr = today.toLocaleDateString('en-CA');
      const firstDayOfWeek = new Date(today);
      firstDayOfWeek.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1));
      firstDayOfWeek.setHours(0, 0, 0, 0);
      
      const savedWeekStart = data.weeklyStudyDate;
      const currentWeekStart = firstDayOfWeek.toLocaleDateString('en-CA');
      
      if (savedWeekStart === currentWeekStart) {
        return data.weeklyStudyData;
      }
    }
    return [];
  });
  
  const [weeklyStudyDate, setWeeklyStudyDate] = useState(() => {
    const data = getDebugData();
    const today = new Date();
    const firstDayOfWeek = new Date(today);
    firstDayOfWeek.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1));
    firstDayOfWeek.setHours(0, 0, 0, 0);
    return data.weeklyStudyDate || firstDayOfWeek.toLocaleDateString('en-CA');
  });

  const [rssFeeds, setRssFeeds] = useState<RssFeed[]>(() => getDebugData().rssFeeds || []);

  const [folders, setFolders] = useState<Folder[]>(() => getDebugData().folders || []);

  // Save weekly study data when it changes
  useEffect(() => {
    if (weeklyStudyData.length > 0) {
      saveDebugData({ weeklyStudyData, weeklyStudyDate });
    }
  }, [weeklyStudyData, weeklyStudyDate]);

  const [timeStudied, setTimeStudied] = useState<number>(() => {
    const data = getDebugData();
    const currentDate = new Date().toDateString();
    if (data.dailyTimeDate === currentDate) {
      return data.dailyTimeStudied || 0;
    }
    return 0;
  });
  
  const [totalTimeStudied, setTotalTimeStudied] = useState<number>(() => getDebugData().totalTimeStudied || 0);
  
  const [isRunning, setIsRunning] = useState(true);

  const {
    persistentFiles,
    isLoading: isPersistentFilesLoading,
    savePersistentFile,
    loadPersistentFileDataUrl,
    deletePersistentFile,
  } = usePersistentFiles();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Save RSS feeds to debug data
  useEffect(() => {
    saveDebugData({ rssFeeds });
  }, [rssFeeds]);

  const addRssFeed = (feed: RssFeed) => {
    setRssFeeds(prev => [...prev, feed]);
  };

  const updateRssFeed = (updatedFeed: RssFeed) => {
    setRssFeeds(prev => prev.map(feed => (feed.id === updatedFeed.id ? updatedFeed : feed)));
  };

  const deleteRssFeed = (id: string) => {
    setRssFeeds(prev => prev.filter(feed => feed.id !== id));
  };

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
    saveDebugData({ folders: serializableFolders(folders) });
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
        setTotalTimeStudied(prevTime => prevTime + 1);
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
      // Save to debug data
      saveDebugData({
        dailyTimeStudied: timeStudied,
        dailyTimeDate: new Date().toDateString(),
        totalTimeStudied: totalTimeStudied
      });
    };
  }, [isRunning, timeStudied, totalTimeStudied]);

  useEffect(() => {
    if (!isRunning) {
      saveDebugData({
        dailyTimeStudied: timeStudied,
        dailyTimeDate: new Date().toDateString(),
        totalTimeStudied: totalTimeStudied
      });
    }
  }, [isRunning, timeStudied, totalTimeStudied]);

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
      return newFile;
    } catch (error) {
      console.error("Error in saveUploadedFile:", error);
      alert(`Failed to upload file: ${(error as Error).message || 'Unknown error'}`);
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
    <div className="min-h-screen relative overflow-hidden pb-20" style={{ background: 'transparent' }}>
      <div className="fixed inset-0 -z-10" style={{ 
        background: 'linear-gradient(135deg, var(--gradient-start) 0%, var(--gradient-end) 100%)',
        transition: 'background 0.4s ease'
      }} />
      
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        theme={theme}
      />

      <main className="min-h-screen">
        <Outlet context={{
          timeStudied,
          totalTimeStudied,
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
          theme,
          setTheme,
          fontFamily,
          setFontFamily,
          saveUploadedFile, // New
          deleteUploadedFile, // New
          weeklyStudyData,
          weeklyStudyDate,
          setWeeklyStudyData,
        } as OutletContext} />
      </main>

      <BottomNav theme={theme} />

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