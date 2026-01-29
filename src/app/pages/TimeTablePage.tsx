import React, { useState, useEffect, useRef } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { OutletContext } from '../../types';
import { ArrowLeft } from 'lucide-react';
import { DeleteModal } from '../components/DeleteModal';
import './TimeTablePage.css';

interface Task {
  id: string;
  title: string;
  day: string;
  s: number; // start minute
  e: number; // end minute
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
  const { isDarkMode } = useOutletContext<OutletContext>();
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem("weeklyTasks");
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const titleRef = useRef<HTMLInputElement>(null);
  const dayRef = useRef<HTMLSelectElement>(null);
  const startRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem("weeklyTasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    if (isDarkMode) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = './TimeTablePage.dark.css';
      document.head.appendChild(link);
      return () => {
        document.head.removeChild(link);
      };
    }
  }, [isDarkMode]);

  const toMin = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };

  const addTask = () => {
    if (titleRef.current?.value && startRef.current?.value && endRef.current?.value) {
      const newTask: Task = {
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

  return (
    <div className="time-table-container bg-white dark:bg-dark-background">
      <Link to="/" className="back-btn text-slate-800 dark:text-dark-text"><ArrowLeft size={20} /></Link>
      <h1 className="text-slate-800 dark:text-dark-text">Time Table</h1>

      <div className="card form-card bg-white dark:bg-dark-card">
        <label className="text-slate-700 dark:text-dark-text">Task Title</label>
        <input ref={titleRef} placeholder="e.g. Math Study" className="bg-slate-100 dark:bg-dark-background dark:text-dark-text" />
        
        <div className="form-row">
          <div>
            <label className="text-slate-700 dark:text-dark-text">Day</label>
            <select ref={dayRef} className="bg-slate-100 dark:bg-dark-background dark:text-dark-text">
              {daysOfWeek.map(d => <option key={d.f} value={d.f}>{d.f}</option>)}
            </select>
          </div>
          <div className="palette-container">
            <label className="text-slate-700 dark:text-dark-text">Color</label>
            <div className="palette">
              {colors.map(c => (
                <div key={c} className={`dot ${selectedColor === c ? 'active' : ''}`}
                  style={{ background: c }} onClick={() => setSelectedColor(c)} />
              ))}
            </div>
          </div>
        </div>

        <div className="form-row">
          <input type="time" ref={startRef} className="bg-slate-100 dark:bg-dark-background dark:text-dark-text" />
          <input type="time" ref={endRef} className="bg-slate-100 dark:bg-dark-background dark:text-dark-text" />
        </div>
        <button className="add-btn bg-purple-600 dark:bg-dark-primary" onClick={addTask}>Add Task</button>
      </div>

      <div className="calendar-card bg-white dark:bg-dark-card">
        <div className="scroll-viewport">
          <div className="calendar-grid">
            <div className="time-col">
              <div className="spacer" />
              {Array.from({ length: 25 }).map((_, h) => (
                <div key={h} className="t-slot text-slate-500 dark:text-slate-400">{h}:00</div>
              ))}
            </div>

            {daysOfWeek.map((day) => {
              const dayTasks = tasks.filter(t => t.day === day.f).sort((a, b) => a.s - b.s);
              return (
                <div key={day.f} className="day-col">
                  <div className="day-head text-slate-700 dark:text-dark-text">{day.s}</div>
                  <div className="day-body">
                    {dayTasks.map(t => {
                      // Calculate overlaps for side-by-side positioning
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