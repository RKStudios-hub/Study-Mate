import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import React, { useEffect } from 'react';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  fileName: string;
  type?: 'file' | 'folder' | 'task' | 'course';
}

export function DeleteModal({ isOpen, onClose, onConfirm, fileName, type = 'file' }: DeleteModalProps) {
  useEffect(() => {
    if (isOpen && 'vibrate' in navigator) {
      navigator.vibrate([200]); // Vibrate for 200 milliseconds
    }
  }, [isOpen]);

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
          
          {/* Modal Slide-over */}
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
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'var(--destructive)' }}>
                  <AlertTriangle className="w-5 h-5" style={{ color: 'var(--destructive-foreground)' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--text-color)' }}>
                    Delete {type === 'folder' ? 'Folder' : type === 'task' ? 'Task' : type === 'course' ? 'Course' : 'File'}
                  </h3>
                  <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
                    Are you sure you want to delete <span className="font-medium" style={{ color: 'var(--text-color)' }}>"{fileName}"</span>? 
                    {type === 'folder' && ' All files inside will be deleted. '}
                    {type === 'task' && ' This task will be permanently removed. '}
                    {type === 'course' && ' All attendance records for this course will be lost. '}
                    This action cannot be undone.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={onClose}
                      className="flex-1 px-4 rounded-xl border font-medium transition-colors text-sm text-center min-h-10 flex items-center justify-center"
                      style={{
                        borderColor: 'var(--border-color)',
                        color: 'var(--text-color)',
                        background: 'transparent',
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={onConfirm}
                      className="flex-1 px-4 rounded-xl font-medium transition-all hover:shadow-lg text-sm text-center min-h-10 flex items-center justify-center"
                      style={{
                        background: 'linear-gradient(135deg, var(--destructive) 0%, #b91c1c 100%)',
                        color: 'var(--destructive-foreground)',
                      }}
                    >
                      Delete {type === 'folder' ? 'Folder' : type === 'task' ? 'Task' : type === 'course' ? 'Course' : 'File'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}