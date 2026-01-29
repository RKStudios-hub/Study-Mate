
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from "./app/components/Layout";
// Import all page components directly
import Dashboard from './app/pages/Dashboard';
import TimeTablePage from './app/pages/TimeTablePage';
import AttendancePage from './app/pages/AttendancePage'; // Import the new AttendancePage
import FeedPage from './app/pages/FeedPage'; // Import the new FeedPage

// Placeholder components for other routes
import ProfilePage from './app/pages/ProfilePage'; // Assuming a ProfilePage exists or will be created
import SettingsPage from './app/pages/SettingsPage';

import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/*" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="attendance" element={<AttendancePage />} />
        <Route path="timetable" element={<TimeTablePage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="feed" element={<FeedPage />} />
      </Route>
    </Routes>
  </BrowserRouter>
);