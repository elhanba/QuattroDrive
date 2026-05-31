import bcrypt from 'bcrypt';
import db from '../db/init.js';

export const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password are required' });
  }

  try {
    const user = db.prepare('SELECT * FROM Users WHERE username = ?').get(username);

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Since this is a completely offline desktop app running on localhost,
    // a simple token or session payload is sufficient. We will return the user info.
    // The frontend will track inactivity timeouts.
    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username
      },
      token: 'admin-local-token' // Placeholder for local session token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
