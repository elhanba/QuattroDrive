import express from 'express';
import cors from 'cors';
import db from './db/init.js';
import bcrypt from 'bcrypt';
import authRoutes from './routes/auth.js';
import candidateRoutes from './routes/candidates.js';
import paymentRoutes from './routes/payments.js';
import lessonRoutes from './routes/lessons.js';
import dashboardRoutes from './routes/dashboard.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'QuattroDrive Backend is running!' });
});

app.use('/api/auth', authRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Seed Default Admin User
const seedAdmin = async () => {
  try {
    const adminExists = db.prepare('SELECT id FROM Users WHERE username = ?').get('admin');
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      db.prepare('INSERT INTO Users (username, password_hash) VALUES (?, ?)').run('admin', hashedPassword);
      console.log('Default admin user created: admin / admin123');
    }
  } catch (error) {
    console.error('Error seeding admin user:', error);
  }
};

// Start internal server
app.listen(PORT, async () => {
  await seedAdmin();
  console.log(`Express server is listening on port ${PORT}`);
});
