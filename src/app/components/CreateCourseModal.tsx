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
        <h3 style={{color: 'var(--text-color)', marginBottom: '16px'}}>Create New Course</h3>
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
            border: '1px solid var(--border-color)',
            marginBottom: '10px',
            color: 'var(--text-color)',
            background: 'var(--input-bg)'
          }}
        />
        <button
          onClick={handleConfirm}
          style={{
            background: "linear-gradient(135deg, var(--accent-color) 0%, var(--accent-dark) 100%)",
            color: "white"
          }}
        >
          Create
        </button>
        <button onClick={handleClose} style={{ background: "var(--secondary)", color: "var(--text-color)" }}>
          Cancel
        </button>
      </div>
    </div>
  );
};