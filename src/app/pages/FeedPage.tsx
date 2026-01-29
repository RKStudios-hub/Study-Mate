import React from 'react';
import { NewsWidget } from '../components/NewsWidget';

export default function FeedPage() {
  return (
    <div className="min-h-screen relative overflow-hidden pb-20 bg-white dark:bg-dark-background">
      {/* Background with gradient */}
      <div
        className="fixed inset-0 -z-10 dark:hidden"
        style={{
          background: 'linear-gradient(135deg, #F3E7FF 0%, #E8F5E9 50%, #E0F2F7 100%)',
        }}
      />

      {/* Main Content */}
      <main className="px-4 pb-6 pt-4">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-dark-text mb-6">News Feed</h1>
        
        {/* News Widget */}
        <div className="mb-6">
          <NewsWidget />
        </div>
      </main>
    </div>
  );
}