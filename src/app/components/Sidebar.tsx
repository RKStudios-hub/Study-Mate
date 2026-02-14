import { Home, Library, BarChart3, Settings, X, ListChecks, CalendarDays, User } from 'lucide-react';
import { Logo } from './Logo';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
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
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />
          
          {/* Sidebar Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed left-0 top-0 bottom-0 w-72 flex flex-col z-50"
            style={{
              background: 'linear-gradient(180deg, #5B4BA8 0%, #6D5BFF 50%, #8B7AFF 100%)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(109, 91, 255, 0.2)',
            }}
          >
            <div className="flex items-center justify-between px-4 py-6">
              <Logo />
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
      
            <nav className="flex-1 px-3 py-4">
              {menuItems.map((item) => {
                const Icon = item.icon;
          
                return (
                  <NavLink
                    key={item.id}
                    to={item.to}
                    onClick={onClose} // Close sidebar on navigation
                    className={({ isActive }) => 
                      `w-full flex items-center gap-3 px-4 py-3 mb-2 rounded-2xl transition-all duration-200 ` +
                      (isActive
                        ? 'bg-white/20 backdrop-blur-md border border-white/30'
                        : 'bg-transparent border border-transparent')
                    }
                  >
                    {({ isActive }) => ( // Using render prop for styling
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

            {/* Profile Section */}
            <div className="p-4 border-t border-white/20">
              <div className="flex items-center gap-3 px-3 py-2">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/30 bg-gray-600">
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