import { Play, Pause, RotateCcw } from 'lucide-react';

interface TimerProps {
  timeStudied: number;
  formatTime: (totalSeconds: number) => string;
  isRunning: boolean;
  onToggleTimer: () => void;
  onResetTimer: () => void;
}

export function Timer({ timeStudied, formatTime, isRunning, onToggleTimer, onResetTimer }: TimerProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div 
        className="text-5xl font-mono tracking-tight"
        style={{
          background: 'linear-gradient(135deg, #6D5BFF 0%, #8B7AFF 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 0 40px rgba(109, 91, 255, 0.3)',
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
              : 'linear-gradient(135deg, #6D5BFF 0%, #8B7AFF 100%)',
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
            background: 'rgba(148, 163, 184, 0.2)',
          }}
        >
          <RotateCcw className="w-5 h-5 text-slate-600" />
        </button>
      </div>
    </div>
  );
}
