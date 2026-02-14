import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Folder } from 'lucide-react';

interface CreateFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (name: string, color: string, parentFolderId?: string) => void;
  parentFolderId?: string;
  currentParentFolderName?: string;
}

const folderColors = [
  { name: 'Purple', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { name: 'Pink', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { name: 'Blue', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
  { name: 'Orange', gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
  { name: 'Green', gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
  { name: 'Red', gradient: 'linear-gradient(135deg, #f83600 0%, #f9d423 100%)' },
];

export function CreateFolderModal({ isOpen, onClose, onConfirm, parentFolderId, currentParentFolderName }: CreateFolderModalProps) {
  const [folderName, setFolderName] = useState('');
  const [selectedColor, setSelectedColor] = useState(folderColors[0].gradient);

  const handleSubmit = () => {
    if (folderName.trim()) {
      onConfirm(folderName.trim(), selectedColor, parentFolderId);
      setFolderName('');
      setSelectedColor(folderColors[0].gradient);
      onClose();
    }
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
            className="fixed inset-0 backdrop-blur-sm z-50"
            style={{ background: 'rgba(0, 0, 0, 0.4)' }}
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
                background: 'var(--card-bg)',
                backdropFilter: 'blur(20px)',
                border: '1px solid var(--border-color)',
                boxShadow: '0 -8px 32px rgba(0, 0, 0, 0.1)',
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold" style={{ color: 'var(--text-color)' }}>
                  {currentParentFolderName ? `Create subfolder in "${currentParentFolderName}"` : 'Create Folder'}
                </h3>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg transition-colors"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-5">
                {/* Folder Name Input */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-color)' }}>
                    Folder Name
                  </label>
                  <input
                    type="text"
                    value={folderName}
                    onChange={(e) => setFolderName(e.target.value)}
                    placeholder="e.g., Computer Science"
                    className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2"
                    style={{
                      borderColor: 'var(--border-color)',
                      background: 'var(--input-bg)',
                      color: 'var(--text-color)',
                      '--tw-ring-color': 'var(--accent-color)',
                    } as React.CSSProperties}
                    autoFocus
                  />
                </div>

                {/* Color Selection */}
                <div>
                  <label className="block text-sm font-medium mb-3" style={{ color: 'var(--text-color)' }}>
                    Choose Color
                  </label>
                  <div className="grid grid-cols-6 gap-3">
                    {folderColors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color.gradient)}
                        className="relative w-12 h-12 rounded-xl transition-all active:scale-95"
                        style={{
                          background: color.gradient,
                          border: selectedColor === color.gradient ? '3px solid var(--accent-color)' : '3px solid transparent',
                          boxShadow: selectedColor === color.gradient ? '0 4px 12px var(--accent-color)' : 'none',
                        }}
                      >
                        {selectedColor === color.gradient && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Folder className="w-5 h-5 text-white" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={onClose}
                    className="flex-1 px-4 py-3 rounded-xl border font-medium transition-colors"
                    style={{
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-color)',
                      background: 'transparent',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!folderName.trim()}
                    className="flex-1 px-4 py-3 rounded-xl font-medium transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                    style={{
                      background: 'linear-gradient(135deg, var(--accent-color) 0%, var(--accent-dark) 100%)',
                      color: 'white',
                    }}
                  >
                    Create Folder
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
