# Study Mate - Your Personal Study Companion

<img width="1280" height="552" alt="Main" src="https://github.com/user-attachments/assets/7fc0e608-4bac-4280-bb6f-f1d797291e5f" />
 
Tired of juggling between different apps to manage your studies? Meet **Study Mate** - your all-in-one study management app that brings everything together in one beautiful interface.

## What is Study Mate?

Study Mate is a modern web application built to help students and learners stay organized, track their study time, manage subjects, and keep all their study materials in one place. Think of it as having a personal study assistant that never sleeps.

## Why Use Study Mate?

**Never Lose Track of Study Time** - The built-in timer automatically tracks how long you study. No more guessing how much you've studied this week.

**Everything in One Place** - Your notes, PDFs, timetable, and study sessions - all organized and easy to find.

**Beautiful & Easy on Eyes** - Multiple themes including dark mode. Study late at night without straining your eyes.

**See Your Progress** - Charts and analytics show you exactly how much you've studied and where you need to improve.

**Works Offline** - All your data stays on your device. No cloud, no accounts, no worries.

## What's Inside?

**Timer & Tracking**
- One-click start/stop timer
- Automatic session recording
- Total time calculation
- Weekly study summaries

**File Management**
- Upload PDFs, images, documents
- Organize in folders
- Persistent storage (IndexedDB)
- Quick preview

**Timetable**
- Weekly schedule builder
- Subject management
- Color coding

**RSS Feeds**
- Add your favorite education blogs
- Stay updated with latest content
- Read directly in the app

**Themes**
- Royal Purple (default)
- Catppuccin Blue
- Frappe Green
- Dark & Light modes

**PDF Viewer**
- Built-in document viewer
- No need to download

<img width="1920" height="1080" alt="Banner" src="https://github.com/user-attachments/assets/4901efb1-cd1b-42d2-83b1-47b8cb38c983" />

---

## How to Run

### 1. Get Requirements Ready

**Node.js:** Download from [nodejs.org](https://nodejs.org) (version 18 or higher)

**npm:** Comes with Node.js

Check if Node.js is installed:
```bash
node --version
```

### 2. Setup

```bash
# Clone the project
git clone https://github.com/RKStudios-hub/Study-Mate.git
cd Study-Mate

# Install dependencies
npm install
```

### 3. Run

```bash
npm run dev
```

### 4. Open in Browser

Go to `http://localhost:5173` in your browser.

That's it! You're ready to start studying.

---

## How to Use

### Timer
1. Click the timer on the dashboard
2. Click Start when you begin studying
3. Click Stop when done
4. Your session is automatically saved

### Adding Files
1. Go to Files section
2. Click Upload or drag & drop
3. Organize into folders
4. Files stay stored locally

### Creating Timetable
1. Go to Timetable
2. Add your subjects
3. Set schedule for each day
4. View your weekly plan

### Adding RSS Feeds
1. Go to Feed section
2. Click Add Feed
3. Paste RSS URL (e.g., `https://feeds.bbci.co.uk/news/rss.xml`)
4. Start reading!

### Changing Theme
1. Go to Settings
2. Select your theme
3. Toggle dark/light mode
4. Pick your favorite font

---

## Tech Details

### Built With
- React 18 + TypeScript
- Vite (fast build tool)
- Material-UI v7 (beautiful components)
- Tailwind CSS v4 (styling)
- IndexedDB (local storage)
- Recharts (charts)
- react-pdf + jsPDF (PDF handling)
- Framer Motion (smooth animations)

### Project Structure
```
Study-Mate/
├── src/
│   ├── app/pages/     # All page components
│   ├── styles/        # CSS files
│   ├── hooks/         # Custom hooks
│   ├── utils/        # Helper functions
│   └── types.ts      # TypeScript types
├── index.html
├── vite.config.ts
└── package.json
```

---

## Credits

**Made by:** RKStudios-hub

Built with ❤️ using React and open-source libraries.

For bugs or feature requests: https://github.com/RKStudios-hub/Study-Mate/issues
