import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { Search, Bell, Menu, FolderPlus, Upload } from 'lucide-react';
import { ActivityTracker } from '../components/ActivityTracker';
import { FolderCard } from '../components/FolderCard';
import { DeleteModal } from '../components/DeleteModal';
import { CreateFolderModal } from '../components/CreateFolderModal';
import { FileUploadModal } from '../components/FileUploadModal';
import { File, Folder, OutletContext, PersistentFileMetadata } from '../../types';
import { useOutletContext } from 'react-router-dom';


const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function Dashboard() {
  const {
    folders,
    setFolders,
    searchTerm,
    setSearchTerm,
    filteredFolders,
    timeStudied,
    formatTime,
    isRunning,
    onToggleTimer,
    onResetTimer,
    setSidebarOpen,
    openFileViewer,
    saveUploadedFile,
    deleteUploadedFile,
    isDarkMode,
    theme,
    weeklyStudyData,
    weeklyStudyDate,
    setWeeklyStudyData,
  } = useOutletContext<OutletContext>();

  const getAccentColor = () => {
    switch(theme) {
      case 'royal': return '#9d6dff';
      case 'catpuccin': return '#89b4fa';
      case 'frappe': return '#81c8be';
      default: return '#f472b6';
    }
  };

  const accentColor = getAccentColor();

  const [createFolderOpen, setCreateFolderOpen] = useState(false);
  const [currentParentFolderId, setCurrentParentFolderId] = useState<string | undefined>(undefined);
  const [currentParentFolderName, setCurrentParentFolderName] = useState<string | undefined>(undefined);
  const [fileUploadOpen, setFileUploadOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    folderId: string;
    fileId: string;
    fileName: string;
    type: 'file' | 'folder';
    persistentPath?: string; // Add persistentPath for file deletion
  }>({
    isOpen: false,
    folderId: '',
    fileId: '',
    fileName: '',
    type: 'file',
  });

  const [weeklyData, setWeeklyData] = useState(() => {
    if (weeklyStudyData && weeklyStudyData.length > 0) {
      return weeklyStudyData;
    }
    const today = new Date();
    const firstDayOfWeek = new Date(today);
    firstDayOfWeek.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1));
    firstDayOfWeek.setHours(0, 0, 0, 0);

    return DAYS.map((day, index) => {
      const date = new Date(firstDayOfWeek);
      date.setDate(firstDayOfWeek.getDate() + index);
      const dateStr = date.toLocaleDateString('en-CA');
      return { 
        day, 
        hours: 0,
        date: dateStr 
      };
    });
  });

  const lastTimeStudiedRef = useRef(timeStudied);

  // Update today's hours when timer changes
  useEffect(() => {
    const today = new Date();
    const todayStr = today.toLocaleDateString('en-CA');
    
    const dayIndex = DAYS.findIndex(dayName => dayName === today.toLocaleDateString('en-US', { weekday: 'short' }));
    const correctIndex = dayIndex === -1 ? (today.getDay() === 0 ? 6 : today.getDay() - 1) : dayIndex;

    setWeeklyData(prevWeeklyData => {
      let updatedWeeklyData = [...prevWeeklyData];
      
      // Check if week changed - reset all days
      const firstDayOfWeek = new Date(today);
      firstDayOfWeek.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1));
      firstDayOfWeek.setHours(0, 0, 0, 0);
      const currentWeekStart = firstDayOfWeek.toLocaleDateString('en-CA');
      
      if (weeklyStudyDate !== currentWeekStart) {
        // New week - reset all days
        updatedWeeklyData = DAYS.map((day, index) => {
          const date = new Date(firstDayOfWeek);
          date.setDate(firstDayOfWeek.getDate() + index);
          return { day, hours: 0, date: date.toLocaleDateString('en-CA') };
        });
      }
      
      // Update today's hours based on timer
      const delta = timeStudied - lastTimeStudiedRef.current;
      if (delta > 0 && correctIndex >= 0 && correctIndex < updatedWeeklyData.length) {
        updatedWeeklyData[correctIndex] = {
          ...updatedWeeklyData[correctIndex],
          hours: updatedWeeklyData[correctIndex].hours + (delta / 3600)
        };
      }
      
      lastTimeStudiedRef.current = timeStudied;
      return updatedWeeklyData;
    });
  }, [timeStudied, weeklyStudyDate]);

  // Sync weekly data to parent (Layout) - separate effect to avoid setState during render
  useEffect(() => {
    setWeeklyStudyData(weeklyData);
  }, [weeklyData, setWeeklyStudyData]);


  const handleCreateFolder = useCallback((name: string, color: string, parentFolderId?: string) => {
    const newFolder: Folder = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      color,
      files: [],
      folders: [],
      isExpanded: false,
    };

    setFolders(prevFolders => {
      const addFolderToTree = (currentFolders: Folder[]): Folder[] => {
        if (!parentFolderId) {
          return [...currentFolders, newFolder];
        }

        return currentFolders.map(folder => {
          if (folder.id === parentFolderId) {
            return {
              ...folder,
              folders: [...folder.folders, newFolder],
            };
          }
          const updatedSubfolders = addFolderToTree(folder.folders);
          if (updatedSubfolders !== folder.folders) {
            return {
              ...folder,
              folders: updatedSubfolders,
            };
          }
          return folder;
        });
      };
      return addFolderToTree(prevFolders);
    });
    setCreateFolderOpen(false);
    setCurrentParentFolderId(undefined);
    setCurrentParentFolderName(undefined);
  }, [setFolders]);


  const handleUploadFiles = useCallback(async (folderId: string, uploadedFiles: globalThis.File[]) => {
    const newFiles: File[] = [];
    for (const file of uploadedFiles) {
      const savedFile = await saveUploadedFile(file, folderId); // Use saveUploadedFile from context
      if (savedFile) {
        newFiles.push(savedFile);
      }
    }

    setFolders(prevFolders => {
      const addFilesToFolderInTree = (currentFolders: Folder[]): Folder[] => {
        return currentFolders.map(folder => {
          if (folder.id === folderId) {
            return { ...folder, files: [...folder.files, ...newFiles] };
          }
          if (folder.folders && folder.folders.length > 0) {
            const updatedSubfolders = addFilesToFolderInTree(folder.folders);
            if (updatedSubfolders !== folder.folders) {
              return { ...folder, folders: updatedSubfolders };
            }
          }
          return folder;
        });
      };
      return addFilesToFolderInTree(prevFolders);
    });
    setFileUploadOpen(false);
  }, [setFolders, saveUploadedFile]);


  const handleDeleteFile = useCallback((folderId: string, fileId: string) => {
    let fileName = '';
    let filePersistentPath = ''; // To store persistent path
    const findFileInTree = (currentFolders: Folder[]) => {
      for (const folder of currentFolders) {
        if (folder.id === folderId) {
          const file = folder.files.find(f => f.id === fileId);
          if (file) {
            fileName = file.name;
            filePersistentPath = file.persistentPath || ''; // Get persistent path
            return;
          }
        }
        if (folder.folders) {
          findFileInTree(folder.folders);
        }
      }
    };
    findFileInTree(folders);

    if (fileName) {
      setDeleteModal({
        isOpen: true,
        folderId,
        fileId,
        fileName,
        type: 'file',
        persistentPath: filePersistentPath, // Pass persistentPath to modal
      });
    }
  }, [folders]);


  const handleDeleteFolder = useCallback((folderId: string) => {
    let folderName = '';
    const findFolderInTree = (currentFolders: Folder[]) => {
      for (const folder of currentFolders) {
        if (folder.id === folderId) {
          folderName = folder.name;
          return;
        }
        if (folder.folders) {
          findFolderInTree(folder.folders);
        }
      }
    };
    findFolderInTree(folders);

    if (folderName) {
      setDeleteModal({
        isOpen: true,
        folderId,
        fileId: '',
        fileName: folderName,
        type: 'folder',
      });
    }
  }, [folders]);

  const confirmDelete = useCallback(async () => {
    if (deleteModal.type === 'folder') {
      // For folder deletion, first delete all persistent files within that folder and its subfolders
      const filesToDelete: { folderId: string; fileId: string }[] = [];

      const collectFilesToDelete = (currentFolders: Folder[]) => {
        currentFolders.forEach(folder => {
          if (folder.id === deleteModal.folderId) {
            folder.files.forEach(file => filesToDelete.push({ folderId: folder.id, fileId: file.id }));
            folder.folders.forEach(subfolder => collectFilesToDelete([subfolder])); // Recursively collect from subfolders
          } else {
            collectFilesToDelete(folder.folders);
          }
        });
      };
      collectFilesToDelete(folders);

      for (const fileRef of filesToDelete) {
        await deleteUploadedFile(fileRef.folderId, fileRef.fileId); // Delete from persistent storage
      }

      const deleteFolderInTree = (currentFolders: Folder[]): Folder[] => {
        return currentFolders
          .filter(folder => folder.id !== deleteModal.folderId)
          .map(folder => {
            if (folder.folders && folder.folders.length > 0) {
              const updatedSubfolders = deleteFolderInTree(folder.folders);
              if (updatedSubfolders !== folder.folders) {
                return { ...folder, folders: updatedSubfolders };
              }
            }
            return folder;
          });
      };
      setFolders(deleteFolderInTree(folders));
    } else { // type === 'file'
      // Delete from persistent storage first
      if (deleteModal.persistentPath) {
        await deleteUploadedFile(deleteModal.folderId, deleteModal.fileId);
      }
      // The Layout's useEffect watching persistentFiles will automatically update folders state
    }
    setDeleteModal({ isOpen: false, folderId: '', fileId: '', fileName: '', type: 'file' });
  }, [deleteModal, deleteUploadedFile, setFolders, folders]);

  const handleOpenFile = useCallback((file: File) => {
    openFileViewer(file);
  }, [openFileViewer]);

  return (
    <div className="min-h-screen relative overflow-hidden pb-20">
      <div className="min-h-screen">
        <header className="px-4 py-4 flex items-center gap-3 sticky top-0 z-20"
          style={{
            background: 'var(--card-bg)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid var(--border-color)',
          }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors"
            style={{ background: `${accentColor}15` }}
          >
            <Menu className="w-5 h-5" style={{ color: accentColor }} />
          </button>
          
          <div className="flex-1 px-4 py-2.5 rounded-2xl flex items-center gap-2"
            style={{
              background: 'var(--input-bg)',
              border: '1px solid var(--border-color)',
            }}
          >
            <Search className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-sm min-w-0"
              style={{ color: 'var(--text-color)' }}
            />
          </div>
          
          <button className="w-10 h-10 rounded-xl flex items-center justify-center relative flex-shrink-0"
            style={{
              background: 'var(--card-bg)',
              border: '1px solid var(--border-color)',
            }}
          >
            <Bell className="w-4 h-4" style={{ color: 'var(--text-color)', opacity: 0.7 }} />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full" style={{ background: 'var(--destructive)' }} />
          </button>
        </header>

        <main className="px-4 pb-6 pt-4">
          <div className="mb-6">
            <ActivityTracker weekData={weeklyData} timeStudied={timeStudied} formatTime={formatTime} isRunning={isRunning} onToggleTimer={onToggleTimer} onResetTimer={onResetTimer} />
          </div>

          <div className="flex gap-3 mb-4">
            <button
              onClick={() => {
                setCreateFolderOpen(true);
                setCurrentParentFolderId(undefined);
                setCurrentParentFolderName(undefined);
              }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all hover:shadow-lg active:scale-95"
              style={{
                background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}cc 100%)`,
                color: 'white',
              }}
            >
              <FolderPlus className="w-5 h-5" />
              <span>New Folder</span>
            </button>
            <button
              onClick={() => setFileUploadOpen(true)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all hover:shadow-lg active:scale-95"
              style={{
                background: `linear-gradient(135deg, ${accentColor}cc 0%, ${accentColor}99 100%)`,
                color: 'white',
              }}
            >
              <Upload className="w-5 h-5" />
              <span>Upload</span>
            </button>
          </div>

          <div className="mb-4">
            <h2 className="text-xl font-semibold"
              style={{ color: 'var(--text-color)' }}
            >
              {searchTerm ? 'Search Results' : 'My Folders'}
            </h2>
            {searchTerm && (
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                {filteredFolders.length} folder(s) found
              </p>
            )}
          </div>

          <div className="space-y-4">
            {filteredFolders.map(folder => (
              <FolderCard
                key={folder.id}
                folder={folder}
                level={0}
                onDeleteFile={handleDeleteFile}
                onDeleteFolder={handleDeleteFolder}
                onUploadFiles={handleUploadFiles}
                onCreateSubfolder={(parentFolderId) => {
                  setCreateFolderOpen(true);
                  setCurrentParentFolderId(parentFolderId);
                  const findFolderName = (id: string, foldersToSearch: Folder[]): string | undefined => {
                    for (const f of foldersToSearch) {
                      if (f.id === id) return f.name;
                      const foundInSub = findFolderName(id, f.folders);
                      if (foundInSub) return foundInSub;
                    }
                    return undefined;
                  };
                  setCurrentParentFolderName(findFolderName(parentFolderId, folders));
                }}
                onOpenFile={handleOpenFile}
              />
            ))}
            
            {filteredFolders.length === 0 && (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: 'var(--secondary)' }}>
                  <Search className="w-10 h-10" style={{ color: 'var(--text-muted)' }} />
                </div>
                <p className="mb-2" style={{ color: 'var(--text-color)' }}>No results found</p>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Try a different search term</p>
              </div>
            )}
          </div>
        </main>
      </div>

      <CreateFolderModal
        isOpen={createFolderOpen}
        onClose={() => setCreateFolderOpen(false)}
        onConfirm={handleCreateFolder}
        parentFolderId={currentParentFolderId}
        currentParentFolderName={currentParentFolderName}
      />

      <FileUploadModal
        isOpen={fileUploadOpen}
        onClose={() => setFileUploadOpen(false)}
        onConfirm={handleUploadFiles}
        folders={folders}
      />

      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, folderId: '', fileId: '', fileName: '', type: 'file' })}
        onConfirm={confirmDelete}
        fileName={deleteModal.fileName}
        type={deleteModal.type}
      />
    </div>
  );
}