import React from 'react';
import { NewsWidget } from '../components/NewsWidget';
import { useOutletContext } from 'react-router-dom';
import { OutletContext } from '../../types';

export default function FeedPage() {
  const { theme } = useOutletContext<OutletContext>();

  const getGradient = () => {
    switch(theme) {
      case 'royal':
        return 'linear-gradient(135deg, #0d0d1a 0%, #1a1a2e 50%, #16162a 100%)';
      case 'catpuccin':
        return 'linear-gradient(135deg, #1e1e2e 0%, #313244 50%, #1e1e2e 100%)';
      case 'frappe':
        return 'linear-gradient(135deg, #303336 0%, #414559 50%, #383c42 100%)';
      default:
        return 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 50%, #e0e7ff 100%)';
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden pb-20">
      <div
        className="fixed inset-0 -z-10"
        style={{ background: getGradient() }}
      />

      <main className="px-4 pb-6 pt-4">
        <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-color)' }}>News Feed</h1>
        
        <div className="mb-6">
          <NewsWidget />
        </div>
      </main>
    </div>
  );
}
