import React, { useState, useEffect, useRef } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { OutletContext } from '../../types';
import { ArrowLeft } from 'lucide-react';
import { DeleteModal } from '../components/DeleteModal';
import './TimeTablePage.css';

interface task {
  id: string;
  title: string;
  day: string;
  s: number;
  e: number;
  color: string;
}

const daysOfWeek = [
  { f: "Monday", s: "MO" }, { f: "Tuesday", s: "TU" },
  { f: "Wednesday", s: "WE" }, { f: "Thursday", s: "TH" },
  { f: "Friday", s: "FR" }, { f: "Saturday", s: "SA" },
  { f: "Sunday", s: "SU" }
];

const colors = ["#a855f7", "#ec4899", "#6366f1", "#22c55e", "#06b6d4", "#f97316"];

const TimeTablePage: React.FC = () => {
  const { theme } = useOutletContext<OutletContext>();
  const [tasks, setTasks] = useState<task[]>(() => {
    const saved = localStorage.getItem("weeklyTasks");
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<task | null>(null);

  const titleRef = useRef<HTMLInputElement>(null);
  const dayRef = useRef<HTMLSelectElement>(null);
  const startRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem("weeklyTasks", JSON.stringify(tasks));
  }, [tasks]);

  const getAccentColor = () => {
    switch(theme) {
      case 'royal': return '#9d6dff';
      case 'catpuccin': return '#89b4fa';
      case 'frappe': return '#81c8be';
      default: return '#f472b6';
    }
  };

  const accentColor = getAccentColor();

  const toMin = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };

  const addTask = () => {
    if (titleRef.current?.value && startRef.current?.value && endRef.current?.value) {
      const newTask: task = {
        id: crypto.randomUUID(),
        title: titleRef.current.value,
        day: dayRef.current?.value || "Monday",
        s: toMin(startRef.current.value),
        e: toMin(endRef.current.value),
        color: selectedColor
      };
      setTasks([...tasks, newTask]);
      titleRef.current.value = "";
    }
  };

  const inputStyle = {
    backgroundColor: 'var(--input-bg)',
    color: 'var(--text-color)',
    border: '1px solid var(--border-color)',
    borderRadius: '0.5rem',
    padding: '0.5rem',
    width: '100%' as const,
  };

  const labelStyle = {
    color: 'var(--text-color)',
    display: 'block' as const,
    marginBottom: '0.25rem',
    fontSize: '0.875rem' as const,
  };

  return (
    <div className="time-table-container">
      <Link to="/" className="back-btn" style={{ color: 'var(--text-color)' }}>
        <ArrowLeft size={20} />
      </Link>
      <h1 style={{ color: 'var(--text-color)' }}>Time Table</h1>

      <div className="card form-card" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
        <label style={labelStyle}>Task Title</label>
        <input ref={titleRef} placeholder="e.g. Math Study" style={inputStyle} />
        
        <div className="form-row">
          <div>
            <label style={labelStyle}>Day</label>
            <select ref={dayRef} style={inputStyle}>
              {daysOfWeek.map(d => <option key={d.f} value={d.f}>{d.f}</option>)}
            </select>
          </div>
          <div className="palette-container">
            <label style={labelStyle}>Color</label>
            <div className="palette">
              {colors.map(c => (
                <div key={c} className={`dot ${selectedColor === c ? 'active' : ''}`}
                  style={{ background: c }} onClick={() => setSelectedColor(c)} />
              ))}
            </div>
          </div>
        </div>

        <div className="form-row">
          <input type="time" ref={startRef} style={inputStyle} />
          <input type="time" ref={endRef} style={inputStyle} />
        </div>
        <button className="add-btn" style={{ backgroundColor: accentColor }} onClick={addTask}>Add Task</button>
      </div>

      <div className="calendar-card" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
        <div className="scroll-viewport">
          <div className="calendar-grid">
            <div className="time-col">
              <div className="spacer" />
              {Array.from({ length: 25 }).map((_, h) => (
                <div key={h} className="t-slot" style={{ color: 'var(--text-muted)' }}>{h}:00</div>
              ))}
            </div>

            {daysOfWeek.map((day) => {
              const dayTasks = tasks.filter(t => t.day === day.f).sort((a, b) => a.s - b.s);
              return (
                <div key={day.f} className="day-col">
                  <div className="day-head" style={{ color: 'var(--text-color)' }}>{day.s}</div>
                  <div className="day-body">
                    {dayTasks.map(t => {
                      const overlaps = dayTasks.filter(ot => ot.id !== t.id && ot.s < t.e && ot.e > t.s);
                      const widthPct = 100 / (overlaps.length + 1);
                      const offsetIdx = overlaps.filter(ot => ot.s < t.s || (ot.s === t.s && ot.id < t.id)).length;

                      return (
                        <div key={t.id} className="task-plaque"
                          style={{
                            background: t.color,
                            top: `${t.s}px`,
                            height: `${t.e - t.s}px`,
                            width: `calc(${widthPct}% - 2px)`,
                            left: `${offsetIdx * widthPct}%`
                          }}
                          onContextMenu={(e) => { e.preventDefault(); setTaskToDelete(t); setShowDeleteConfirm(true); }}
                        >
                          <span className="vertical-text">{t.title}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {taskToDelete && (
        <DeleteModal isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)}
          onConfirm={() => { setTasks(tasks.filter(t => t.id !== taskToDelete.id)); setShowDeleteConfirm(false); }}
          fileName={taskToDelete.title} type="task" />
      )}
    </div>
  );
};

export default TimeTablePage;
