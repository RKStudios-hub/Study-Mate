import React from 'react';

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}

export default function SettingsSection({ title, children }: SettingsSectionProps) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-100 mb-6">
      <h2 className="text-xl font-semibold text-slate-700 mb-4">{title}</h2>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}
