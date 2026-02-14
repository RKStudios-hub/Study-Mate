import React from 'react';

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}

export default function SettingsSection({ title, children }: SettingsSectionProps) {
  return (
    <div className="rounded-3xl p-6 mb-6" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
      <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-color)' }}>{title}</h2>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}
