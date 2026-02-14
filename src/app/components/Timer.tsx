import { Play, Pause, RotateCcw } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { OutletContext } from '../../types';

interface TimerProps {
  timeStudied: number;
  formatTime: (totalSeconds: number) => string;
  isRunning: boolean;
  onToggleTimer: () => void;
  onResetTimer: () => void;
}

export function Timer({ timeStudied, formatTime, isRunning, onToggleTimer, onResetTimer }: TimerProps) {
  const { theme } = useOutletContext<OutletContext>();

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
    <div className="flex flex-col items-center gap-4">
      <div 
        className="text-5xl font-mono tracking-tight"
        style={{
          background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}cc 100%)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: `0 0 40px ${accentColor}50`,
        }}
      >
        {formatTime(timeStudied)}
      </div>
      
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleTimer}
          className="w-14 h-14 rounded-full flex items-center justify-center transition-all hover:shadow-lg active:scale-95"
          style={{
            background: isRunning 
              ? 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)'
              : `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}cc 100%)`,
          }}
        >
          {isRunning ? (
            <Pause className="w-6 h-6 text-white" fill="white" />
          ) : (
            <Play className="w-6 h-6 text-white ml-0.5" fill="white" />
          )}
        </button>
        
        <button
          onClick={onResetTimer}
          className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:shadow-lg active:scale-95"
          style={{
            background: 'var(--input-bg)',
          }}
        >
          <RotateCcw className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
        </button>
      </div>
    </div>
  );
}
