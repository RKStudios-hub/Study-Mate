// src/types.ts

export interface PersistentFileMetadata {
  id: string;
  name: string;
  persistentPath: string; // The ID used to retrieve the file from storage
  type?: string; // Storing the file extension or inferred type (e.g., 'pdf', 'png')
  size?: string; // Formatted size
  date?: string; // Formatted date
  folderId: string; // To link back to the folder it belongs to
}

export interface File {
  id: string;
  name: string;
  type?: string;
  size?: string;
  date?: string;
  persistentPath: string; // Reference to the persistently stored file
}

export interface Folder {
  id: string;
  name: string;
  files: File[]; // Now contains File objects with persistentPath
  folders: Folder[]; // Nested folders
  isExpanded?: boolean; // Optional, for UI state management
  color?: string; // Optional for Study Mate (1) existing Folder properties
}

export interface RssFeed {
  id: string;
  name: string;
  url: string;
}

export interface OutletContext {
  timeStudied: number;
  totalTimeStudied: number;
  formatTime: (totalSeconds: number) => string;
  totalFiles: number;
  folders: Folder[];
  setFolders: React.Dispatch<React.SetStateAction<Folder[]>>;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  filteredFolders: Folder[];
  isRunning: boolean;
  onToggleTimer: () => void;
  onResetTimer: () => void;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  rssFeeds: RssFeed[];
  setRssFeeds: React.Dispatch<React.SetStateAction<RssFeed[]>>;
  addRssFeed: (feed: RssFeed) => void;
  updateRssFeed: (feed: RssFeed) => void;
  deleteRssFeed: (id: string) => void;
  isFileViewerOpen: boolean;
  fileToView: File | null;
  openFileViewer: (file: File) => void;
  closeFileViewer: () => void;
  formatTotalStudyTime: (totalSeconds: number) => string;
  isDarkMode: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  theme: string;
  setTheme: React.Dispatch<React.SetStateAction<string>>;
  fontFamily: string;
  setFontFamily: React.Dispatch<React.SetStateAction<string>>;
  saveUploadedFile: (file: globalThis.File, folderId: string) => Promise<File | undefined>;
  deleteUploadedFile: (folderId: string, fileId: string) => Promise<void>;
  weeklyStudyData: { day: string; hours: number; date: string }[];
  weeklyStudyDate: string;
  setWeeklyStudyData: React.Dispatch<React.SetStateAction<{ day: string; hours: number; date: string }[]>>;
}