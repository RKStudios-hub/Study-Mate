import React, { useState, useRef, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { OutletContext, RssFeed } from '../../types';
import { Plus, Edit, Trash2, Save } from 'lucide-react';
import SettingsSection from '../components/SettingsSection';

const themes = [
  { id: 'kawaii', name: 'Kawaii', icon: 'fa-solid fa-spa', color: '#f472b6' },
  { id: 'royal', name: 'Royal Dark', icon: 'fa-solid fa-crown', color: '#9d6dff' },
  { id: 'catpuccin', name: 'Catpuccin Mocha', icon: 'fa-solid fa-cat', color: '#89b4fa' },
  { id: 'frappe', name: 'Catppuccin Frappe', icon: 'fa-solid fa-mug-hot', color: '#81c8be' },
];

const fonts = [
  { id: 'Default', name: 'Default', icon: 'fa-solid fa-font' },
  { id: 'Serif', name: 'Serif', icon: 'fa-solid fa-heading' },
  { id: 'Monospace', name: 'Monospace', icon: 'fa-solid fa-code' },
  { id: 'Rounded', name: 'Rounded', icon: 'fa-solid fa-circle' },
];

export default function SettingsPage() {
  const { rssFeeds, addRssFeed, updateRssFeed, deleteRssFeed, theme, setTheme, fontFamily, setFontFamily } = useOutletContext<OutletContext>();
  const [newFeedName, setNewFeedName] = useState('');
  const [newFeedUrl, setNewFeedUrl] = useState('');
  const [editingFeedId, setEditingFeedId] = useState<string | null>(null);
  const [editingFeedName, setEditingFeedName] = useState('');
  const [editingFeedUrl, setEditingFeedUrl] = useState('');

  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
  const [isFontDropdownOpen, setIsFontDropdownOpen] = useState(false);
  const themeDropdownRef = useRef<HTMLDivElement>(null);
  const fontDropdownRef = useRef<HTMLDivElement>(null);

  const [isGlassEffect, setIsGlassEffect] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [notificationTypes, setNotificationTypes] = useState({
    reminders: true,
    deadlines: true,
    messages: false,
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (themeDropdownRef.current && !themeDropdownRef.current.contains(event.target as Node)) {
        setIsThemeDropdownOpen(false);
      }
      if (fontDropdownRef.current && !fontDropdownRef.current.contains(event.target as Node)) {
        setIsFontDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
          {/* Theme Selector */}
          <div>
            <label className="block text-sm font-medium mb-3" style={{ color: 'var(--text-muted)' }}>Theme</label>
            <div className="relative" ref={themeDropdownRef}>
              <button
                onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all"
                style={{
                  backgroundColor: 'var(--input-bg)',
                  borderColor: 'var(--border-color)',
                }}
              >
                <i className={`${themes.find(t => t.id === theme)?.icon} text-lg`} style={{ color: themes.find(t => t.id === theme)?.color }}></i>
                <span style={{ color: 'var(--text-color)', flex: 1, textAlign: 'left' }}>{themes.find(t => t.id === theme)?.name}</span>
                <i className="fa-solid fa-chevron-down text-sm" style={{ color: 'var(--text-muted)' }}></i>
              </button>
              <div
                className="absolute top-full left-0 right-0 mt-2 rounded-xl overflow-hidden z-50 transition-all"
                style={{
                  backgroundColor: 'var(--card-bg)',
                  border: '1px solid var(--border-color)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                  opacity: isThemeDropdownOpen ? 1 : 0,
                  visibility: isThemeDropdownOpen ? 'visible' : 'hidden',
                  transform: isThemeDropdownOpen ? 'translateY(0)' : 'translateY(-10px)',
                }}
              >
                {themes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => { setTheme(t.id); setIsThemeDropdownOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 transition-colors"
                    style={{
                      backgroundColor: theme === t.id ? 'var(--accent-light)' : 'transparent',
                      color: 'var(--text-color)',
                    }}
                  >
                    <i className={t.icon} style={{ color: t.color }}></i>
                    <span>{t.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Font Selector */}
          <div>
            <label className="block text-sm font-medium mb-3" style={{ color: 'var(--text-muted)' }}>Font Style</label>
            <div className="relative" ref={fontDropdownRef}>
              <button
                onClick={() => setIsFontDropdownOpen(!isFontDropdownOpen)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all"
                style={{
                  backgroundColor: 'var(--input-bg)',
                  borderColor: 'var(--border-color)',
                }}
              >
                <i className={`${fonts.find(f => f.id === fontFamily)?.icon} text-lg`} style={{ color: 'var(--accent-color)' }}></i>
                <span style={{ color: 'var(--text-color)', flex: 1, textAlign: 'left' }}>{fonts.find(f => f.id === fontFamily)?.name}</span>
                <i className="fa-solid fa-chevron-down text-sm" style={{ color: 'var(--text-muted)' }}></i>
              </button>
              <div
                className="absolute top-full left-0 right-0 mt-2 rounded-xl overflow-hidden z-50 transition-all"
                style={{
                  backgroundColor: 'var(--card-bg)',
                  border: '1px solid var(--border-color)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                  opacity: isFontDropdownOpen ? 1 : 0,
                  visibility: isFontDropdownOpen ? 'visible' : 'hidden',
                  transform: isFontDropdownOpen ? 'translateY(0)' : 'translateY(-10px)',
                }}
              >
                {fonts.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => { setFontFamily(f.id); setIsFontDropdownOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 transition-colors"
                    style={{
                      backgroundColor: fontFamily === f.id ? 'var(--accent-light)' : 'transparent',
                      color: 'var(--text-color)',
                    }}
                  >
                    <i className={f.icon} style={{ color: 'var(--accent-color)' }}></i>
                    <span>{f.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
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



