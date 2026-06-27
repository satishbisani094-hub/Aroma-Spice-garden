import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'aroma_spices_super_secret_jwt_key_2026';
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'password123';

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Check username
    if (username !== ADMIN_USER) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    // Verify password (supports plain text or bcrypt hashes in config)
    let isPasswordCorrect = false;
    if (ADMIN_PASS.startsWith('$2a$') || ADMIN_PASS.startsWith('$2b$')) {
      isPasswordCorrect = await bcrypt.compare(password, ADMIN_PASS);
    } else {
      isPasswordCorrect = (password === ADMIN_PASS);
    }

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { username, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '7d' } // token expires in 7 days
    );

    res.json({
      success: true,
      token,
      admin: { username }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error during login' });
  }
};
