import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, FileText } from 'lucide-react';
import { Folder } from '../../types'; // Import the Folder interface

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (folderId: string, files: globalThis.File[]) => void;
  folders: Folder[]; // Use the imported Folder interface
}

// Helper function to flatten nested folders for dropdown display
const flattenFolders = (folders: Folder[], depth = 0): Array<Folder & { depth: number }> => {
  let result: Array<Folder & { depth: number }> = [];
  folders.forEach(folder => {
    result.push({ ...folder, depth });
    if (folder.folders && folder.folders.length > 0) {
      result = result.concat(flattenFolders(folder.folders, depth + 1));
    }
  });
  return result;
};

export function FileUploadModal({ isOpen, onClose, onConfirm, folders }: FileUploadModalProps) {
  const [selectedFiles, setSelectedFiles] = useState<globalThis.File[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState('');
  const flattenedFolders = flattenFolders(folders);

  // Set initial selected folder to the first available if none is selected
  useEffect(() => {
    if (flattenedFolders.length > 0 && !selectedFolderId) {
      setSelectedFolderId(flattenedFolders[0].id);
    } else if (flattenedFolders.length === 0) {
      setSelectedFolderId('');
    }
  }, [flattenedFolders, selectedFolderId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = () => {
    if (selectedFiles.length > 0 && selectedFolderId) {
      onConfirm(selectedFolderId, selectedFiles);
      setSelectedFiles([]);
      onClose();
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 px-4"
          >
            <div
              className="mx-auto max-w-lg rounded-t-3xl p-6"
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.5)',
                boxShadow: '0 -8px 32px rgba(0, 0, 0, 0.1)',
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-slate-900">Upload Files</h3>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="space-y-5">
                {/* Folder Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Select Folder
                  </label>
                  <select
                    value={selectedFolderId}
                    onChange={(e) => setSelectedFolderId(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900"
                    disabled={flattenedFolders.length === 0} // Disable if no folders
                  >
                    {flattenedFolders.length === 0 && (
                        <option value="" disabled>No folders available</option>
                    )}
                    {flattenedFolders.map((folder) => (
                      <option key={folder.id} value={folder.id}>
                        {'--'.repeat(folder.depth)}{folder.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Choose Files
                  </label>
                  <label
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <Upload className="w-8 h-8 text-slate-400 mb-2" />
                    <span className="text-sm text-slate-600">
                      {selectedFiles.length > 0 
                        ? `${selectedFiles.length} file(s) selected` 
                        : 'Tap to select files'}
                    </span>
                    <input
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                      accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.gif,.webp,.svg,.mp3,.mp4" // Updated accept attribute
                    />
                  </label>
                </div>

                {/* Selected Files List */}
                {selectedFiles.length > 0 && (
                  <div className="max-h-32 overflow-y-auto space-y-2">
                    {selectedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 rounded-lg bg-slate-50"
                      >
                        <FileText className="w-4 h-4 text-slate-600" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-slate-900 truncate">{file.name}</p>
                          <p className="text-xs text-slate-500">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={onClose}
                    className="flex-1 px-4 py-3 rounded-xl border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={selectedFiles.length === 0 || !selectedFolderId}
                    className="flex-1 px-4 py-3 rounded-xl text-white font-medium transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                    style={{
                      background: 'linear-gradient(135deg, #6D5BFF 0%, #8B7AFF 100%)',
                    }}
                  >
                    Upload Files
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}