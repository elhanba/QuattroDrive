import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure db directory exists
const dbDir = path.join(__dirname);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Initialize SQLite Database
const dbPath = process.env.NODE_ENV === 'test' ? ':memory:' : path.join(dbDir, 'quattrodrive.db');
const db = new Database(dbPath, { verbose: process.env.NODE_ENV === 'test' ? undefined : console.log });

// Create Tables if they don't exist
const initDb = () => {
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS Users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const createCandidatesTable = `
    CREATE TABLE IF NOT EXISTS Candidates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      dob DATE NOT NULL,
      personal_id_number TEXT UNIQUE NOT NULL,
      address TEXT,
      phone_number TEXT,
      email TEXT,
      license_category TEXT NOT NULL,
      status TEXT DEFAULT 'In Progress',
      theory_test_passed BOOLEAN DEFAULT 0,
      practical_test_passed BOOLEAN DEFAULT 0,
      total_course_fee REAL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const createPaymentsTable = `
    CREATE TABLE IF NOT EXISTS Payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      candidate_id INTEGER NOT NULL,
      amount REAL NOT NULL,
      payment_date DATE NOT NULL,
      payment_method TEXT NOT NULL,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (candidate_id) REFERENCES Candidates (id) ON DELETE CASCADE
    );
  `;

  const createLessonsTable = `
    CREATE TABLE IF NOT EXISTS Lessons (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      candidate_id INTEGER NOT NULL,
      lesson_date DATE NOT NULL,
      instructor_name TEXT NOT NULL,
      duration_hours REAL NOT NULL,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (candidate_id) REFERENCES Candidates (id) ON DELETE CASCADE
    );
  `;

  db.exec(createUsersTable);
  db.exec(createCandidatesTable);
  db.exec(createPaymentsTable);
  db.exec(createLessonsTable);
  
  // Migration for lesson_time
  try {
    const tableInfo = db.prepare("PRAGMA table_info(Lessons)").all();
    const hasTimeColumn = tableInfo.some(col => col.name === 'lesson_time');
    if (!hasTimeColumn) {
      db.exec("ALTER TABLE Lessons ADD COLUMN lesson_time TEXT");
      console.log('Added lesson_time column to Lessons table');
    }
  } catch (err) {
    console.error('Migration error:', err);
  }
  
  console.log('Database initialized successfully.');
};

initDb();

export default db;
