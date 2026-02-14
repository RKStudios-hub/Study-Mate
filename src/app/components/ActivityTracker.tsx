import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Timer } from './Timer';
import { useOutletContext } from 'react-router-dom';
import { OutletContext } from '../../types';


interface ActivityTrackerProps {
  weekData: Array<{ day: string; hours: number }>;
}

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
          <ResponsiveContainer width="100%" height={100}>
            <BarChart data={weekData}>
              <XAxis 
                dataKey="day" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'var(--text-muted)', fontSize: 10 }}
              />
              <YAxis hide />
              <Bar 
                dataKey="hours" 
                fill={`url(#barGradient-${theme})`}
                radius={[8, 8, 0, 0]}
              />
              <defs>
                <linearGradient id={`barGradient-${theme}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={accentColor} stopOpacity={0.8} />
                  <stop offset="100%" stopColor={accentColor} />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
