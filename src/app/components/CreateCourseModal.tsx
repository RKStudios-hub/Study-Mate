import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CreateCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (courseName: string) => void;
}

export const CreateCourseModal: React.FC<CreateCourseModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [courseName, setCourseName] = useState('');

  const handleConfirm = () => {
    if (courseName.trim()) {
      onConfirm(courseName.trim());
      setCourseName(''); // Clear input after confirming
    }
  };

  const handleClose = () => {
    setCourseName(''); // Clear input on close
    onClose();
  };

  return (
    <div className="modal" style={{ display: isOpen ? 'flex' : 'none' }}>
      <div className="box modal-box" onClick={e => e.stopPropagation()}>
        <h3 style={{color: 'var(--text-dashboard-800)', marginBottom: '16px'}}>Create New Course</h3>
        <input
          type="text"
          placeholder="Course Name"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleConfirm();
            }
          }}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid var(--card-border-dashboard)',
            marginBottom: '10px',
            color: 'var(--text-dashboard-800)',
            background: 'transparent'
          }}
        />
        <button
          onClick={handleConfirm}
          style={{
            background: "linear-gradient(135deg, var(--accent-purple-primary) 0%, var(--accent-purple-secondary) 100%)",
            color: "var(--text-light)"
          }}
        >
          Create
        </button>
        <button onClick={handleClose} style={{ background: "var(--grey)", color: "var(--text-dashboard-800)" }}>
          Cancel
        </button>
      </div>
    </div>
  );
};