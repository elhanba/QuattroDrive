# QuattroDrive

A modern driving school management app. We're building this to help local driving instructors keep track of candidates, schedule lessons, and generate official printable PDFs for the ministry. 

## Stack
- Frontend: React + Vite (Vanilla CSS for styling, no tailwind bs)
- Backend: Express.js
- Database: SQLite (better-sqlite3)
- Wrapped in Electron so it can run as a standalone desktop app!

## Setup

1. `npm install`
2. `npm run dev`

The dev script starts both the backend API and the Vite frontend concurrently. Make sure port 3001 and 5173 are free.

## Features (WIP)
- **Dashboard**: Quick metrics, today's schedule, and alerts for unpaid candidates.
- **Candidates**: Add/edit profiles, track theory/practical test progress.
- **Lessons & Payments**: Log driving hours (calculates Category B 35hr limits) and track remaining balances.
- **Docs**: Auto-generates Prilog 3, 4, and 5 for the ministry directly to PDF.

---
Built by the crew.
