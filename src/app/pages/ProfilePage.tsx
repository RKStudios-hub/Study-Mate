import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { OutletContext } from '../../types';

export default function ProfilePage() {
  const { timeStudied, formatTotalStudyTime } = useOutletContext<OutletContext>();

  return (
    <div className="px-4 py-4 bg-white dark:bg-dark-background">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-dark-text mb-6">Profile Page</h1>
      
      <div className="bg-white dark:bg-dark-card rounded-3xl p-6 shadow-md border border-gray-100 dark:border-dark-card mb-6">
        <h2 className="text-xl font-semibold text-slate-700 dark:text-dark-text mb-4">Total Time Spent Studying</h2>
        <p className="text-4xl font-bold text-purple-600 dark:text-dark-primary">
          {formatTotalStudyTime(timeStudied)}
        </p>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
          This is the total accumulated time you've spent using the app. The timer runs continuously in the background.
        </p>
      </div>

      <p className="text-slate-600 dark:text-slate-400">This is a placeholder for the user profile page.</p>
    </div>
  );
}
