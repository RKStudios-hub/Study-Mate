import { Home, Library, BarChart3, Settings, X, ListChecks, CalendarDays, User } from 'lucide-react';
import { Logo } from './Logo';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  theme: string;
}

export function Sidebar({ isOpen, onClose, theme }: SidebarProps) {

  const getSidebarGradient = () => {
    switch(theme) {
      case 'royal':
        return 'linear-gradient(180deg, #1a1a2e 0%, #2d2d4a 50%, #3d3d5c 100%)';
      case 'catpuccin':
        return 'linear-gradient(180deg, #1e1e2e 0%, #313244 50%, #45475a 100%)';
      case 'frappe':
        return 'linear-gradient(180deg, #303336 0%, #414559 50%, #51576d 100%)';
      default:
        return 'linear-gradient(180deg, #ec4899 0%, #f472b6 50%, #f9a8d4 100%)';
    }
  };

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
    { id: 'attendance', label: 'Attendance', icon: ListChecks, to: '/attendance' },
    { id: 'timetable', label: 'Time Table', icon: CalendarDays, to: '/timetable' },
    { id: 'profile', label: 'Profile', icon: User, to: '/profile' },
    { id: 'settings', label: 'Settings', icon: Settings, to: '/settings' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)' }}
          />
          
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed left-0 top-0 bottom-0 w-72 flex flex-col z-50"
            style={{
              background: getSidebarGradient(),
              backdropFilter: 'blur(10px)',
              boxShadow: `0 8px 32px ${accentColor}33`,
            }}
          >
            <div className="flex items-center justify-between px-4 py-6">
              <Logo />
              <button
                onClick={onClose}
                className="p-2 rounded-lg transition-colors"
                style={{ color: 'white' }}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
      
            <nav className="flex-1 px-3 py-4">
              {menuItems.map((item) => {
                const Icon = item.icon;
        
                return (
                  <NavLink
                    key={item.id}
                    to={item.to}
                    onClick={onClose}
                    className={({ isActive }) => 
                      `w-full flex items-center gap-3 px-4 py-3 mb-2 rounded-2xl transition-all duration-200 ` +
                      (isActive
                        ? 'bg-white/20 backdrop-blur-md border border-white/30'
                        : 'bg-transparent border border-transparent')
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-white/70'}`} />
                        <span className={`${isActive ? 'text-white font-medium' : 'text-white/70'}`}>
                          {item.label}
                        </span>
                      </>
                    )}
                  </NavLink>
                );
              })}
            </nav>

            <div className="p-4" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.2)' }}>
              <div className="flex items-center gap-3 px-3 py-2">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/30" style={{ backgroundColor: accentColor }}>
                  <div className="w-full h-full flex items-center justify-center text-white text-sm">
                    ?
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">Guest User</p>
                  <p className="text-white/60 text-xs">Sign in to save progress</p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
