import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { OutletContext } from '../../types';

interface NewsItem {
  id: string;
  title: string;
  link: string;
  description: string;
  pubDate: string;
}

export function NewsWidget() {
  const { rssFeeds } = useOutletContext<OutletContext>();
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const CORS_PROXY_URL = 'https://api.allorigins.win/raw?url=';

  const fetchRssFeeds = async () => {
    setLoading(true);
    setError(null);
    const allNews: NewsItem[] = [];

    for (const feed of rssFeeds) {
      try {
        const response = await fetch(CORS_PROXY_URL + encodeURIComponent(feed.url));
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, 'application/xml');

        const items = xmlDoc.querySelectorAll('item');
        items.forEach((item, index) => {
          const title = item.querySelector('title')?.textContent || 'No Title';
          const link = item.querySelector('link')?.textContent || '#';
          const description = item.querySelector('description')?.textContent || '';
          const pubDate = item.querySelector('pubDate')?.textContent || '';

          allNews.push({
            id: `${feed.id}-${index}`,
            title,
            link,
            description,
            pubDate,
          });
        });
      } catch (e: any) {
        console.error(`Failed to fetch RSS feed from ${feed.url}:`, e);
        setError(`Failed to load some news feeds. Please check URLs. ${e.message}`);
      }
    }
    // Sort news by date, newest first
    allNews.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
    setNewsItems(allNews);
    setLoading(false);
  };

  useEffect(() => {
    fetchRssFeeds();
  }, [rssFeeds]); // Refetch when rssFeeds change

  return (
    <div
      className="rounded-3xl p-6 relative overflow-hidden"
      style={{
        background: 'rgba(255, 255, 255, 0.4)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.5)',
        boxShadow: '0 8px 32px rgba(109, 91, 255, 0.1)',
      }}
    >
      {/* Glowing accent */}
      <div 
        className="absolute bottom-0 left-0 w-24 h-24 rounded-full blur-3xl opacity-20"
        style={{ background: '#FFC700' }} // A different accent color for differentiation
      />
      
      <div className="relative">
        <h3 className="text-slate-600 text-sm mb-4">Latest News</h3>
        
        {loading && <p className="text-slate-500 text-center py-4">Loading news...</p>}
        {error && <p className="text-red-500 text-center py-4">{error}</p>}

        {!loading && newsItems.length === 0 && rssFeeds.length > 0 && (
          <p className="text-slate-500 text-center py-4">No news found from your feeds.</p>
        )}
        {!loading && newsItems.length === 0 && rssFeeds.length === 0 && (
            <p className="text-slate-500 text-center py-4">Add RSS feeds in settings to see news here.</p>
        )}

        <div className="space-y-4">
          {newsItems.slice(0, 5).map(item => ( // Display top 5 news items
            <div key={item.id} className="pb-4 border-b border-slate-200 last:border-b-0">
              <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-slate-800 font-medium hover:text-purple-600 transition-colors">
                {item.title}
              </a>
              <p className="text-slate-500 text-sm mt-1 line-clamp-2">{item.description.replace(/(<([^>]+)>)/gi, "")}</p>
              <p className="text-slate-400 text-xs mt-1">{new Date(item.pubDate).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
