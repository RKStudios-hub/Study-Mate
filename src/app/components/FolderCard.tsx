import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronRight, Folder, FileText, FileImage, Trash2, FolderPlus, UploadCloud, PlusCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { File, Folder as FolderType } from '../../types'; // Renamed Folder to FolderType to avoid conflict

interface FolderCardProps {
  folder: FolderType;
  level: number; // Add level prop for indentation
  onDeleteFile: (folderId: string, fileId: string) => void;
  onDeleteFolder: (folderId: string) => void;
  onUploadFiles: (folderId: string, files: globalThis.File[]) => void;
  onCreateSubfolder: (parentFolderId: string) => void;
  onOpenFile?: (file: File) => void; // Optional prop to open files
}

export function FolderCard({ 
  folder, 
  level, 
  onDeleteFile, 
  onDeleteFolder, 
  onUploadFiles, 
  onCreateSubfolder,
  onOpenFile
}: FolderCardProps) {
  const [isExpanded, setIsExpanded] = useState(folder.isExpanded || false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const fileLongPressTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Cleanup timers on component unmount
    return () => {
      if (longPressTimer.current) clearTimeout(longPressTimer.current);
      if (fileLongPressTimer.current) clearTimeout(fileLongPressTimer.current);
    };
  }, []);

  const triggerHaptic = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(50); // 50ms vibration
    }
  };

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleFolderLongPressStart = () => {
    longPressTimer.current = setTimeout(() => {
      triggerHaptic();
      onDeleteFolder(folder.id);
    }, 500); // 500ms long press
  };

  const handleFolderLongPressEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  };

  const handleFileLongPressStart = (fileId: string) => {
    fileLongPressTimer.current = setTimeout(() => {
      triggerHaptic();
      onDeleteFile(folder.id, fileId);
    }, 500); // 500ms long press
  };

  const handleFileLongPressEnd = () => {
    if (fileLongPressTimer.current) {
      clearTimeout(fileLongPressTimer.current);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      onUploadFiles(folder.id, Array.from(event.target.files));
    }
  };

  const getFileIcon = (type?: string) => {
    const defaultType = type || 'unknown';
    switch (defaultType) {
      case 'pdf':
        return <FileText className="w-5 h-5" style={{ color: '#EF4444' }} />;
      case 'docx':
        return <FileText className="w-5 h-5" style={{ color: '#3B82F6' }} />;
      case 'png':
      case 'jpg':
      case 'jpeg':
        return <FileImage className="w-5 h-5" style={{ color: '#10B981' }} />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getFileColor = (type?: string) => {
    const defaultType = type || 'unknown';
    switch (defaultType) {
      case 'pdf':
        return 'rgba(239, 68, 68, 0.1)';
      case 'docx':
        return 'rgba(59, 130, 246, 0.1)';
      case 'png':
      case 'jpg':
      case 'jpeg':
        return 'rgba(16, 185, 129, 0.1)';
      default:
        return 'rgba(148, 163, 184, 0.1)';
    }
  };

  const hasContent = folder.files.length > 0 || (folder.folders && folder.folders.length > 0);

  return (
    <div
      className="rounded-3xl overflow-hidden"
      style={{
        background: 'rgba(255, 255, 255, 0.4)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.5)',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)',
        marginLeft: `${level * 20}px`, // Indentation for subfolders
      }}
    >
      {/* Folder Header */}
      <button
        onClick={handleToggleExpand}
        className="w-full px-4 py-4 flex items-center gap-3 hover:bg-white/20 transition-colors"
        onTouchStart={handleFolderLongPressStart}
        onTouchEnd={handleFolderLongPressEnd}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ 
            background: folder.color,
            backdropFilter: 'blur(10px)',
          }}
        >
          <Folder className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 text-left min-w-0">
          <h4 className="text-slate-800 font-medium text-sm truncate">{folder.name}</h4>
          <p className="text-slate-500 text-xs">
            {folder.files.length + (folder.folders ? folder.folders.length : 0)} items
          </p>
        </div>
        {isExpanded ? (
          <ChevronDown className="w-5 h-5 text-slate-600 flex-shrink-0" />
        ) : (
          <ChevronRight className="w-5 h-5 text-slate-600 flex-shrink-0" />
        )}
      </button>

      {/* Files List and Subfolders */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="border-t border-white/30"
          >
            <div className="px-6 py-4 space-y-2">
              {/* Action Buttons for files and subfolders */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => onCreateSubfolder(folder.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-purple-600 bg-purple-50 hover:bg-purple-100 transition-colors text-sm font-medium"
                >
                  <FolderPlus className="w-4 h-4" />
                  <span>Subfolder</span>
                </button>
                <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors text-sm font-medium cursor-pointer">
                  <UploadCloud className="w-4 h-4" />
                  <span>Upload Files</span>
                  <input type="file" multiple className="hidden" onChange={handleFileChange} ref={fileInputRef} />
                </label>
              </div>

              {/* Display Files */}
              {folder.files.map((file, index) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/30 transition-all group cursor-pointer"
                  style={{
                    background: getFileColor(file.type),
                  }}
                  onTouchStart={() => handleFileLongPressStart(file.id)}
                  onTouchEnd={handleFileLongPressEnd}
                  onClick={() => onOpenFile && onOpenFile(file)} // Open file if url exists
                >
                  <div className="flex-shrink-0">
                    {getFileIcon(file.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-800 text-sm font-medium truncate">{file.name}</p>
                    <p className="text-slate-500 text-xs">
                      {file.size} • {file.date}
                    </p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); onDeleteFile(folder.id, file.id); }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-100 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </motion.div>
              ))}

              {/* Recursive rendering for subfolders */}
              {folder.folders && folder.folders.map((subfolder) => (
                <FolderCard
                  key={subfolder.id}
                  folder={subfolder}
                  level={level + 1}
                  onDeleteFile={onDeleteFile}
                  onDeleteFolder={onDeleteFolder}
                  onUploadFiles={onUploadFiles}
                  onCreateSubfolder={onCreateSubfolder}
                  onOpenFile={onOpenFile}
                />
              ))}

              {!hasContent && (
                <div className="py-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-slate-100 flex items-center justify-center">
                    <Folder className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-500 text-sm mb-2">This folder is empty</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}