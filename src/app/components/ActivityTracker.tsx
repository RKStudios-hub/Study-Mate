import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Timer } from './Timer';
import { useOutletContext } from 'react-router-dom';
import { OutletContext } from '../../types';


interface ActivityTrackerProps {
  weekData: Array<{ day: string; hours: number }>;
  // onTimeUpdate: (seconds: number) => void; // Removed, using global timer
}

export function ActivityTracker({ weekData }: ActivityTrackerProps) {
  const { timeStudied, formatTime, isRunning, onToggleTimer, onResetTimer } = useOutletContext<OutletContext>();

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
        className="absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-20"
        style={{ background: '#6D5BFF' }}
      />
      
      <div className="relative">
        <h3 className="text-slate-600 text-sm mb-4">Time Spent Studying today</h3>
        
        {/* Timer Component */}
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
          <h4 className="text-slate-600 text-xs mb-3">Weekly Progress</h4>
          <ResponsiveContainer width="100%" height={100}>
            <BarChart data={weekData}>
              <XAxis 
                dataKey="day" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 10 }}
              />
              <YAxis hide />
              <Bar 
                dataKey="hours" 
                fill="url(#barGradient)" 
                radius={[8, 8, 0, 0]}
              />
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8B7AFF" />
                  <stop offset="100%" stopColor="#6D5BFF" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}