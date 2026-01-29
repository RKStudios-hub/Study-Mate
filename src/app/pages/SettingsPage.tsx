import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { OutletContext, RssFeed } from '../../types';
import { Plus, Edit, Trash2, Save } from 'lucide-react';
import SettingsSection from '../components/SettingsSection';

export default function SettingsPage() {
  const { rssFeeds, addRssFeed, updateRssFeed, deleteRssFeed, isDarkMode, setIsDarkMode } = useOutletContext<OutletContext>();
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
    <div className="px-4 py-4 bg-white dark:bg-dark-background">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-dark-text mb-6">Settings</h1>

      <SettingsSection title="Appearance">
        <div className="flex items-center justify-between">
          <span className="text-slate-600 dark:text-dark-text">Dark Mode</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={isDarkMode} onChange={() => {
              console.log('isDarkMode before:', isDarkMode);
              setIsDarkMode(!isDarkMode);
              console.log('isDarkMode after:', !isDarkMode);
            }} className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-600 dark:text-dark-text">Font Style</span>
          <select value={fontStyle} onChange={(e) => setFontStyle(e.target.value)} className="px-3 py-1 border rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-200 bg-white dark:bg-dark-card dark:text-dark-text">
            <option>Default</option>
            <option>Serif</option>
            <option>Monospace</option>
          </select>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-600 dark:text-dark-text">Glass Effect</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={isGlassEffect} onChange={() => setIsGlassEffect(!isGlassEffect)} className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
        </div>
      </SettingsSection>

      <SettingsSection title="Notifications">
        <div className="flex items-center justify-between">
          <span className="text-slate-600 dark:text-dark-text">Push Notifications</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={pushNotifications} onChange={() => setPushNotifications(!pushNotifications)} className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
        </div>
        <div>
          <span className="text-slate-600 dark:text-dark-text">Notification Types</span>
          <div className="flex flex-col gap-2 mt-2">
            <label className="flex items-center gap-2 dark:text-dark-text">
              <input type="checkbox" name="reminders" checked={notificationTypes.reminders} onChange={handleNotificationTypeChange} />
              Reminders
            </label>
            <label className="flex items-center gap-2 dark:text-dark-text">
              <input type="checkbox" name="deadlines" checked={notificationTypes.deadlines} onChange={handleNotificationTypeChange} />
              Deadlines
            </label>
            <label className="flex items-center gap-2 dark:text-dark-text">
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
              className="flex-1 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-200 bg-white dark:bg-dark-card dark:text-dark-text"
            />
            <input
              type="url"
              placeholder="Feed URL (e.g., https://www.example.com/rss)"
              value={newFeedUrl}
              onChange={(e) => setNewFeedUrl(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-200 bg-white dark:bg-dark-card dark:text-dark-text"
            />
            <button
              onClick={handleAddFeed}
              className="flex-shrink-0 bg-purple-500 text-white px-4 py-2 rounded-xl hover:bg-purple-600 transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={18} /> Add Feed
            </button>
          </div>

          {rssFeeds.length > 0 ? (
            <ul className="space-y-3 mt-4">
              {rssFeeds.map((feed) => (
                <li key={feed.id} className="flex flex-col sm:flex-row items-center gap-3 p-3 bg-gray-50 dark:bg-dark-card rounded-xl border border-gray-100 dark:border-slate-700">
                  {editingFeedId === feed.id ? (
                    <>
                      <input
                        type="text"
                        value={editingFeedName}
                        onChange={(e) => setEditingFeedName(e.target.value)}
                        className="flex-1 px-3 py-1 border rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-200 bg-white dark:bg-slate-700 dark:text-white"
                      />
                      <input
                        type="url"
                        value={editingFeedUrl}
                        onChange={(e) => setEditingFeedUrl(e.target.value)}
                        className="flex-1 px-3 py-1 border rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-200 bg-white dark:bg-slate-700 dark:text-white"
                      />
                      <button
                        onClick={() => handleSaveEdit(feed.id)}
                        className="flex-shrink-0 bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-1"
                      >
                        <Save size={16} /> Save
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="flex-1">
                        <p className="font-medium text-slate-700 dark:text-slate-200">{feed.name}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{feed.url}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditClick(feed)}
                          className="p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-slate-700 transition-colors"
                          title="Edit Feed"
                        >
                          <Edit size={18} className="text-blue-500 dark:text-blue-400" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(feed.id)}
                          className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-slate-700 transition-colors"
                          title="Delete Feed"
                        >
                          <Trash2 size={18} className="text-red-500 dark:text-red-400" />
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-500 dark:text-slate-400 text-center py-4">No RSS feeds added yet.</p>
          )}
        </div>
      </SettingsSection>

      <SettingsSection title="About">
        <div className="flex items-center justify-between">
          <span className="text-slate-600 dark:text-dark-text">App Information</span>
          <button className="text-purple-600 hover:underline">View</button>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-600 dark:text-dark-text">Send Feedback</span>
          <button className="text-purple-600 hover:underline">Send</button>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-600 dark:text-dark-text">Support</span>
          <button className="text-purple-600 hover:underline">Contact</button>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-600 dark:text-dark-text">Rate Us</span>
          <button className="text-purple-600 hover:underline">Rate</button>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-600 dark:text-dark-text">Languages</span>
          <button className="text-purple-600 hover:underline">Change</button>
        </div>
      </SettingsSection>
    </div>
  );
}



