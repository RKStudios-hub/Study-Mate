import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { OutletContext, RssFeed } from '../../types';
import { Plus, Edit, Trash2, Save, Moon, Sun, Sparkles } from 'lucide-react';
import SettingsSection from '../components/SettingsSection';

const themes = [
  { id: 'kawaii', name: 'Kawaii', icon: '🌸', color: '#f472b6' },
  { id: 'royal', name: 'Royal', icon: '👑', color: '#9d6dff' },
  { id: 'catpuccin', name: 'Catpuccin', icon: '🐱', color: '#89b4fa' },
  { id: 'frappe', name: 'Frappe', icon: '🍵', color: '#81c8be' },
];

export default function SettingsPage() {
  const { rssFeeds, addRssFeed, updateRssFeed, deleteRssFeed, isDarkMode, setIsDarkMode, theme, setTheme } = useOutletContext<OutletContext>();
  const [newFeedName, setNewFeedName] = useState('');
  const [newFeedUrl, setNewFeedUrl] = useState('');
  const [editingFeedId, setEditingFeedId] = useState<string | null>(null);
  const [editingFeedName, setEditingFeedName] = useState('');
  const [editingFeedUrl, setEditingFeedUrl] = useState('');

  const [fontStyle, setFontStyle] = useState('Default');
  const [isGlassEffect, setIsGlassEffect] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [notificationTypes, setNotificationTypes] = useState({
    reminders: true,
    deadlines: true,
    messages: false,
  });

  const handleAddFeed = () => {
    if (newFeedName && newFeedUrl) {
      addRssFeed({ id: Date.now().toString(), name: newFeedName, url: newFeedUrl });
      setNewFeedName('');
      setNewFeedUrl('');
    }
  };

  const handleEditClick = (feed: RssFeed) => {
    setEditingFeedId(feed.id);
    setEditingFeedName(feed.name);
    setEditingFeedUrl(feed.url);
  };

  const handleSaveEdit = (id: string) => {
    if (editingFeedName && editingFeedUrl) {
      updateRssFeed({ id, name: editingFeedName, url: editingFeedUrl });
      setEditingFeedId(null);
      setEditingFeedName('');
      setEditingFeedUrl('');
    }
  };

  const handleDeleteClick = (id: string) => {
    deleteRssFeed(id);
  };

  const handleNotificationTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNotificationTypes({
      ...notificationTypes,
      [event.target.name]: event.target.checked,
    });
  };

  return (
    <div className="px-4 py-4">
      <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-color)' }}>Settings</h1>

      <SettingsSection title="Appearance">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-3" style={{ color: 'var(--text-muted)' }}>Theme</label>
            <div className="grid grid-cols-2 gap-3">
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`p-3 rounded-xl border-2 transition-all flex items-center gap-3 ${
                    theme === t.id 
                      ? 'border-[var(--accent-color)] bg-[var(--accent-light)]/20' 
                      : 'border-[var(--border-color)] hover:border-[var(--accent-color)]/50'
                  }`}
                  style={{ 
                    backgroundColor: theme === t.id ? `${t.color}20` : 'var(--input-bg)',
                    borderColor: theme === t.color ? '' : ''
                  }}
                >
                  <span className="text-2xl">{t.icon}</span>
                  <span className="font-medium" style={{ color: 'var(--text-color)' }}>{t.name}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <span style={{ color: 'var(--text-muted)' }}>Dark Mode</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={isDarkMode} onChange={() => setIsDarkMode(!isDarkMode)} className="sr-only peer" />
              <div className="w-11 h-6 bg-[var(--input-bg)] rounded-full peer peer-focus:ring-2 peer-focus:ring-[var(--accent-color)] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all" style={{ backgroundColor: isDarkMode ? 'var(--accent-color)' : 'var(--input-bg)' }}></div>
            </label>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span style={{ color: 'var(--text-muted)' }}>Font Style</span>
          <select value={fontStyle} onChange={(e) => setFontStyle(e.target.value)} className="px-3 py-1 border rounded-lg focus:outline-none focus:ring-1" style={{ backgroundColor: 'var(--input-bg)', color: 'var(--text-color)', borderColor: 'var(--border-color)' }}>
            <option>Default</option>
            <option>Serif</option>
            <option>Monospace</option>
          </select>
        </div>
        <div className="flex items-center justify-between">
          <span style={{ color: 'var(--text-muted)' }}>Glass Effect</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={isGlassEffect} onChange={() => setIsGlassEffect(!isGlassEffect)} className="sr-only peer" />
            <div className="w-11 h-6 rounded-full peer peer-focus:ring-2 peer-focus:ring-[var(--accent-color)] after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all" style={{ backgroundColor: isGlassEffect ? 'var(--accent-color)' : 'var(--input-bg)' }}></div>
          </label>
        </div>
      </SettingsSection>

      <SettingsSection title="Notifications">
        <div className="flex items-center justify-between">
          <span style={{ color: 'var(--text-muted)' }}>Push Notifications</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={pushNotifications} onChange={() => setPushNotifications(!pushNotifications)} className="sr-only peer" />
            <div className="w-11 h-6 rounded-full peer peer-focus:ring-2 peer-focus:ring-[var(--accent-color)] after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all" style={{ backgroundColor: pushNotifications ? 'var(--accent-color)' : 'var(--input-bg)' }}></div>
          </label>
        </div>
        <div>
          <span style={{ color: 'var(--text-muted)' }}>Notification Types</span>
          <div className="flex flex-col gap-2 mt-2">
            <label className="flex items-center gap-2" style={{ color: 'var(--text-color)' }}>
              <input type="checkbox" name="reminders" checked={notificationTypes.reminders} onChange={handleNotificationTypeChange} />
              Reminders
            </label>
            <label className="flex items-center gap-2" style={{ color: 'var(--text-color)' }}>
              <input type="checkbox" name="deadlines" checked={notificationTypes.deadlines} onChange={handleNotificationTypeChange} />
              Deadlines
            </label>
            <label className="flex items-center gap-2" style={{ color: 'var(--text-color)' }}>
              <input type="checkbox" name="messages" checked={notificationTypes.messages} onChange={handleNotificationTypeChange} />
              Messages
            </label>
          </div>
        </div>
      </SettingsSection>

      <SettingsSection title="RSS Feed Management">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Feed Name"
              value={newFeedName}
              onChange={(e) => setNewFeedName(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2"
              style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-color)', borderColor: 'var(--border-color)' }}
            />
            <input
              type="url"
              placeholder="Feed URL (e.g., https://www.example.com/rss)"
              value={newFeedUrl}
              onChange={(e) => setNewFeedUrl(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2"
              style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-color)', borderColor: 'var(--border-color)' }}
            />
            <button
              onClick={handleAddFeed}
              className="flex-shrink-0 px-4 py-2 rounded-xl transition-colors flex items-center justify-center gap-2"
              style={{ backgroundColor: 'var(--accent-color)', color: 'white' }}
            >
              <Plus size={18} /> Add Feed
            </button>
          </div>

          {rssFeeds.length > 0 ? (
            <ul className="space-y-3 mt-4">
              {rssFeeds.map((feed) => (
                <li key={feed.id} className="flex flex-col sm:flex-row items-center gap-3 p-3 rounded-xl border" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
                  {editingFeedId === feed.id ? (
                    <>
                      <input
                        type="text"
                        value={editingFeedName}
                        onChange={(e) => setEditingFeedName(e.target.value)}
                        className="flex-1 px-3 py-1 border rounded-lg focus:outline-none focus:ring-1"
                        style={{ backgroundColor: 'var(--input-bg)', color: 'var(--text-color)', borderColor: 'var(--border-color)' }}
                      />
                      <input
                        type="url"
                        value={editingFeedUrl}
                        onChange={(e) => setEditingFeedUrl(e.target.value)}
                        className="flex-1 px-3 py-1 border rounded-lg focus:outline-none focus:ring-1"
                        style={{ backgroundColor: 'var(--input-bg)', color: 'var(--text-color)', borderColor: 'var(--border-color)' }}
                      />
                      <button
                        onClick={() => handleSaveEdit(feed.id)}
                        className="flex-shrink-0 px-3 py-1 rounded-lg transition-colors flex items-center justify-center gap-1"
                        style={{ backgroundColor: '#22c55e', color: 'white' }}
                      >
                        <Save size={16} /> Save
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="flex-1">
                        <p className="font-medium">{feed.name}</p>
                        <p className="text-sm truncate" style={{ color: 'var(--text-muted)' }}>{feed.url}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditClick(feed)}
                          className="p-2 rounded-lg transition-colors"
                          style={{ color: '#3b82f6' }}
                          title="Edit Feed"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(feed.id)}
                          className="p-2 rounded-lg transition-colors"
                          style={{ color: '#ef4444' }}
                          title="Delete Feed"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center py-4" style={{ color: 'var(--text-muted)' }}>No RSS feeds added yet.</p>
          )}
        </div>
      </SettingsSection>

      <SettingsSection title="About">
        <div className="flex items-center justify-between">
          <span style={{ color: 'var(--text-muted)' }}>App Information</span>
          <button style={{ color: 'var(--accent-color)' }}>View</button>
        </div>
        <div className="flex items-center justify-between">
          <span style={{ color: 'var(--text-muted)' }}>Send Feedback</span>
          <button style={{ color: 'var(--accent-color)' }}>Send</button>
        </div>
        <div className="flex items-center justify-between">
          <span style={{ color: 'var(--text-muted)' }}>Support</span>
          <button style={{ color: 'var(--accent-color)' }}>Contact</button>
        </div>
        <div className="flex items-center justify-between">
          <span style={{ color: 'var(--text-muted)' }}>Rate Us</span>
          <button style={{ color: 'var(--accent-color)' }}>Rate</button>
        </div>
        <div className="flex items-center justify-between">
          <span style={{ color: 'var(--text-muted)' }}>Languages</span>
          <button style={{ color: 'var(--accent-color)' }}>Change</button>
        </div>
      </SettingsSection>
    </div>
  );
}



