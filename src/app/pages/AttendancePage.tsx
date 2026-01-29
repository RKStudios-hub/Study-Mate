import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react'; // Import Search icon
import './AttendancePage.css';
import { DeleteModal } from '../components/DeleteModal'; // Reusing existing DeleteModal
import { CreateCourseModal } from '../components/CreateCourseModal'; // New: Import CreateCourseModal
import { useOutletContext } from 'react-router-dom';

// Replicating the vanilla JS data structure with React state
interface CourseRecord {
  [key: string]: 'present' | 'absent' | 'half' | undefined;
}

interface CourseData {
  records: CourseRecord;
  target: number; // New: target percentage
}

interface Store {
  [courseName: string]: CourseData;
}

const AttendancePage: React.FC = () => {
  const { isDarkMode } = useOutletContext();
  const [store, setStore] = useState<Store>(() => {
    const saved = localStorage.getItem("attendance");
    return saved ? JSON.parse(saved) : {};
  });
  const [currentCourse, setCurrentCourse] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedKey, setSelectedKey] = useState<string | null>(null); // For the day modal
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null); // New: for delete modal target
  const [isCreateCourseModalOpen, setIsCreateCourseModalOpen] = useState(false); // New state for CreateCourseModal

  const dayModalRef = useRef<HTMLDivElement>(null); // For the day modal
  const deleteModalRef = useRef<HTMLDivElement>(null); // For the delete course modal

  const holdRef = useRef<number | null>(null); // For long press timer

  const LONG_PRESS_DURATION = 500; // milliseconds

  // Function to save store to localStorage
  useEffect(() => {
    localStorage.setItem("attendance", JSON.stringify(store));
  }, [store]);

  useEffect(() => {
    if (isDarkMode) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = './AttendancePage.dark.css';
      document.head.appendChild(link);
      return () => {
        document.head.removeChild(link);
      };
    }
  }, [isDarkMode]);

  const keyToDate = (k: string): Date => {
    const [y, m, d] = k.split("-").map(Number);
    return new Date(y, m, d);
  };

  const today = (): Date => new Date();

  // STATS
  const getStats = (course: string) => {
    const records = store[course]?.records || {};
    const keys = Object.keys(records);
    if (!keys.length) return { p: 0, a: 0, h: 0, u: 0, percent: 0 };

    keys.sort((a, b) => keyToDate(a).getTime() - keyToDate(b).getTime());
    let d = new Date(keyToDate(keys[0]));
    const end = today();

    let p = 0, a = 0, h = 0, u = 0;

    for (; d <= end; d.setDate(d.getDate() + 1)) {
      const k = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      const v = records[k];
      if (v === "present") p++;
      else if (v === "absent") a++;
      else if (v === "half") h++;
      else u++;
    }

    const total = p + a + h + u;
    return { p, a, h, u, total, percent: total ? ((p + h * 0.5) / total * 100) : 0 };
  };

  // MAIN - Course List
  const renderCourseList = () => {
    const keys = Object.keys(store);
    return (
      <>
        {keys.map(c => {
          const s = getStats(c);
          const percentText = s.percent ? `${s.percent.toFixed(0)}%` : "";
          let pieBackground = "var(--grey)"; // Default background for no data

          if (s.total > 0) {
            const presentDeg = (s.p / s.total) * 360;
            const halfDayDeg = (s.h / s.total) * 360;
            const absentDeg = (s.a / s.total) * 360;

            const halfDayStart = presentDeg;
            const absentStart = presentDeg + halfDayDeg;
            const unmarkedStart = presentDeg + halfDayDeg + absentDeg;

            pieBackground = `conic-gradient(
              var(--green) 0deg ${presentDeg}deg,
              var(--orange) ${halfDayStart}deg ${halfDayStart + halfDayDeg}deg,
              var(--red) ${absentStart}deg ${absentStart + absentDeg}deg,
              var(--grey) ${unmarkedStart}deg 360deg
            )`;
          }

          const handleCoursePressStart = (event: React.MouseEvent | React.TouchEvent) => {
            holdRef.current = window.setTimeout(() => {
              setDeleteTarget(c);
              // Use our existing React DeleteModal instead of direct DOM manipulation
              // The DeleteModal component will be rendered conditionally outside
            }, LONG_PRESS_DURATION);
          };

          const handleCoursePressEnd = () => {
            if (holdRef.current) {
              clearTimeout(holdRef.current);
              holdRef.current = null;
            }
          };

          return (
            <div
              key={c}
              className="card course"
              onClick={() => {
                if (!holdRef.current) openCourse(c); // Only open if not a long press
              }}
              onMouseDown={handleCoursePressStart}
              onMouseUp={handleCoursePressEnd}
              onMouseLeave={handleCoursePressEnd}
              onTouchStart={handleCoursePressStart}
              onTouchEnd={handleCoursePressEnd}
            >
              <span>{c}</span>
              <div className="pie" style={{ background: pieBackground }}>{percentText}</div>
            </div>
          );
        })}
      </>
    );
  };

  const addCourse = () => {
    setIsCreateCourseModalOpen(true);
  };

  const handleCreateCourseConfirm = (name: string) => {
    if (!name || store[name]) {
        setIsCreateCourseModalOpen(false);
        alert('Course name is invalid or already exists!'); // Provide feedback
        return;
    }
    setStore(prevStore => ({
      ...prevStore,
      [name]: { records: {}, target: 75 } // New: default target
    }));
    setIsCreateCourseModalOpen(false); // Close modal after successful creation
  };

  const openCourse = (c: string) => {
    setCurrentCourse(c);
  };

  const goBack = () => {
    setCurrentCourse(null);
  };

  // CALENDAR
  const renderCalendarDays = () => {
    const days = [];
    const y = currentDate.getFullYear();
    const m = currentDate.getMonth();

    const firstDay = new Date(y, m, 1).getDay();
    const totalDays = new Date(y, m + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} />);
    }

    for (let d = 1; d <= totalDays; d++) {
      const key = `${y}-${m}-${d}`;
      const attendance = store[currentCourse!]?.records[key];
      
      days.push(
        <div
          key={key}
          className={`day ${attendance || ''}`}
          onClick={() => {
            setSelectedKey(key);
            if (dayModalRef.current) dayModalRef.current.style.display = "flex";
          }}
        >
          {d}
        </div>
      );
    }
    return days;
  };

  const mark = (val: 'present' | 'absent' | 'half' | null) => {
    if (!currentCourse || !selectedKey) return;

    setStore(prevStore => {
      const newStore = { ...prevStore };
      if (val) {
        newStore[currentCourse] = {
          ...newStore[currentCourse],
          records: {
            ...newStore[currentCourse].records,
            [selectedKey]: val
          }
        };
      } else {
        const { [selectedKey]: _, ...restRecords } = newStore[currentCourse].records;
        newStore[currentCourse] = {
          ...newStore[currentCourse],
          records: restRecords
        };
      }
      return newStore;
    });
    if (dayModalRef.current) dayModalRef.current.style.display = "none";
  };

  const changeMonth = (n: number) => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + n);
      return newDate;
    });
  };

  // UI - Summary and Bar
  const updateSummaryAndBar = () => {
    if (!currentCourse) return { summaryHTML: null, barWidth: 0, barBackground: "var(--grey)" };

    const { p, a, h, u, percent } = getStats(currentCourse);
    const target = store[currentCourse].target;

    const summaryHTML = (
      <>
        <div><span>Present</span><span>{p}</span></div>
        <div><span>Absent</span><span>{a}</span></div>
        <div><span>Half Day</span><span>{h}</span></div>
        <div><span>Unmarked</span><span>{u}</span></div>
        <div><strong>Percentage</strong><strong>{percent.toFixed(2)}%</strong></div>
      </>
    );

    const barWidth = Math.min(percent, 100);
    const barBackground = percent >= target ? "var(--green)" : "var(--red)";

    return { summaryHTML, barWidth, barBackground };
  };

  const { summaryHTML, barWidth, barBackground } = updateSummaryAndBar();

  // DELETE Course
  const deleteCourse = () => {
    if (deleteTarget) {
      setStore(prevStore => {
        const { [deleteTarget]: _, ...restStore } = prevStore;
        return restStore;
      });
      setDeleteTarget(null); // Clear delete target
      // closeModal
    }
  };

  // Day Modal close handler
  const closeDayModal = () => {
    if (dayModalRef.current) dayModalRef.current.style.display = "none";
    setSelectedKey(null);
  }


  return (
    <div className="app bg-white dark:bg-dark-background">
      {/* MAIN SCREEN (Course List) */}
      <div id="main" style={{ display: currentCourse ? "none" : "block" }}>
        <h2 className="header text-slate-800 dark:text-dark-text" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'}}>
          <Link to="/" className="attendance-back-button text-slate-800 dark:text-dark-text" style={{position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)'}}>
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <span>Attendance</span>
        </h2>
        <div id="courseList">
          {renderCourseList()}
        </div>
        <div id="empty" className="empty text-center py-12" style={{ display: Object.keys(store).length ? "none" : "block" }}>
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-dark-card flex items-center justify-center">
            <Search className="w-10 h-10 text-slate-400 dark:text-slate-500" />
          </div>
          <p className="text-slate-600 dark:text-slate-400 mb-2">No courses found</p>
          <p className="text-sm text-slate-500 dark:text-slate-500">Create a course to mark attendance</p>
        </div>
        <button className="add-btn bg-purple-600 dark:bg-dark-primary" onClick={addCourse}>＋ Add Course</button>
      </div>

      {/* ATTENDANCE SCREEN */}
      <div id="att" style={{ display: currentCourse ? "block" : "none" }}>
        <div className="top header text-slate-800 dark:text-dark-text"> {/* top div now acts as header */}
          {/* Back button */}
          <Link className="attendance-back-button text-slate-800 dark:text-dark-text" onClick={goBack}>
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h3 style={{flexGrow: 1, textAlign: "center", margin: 0}}>{currentCourse}</h3> {/* Centered title */}
        </div>
        <div className="card summary bg-white dark:bg-dark-card" id="summary">
          {summaryHTML}
        </div>

        {/* Target and Progress Bar */}
        <div className="card bg-white dark:bg-dark-card">
          Target: <span id="targetVal">{currentCourse ? store[currentCourse].target : ''}</span>%
          <input
            type="range"
            min="0"
            max="100"
            id="target"
            value={currentCourse ? store[currentCourse].target : 0}
            onChange={(e) => {
              if (currentCourse) {
                const newTarget = parseInt(e.target.value);
                setStore(prevStore => ({
                  ...prevStore,
                  [currentCourse]: { ...prevStore[currentCourse], target: newTarget }
                }));
              }
            }}
          />
          <div className="bar"><div className="bar-fill" style={{ width: `${barWidth}%`, background: barBackground }}></div></div>
        </div>

        {/* Calendar */}
        <div className="card calendar bg-white dark:bg-dark-card">
          <div className="month text-slate-800 dark:text-dark-text">
            <span onClick={() => changeMonth(-1)}>◀</span>
            <span id="monthYear">{currentDate.toLocaleString("default", { month: "long", year: "numeric" })}</span>
            <span onClick={() => changeMonth(1)}>▶</span>
          </div>
          <div className="days" id="days">
            {renderCalendarDays()}
          </div>
        </div>
      </div>

      {/* DAY MODAL */}
      <div className="modal" id="dayModal" ref={dayModalRef} style={{ display: selectedKey ? "flex" : "none" }} onClick={closeDayModal}>
        <div className="box bg-white dark:bg-dark-card" onClick={e => e.stopPropagation()}> {/* Prevent modal closing when clicking inside box */}
          <button style={{ background: "var(--green)", color: "white" }} onClick={() => mark('present')}>Present</button>
          <button style={{ background: "var(--red)", color: "white" }} onClick={() => mark('absent')}>Absent</button>
          <button style={{ background: "var(--orange)", color: "white" }} onClick={() => mark('half')}>Half Day</button>
          <button className="text-slate-800 dark:text-dark-text" onClick={() => mark(null)}>Clear</button>
        </div>
      </div>

      {/* DELETE COURSE MODAL (using our existing DeleteModal component) */}
      {deleteTarget && (
        <DeleteModal
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={deleteCourse}
          fileName={deleteTarget || ''}
          type="course" // New type for course deletion
        />
      )}

      {/* CREATE COURSE MODAL */}
      <CreateCourseModal
        isOpen={isCreateCourseModalOpen}
        onClose={() => setIsCreateCourseModalOpen(false)}
        onConfirm={handleCreateCourseConfirm}
      />
    </div>
  );
};

export default AttendancePage;