import { Timer } from './Timer';
import { useOutletContext } from 'react-router-dom';
import { OutletContext } from '../../types';

export function ActivityTracker({ weekData }: ActivityTrackerProps) {
  const { timeStudied, formatTime, isRunning, onToggleTimer, onResetTimer, theme } = useOutletContext<OutletContext>();

  const getThemeColor = () => {
    switch(theme) {
      case 'royal': return '#9d6dff';
      case 'catpuccin': return '#89b4fa';
      case 'frappe': return '#81c8be';
      default: return '#f472b6';
    }
  };

  const getGradientId = () => {
    return theme === 'kawaii' ? 'kawaii' : theme;
  };

  const gradientId = getGradientId();
  const accentColor = getThemeColor();

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
        className="absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-20"
        style={{ background: accentColor }}
      />
      
      <div className="relative">
        <h3 className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>Time Spent Studying today</h3>
        
        <div className="mb-6">
          <Timer 
            timeStudied={timeStudied}
            formatTime={formatTime}
            isRunning={isRunning}
            onToggleTimer={onToggleTimer}
            onResetTimer={onResetTimer}
          />
        </div>

        <div className="mt-6">
          <h4 className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>Weekly Progress</h4>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '8px', height: '120px', paddingLeft: '8px', paddingRight: '8px' }}>
            {weekData.map((dayData, index) => {
              const maxH = 7; // 7 hours = 100% dark
              const barHeight = Math.min((dayData.hours / maxH) * 100, 100);
              const colorIntensity = Math.min(dayData.hours / maxH, 1);
              
              // Create lighter to darker gradient based on hours
              const getColorWithOpacity = (baseColor: string, intensity: number) => {
                // Convert hex to rgba with opacity based on intensity
                const hex = baseColor.replace('#', '');
                const r = parseInt(hex.substring(0, 2), 16);
                const g = parseInt(hex.substring(2, 4), 16);
                const b = parseInt(hex.substring(4, 6), 16);
                // Minimum opacity 0.3 for visibility, max 1.0
                const opacity = 0.3 + (intensity * 0.7);
                return `rgba(${r}, ${g}, ${b}, ${opacity})`;
              };
              
              return (
                <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
                  <div 
                    style={{ 
                      width: '100%',
                      height: `${Math.max(barHeight, 5)}%`,
                      minHeight: barHeight > 0 ? '8px' : '2px',
                      background: getColorWithOpacity(accentColor, colorIntensity),
                      borderTopLeftRadius: '6px',
                      borderTopRightRadius: '6px',
                      position: 'relative'
                    }}
                  >
                    {dayData.hours > 0 && (
                      <span style={{ position: 'absolute', top: '-16px', left: '50%', transform: 'translateX(-50%)', fontSize: '10px', fontWeight: 'bold', color: accentColor, whiteSpace: 'nowrap' }}>
                        {dayData.hours.toFixed(1)}h
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>{dayData.day}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
