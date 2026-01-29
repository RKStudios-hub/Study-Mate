import { Home, Rss, BarChart3, Settings } from 'lucide-react';
import { NavLink } from 'react-router-dom';

interface BottomNavProps {
  // activeTab and setActiveTab are no longer needed as NavLink handles active states
}

export function BottomNav({}: BottomNavProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Home', icon: Home, to: '/' },
    { id: 'feed', label: 'Feed', icon: Rss, to: '/feed' },
    { id: 'analytics', label: 'Stats', icon: BarChart3, to: '/analytics' }, // Assuming analytics route
    { id: 'settings', label: 'Settings', icon: Settings, to: '/settings' },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 pb-safe"
      style={{
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.5)',
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
                (isActive ? 'bg-purple-100' : 'bg-transparent')
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className="w-5 h-5 flex-shrink-0"
                    style={{ color: isActive ? '#6D5BFF' : '#94a3b8' }}
                  />
                  <span
                    className="text-xs font-medium truncate w-full text-center"
                    style={{ color: isActive ? '#6D5BFF' : '#94a3b8' }}
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
