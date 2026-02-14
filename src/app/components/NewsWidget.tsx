import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { OutletContext } from '../../types';

interface NewsItem {
  id: string;
  title: string;
  link: string;
  description: string;
  pubDate: string;
  image: string | null;
  source: string;
}

export function NewsWidget() {
  const { rssFeeds } = useOutletContext<OutletContext>();
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const CORS_PROXY_URL = 'https://api.rss2json.com/v1/api.json?rss_url=';

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
        const data = await response.json();
        
        if (data.status !== 'ok') {
          throw new Error('Failed to parse RSS feed');
        }
        
        data.items.forEach((item: any, index: number) => {
          let imageUrl = 
            item.thumbnail || 
            item.enclosure?.link ||
            (item.categories && item.categories.find((c: string) => c.startsWith('http'))) ||
            null;
          
          if (!imageUrl && item.description) {
            const imgMatch = item.description.match(/<img[^>]+src=["']([^"']+)["']/i);
            if (imgMatch) imageUrl = imgMatch[1];
          }
          
          if (!imageUrl && item.content) {
            const imgMatch = item.content.match(/<img[^>]+src=["']([^"']+)["']/i);
            if (imgMatch) imageUrl = imgMatch[1];
          }
          
          if (!imageUrl && item.content_snippet) {
            const imgMatch = item.content_snippet.match(/<img[^>]+src=["']([^"']+)["']/i);
            if (imgMatch) imageUrl = imgMatch[1];
          }
          
          allNews.push({
            id: `${feed.id}-${index}`,
            title: item.title || 'No Title',
            link: item.link || '#',
            description: item.description || item.content || '',
            pubDate: item.pubDate || '',
            image: imageUrl,
            source: feed.name,
          });
        });
      } catch (e: any) {
        console.error(`Failed to fetch RSS feed from ${feed.url}:`, e);
      }
    }
    
    if (allNews.length === 0 && rssFeeds.length > 0) {
      setError('Failed to load news. Please check your feed URLs.');
    }
    
    allNews.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
    setNewsItems(allNews);
    setLoading(false);
  };

  useEffect(() => {
    fetchRssFeeds();
  }, [rssFeeds]);

  return (
    <div
      className="rounded-3xl p-6 relative overflow-hidden"
      style={{
        background: 'var(--card-bg)',
        backdropFilter: 'blur(20px)',
        border: '1px solid var(--border-color)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      }}
    >
      <div 
        className="absolute bottom-0 left-0 w-24 h-24 rounded-full blur-3xl opacity-20"
        style={{ background: 'var(--accent-color)' }}
      />
      
      <div className="relative">
        <h3 className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>Latest News</h3>
        
        {loading && <p className="text-center py-4" style={{ color: 'var(--text-muted)' }}>Loading news...</p>}
        {error && <p className="text-center py-4" style={{ color: 'var(--destructive)' }}>{error}</p>}

        {!loading && newsItems.length === 0 && rssFeeds.length > 0 && (
          <p className="text-center py-4" style={{ color: 'var(--text-muted)' }}>No news found from your feeds.</p>
        )}
        {!loading && newsItems.length === 0 && rssFeeds.length === 0 && (
            <p className="text-center py-4" style={{ color: 'var(--text-muted)' }}>Add RSS feeds in settings to see news here.</p>
        )}

        <div className="space-y-4">
          {newsItems.slice(0, 5).map(item => (
            <div key={item.id} className="pb-4 border-b last:border-b-0" style={{ borderColor: 'var(--border-color)' }}>
              {item.image && (
                <div className="mb-3 rounded-xl overflow-hidden h-40">
                  <img 
                    src={item.image} 
                    alt="" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ color: 'var(--accent-color)', backgroundColor: 'var(--accent-light)' }}>
                  {item.source}
                </span>
              </div>
              <a href={item.link} target="_blank" rel="noopener noreferrer" className="font-medium hover:opacity-80 transition-opacity block" style={{ color: 'var(--text-color)' }}>
                {item.title}
              </a>
              <p className="text-sm mt-1 line-clamp-2" style={{ color: 'var(--text-muted)' }}>{item.description.replace(/(<([^>]+)>)/gi, "")}</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{new Date(item.pubDate).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
