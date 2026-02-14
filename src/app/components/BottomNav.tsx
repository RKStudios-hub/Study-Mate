import { Home, Rss, BarChart3, Settings } from 'lucide-react';
import { NavLink } from 'react-router-dom';

interface BottomNavProps {
  theme: string;
}

export function BottomNav({ theme }: BottomNavProps) {

  const getAccentColor = () => {
    switch(theme) {
      case 'royal': return '#9d6dff';
      case 'catpuccin': return '#89b4fa';
      case 'frappe': return '#81c8be';
      default: return '#f472b6';
    }
  };

  const accentColor = getAccentColor();

  const menuItems = [
    { id: 'dashboard', label: 'Home', icon: Home, to: '/' },
    { id: 'feed', label: 'Feed', icon: Rss, to: '/feed' },
    { id: 'analytics', label: 'Stats', icon: BarChart3, to: '/analytics' },
    { id: 'settings', label: 'Settings', icon: Settings, to: '/settings' },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 pb-safe"
      style={{
        background: 'var(--card-bg)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid var(--border-color)',
        boxShadow: '0 -4px 16px rgba(0, 0, 0, 0.1)',
      }}
    >
      <div className="flex items-center justify-around px-2 py-2">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.id}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all min-w-0 flex-1 ` +
                (isActive ? '' : 'bg-transparent')
              }
              style={({ isActive }) => ({
                backgroundColor: isActive ? `${accentColor}15` : 'transparent',
              })}
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className="w-5 h-5 flex-shrink-0"
                    style={{ color: isActive ? accentColor : 'var(--text-muted)' }}
                  />
                  <span
                    className="text-xs font-medium truncate w-full text-center"
                    style={{ color: isActive ? accentColor : 'var(--text-muted)' }}
                  >
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
