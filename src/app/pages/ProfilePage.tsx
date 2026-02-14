import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { OutletContext } from '../../types';

export default function ProfilePage() {
  const { timeStudied, formatTotalStudyTime, theme } = useOutletContext<OutletContext>();

  const getAccentColor = () => {
    switch(theme) {
      case 'royal': return '#9d6dff';
      case 'catpuccin': return '#89b4fa';
      case 'frappe': return '#81c8be';
      default: return '#f472b6';
    }
  };

  const accentColor = getAccentColor();

  return (
    <div className="px-4 py-4">
      <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-color)' }}>Profile Page</h1>
      
      <div className="rounded-3xl p-6 shadow-md mb-6" style={{ 
        backgroundColor: 'var(--card-bg)', 
        border: '1px solid var(--border-color)' 
      }}>
        <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-color)' }}>Total Time Spent Studying</h2>
        <p className="text-4xl font-bold" style={{ color: accentColor }}>
          {formatTotalStudyTime(timeStudied)}
        </p>
        <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
          This is the total accumulated time you've spent using the app. The timer runs continuously in the background.
        </p>
      </div>

      <p style={{ color: 'var(--text-muted)' }}>This is a placeholder for the user profile page.</p>
    </div>
  );
}
