import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'All fields required' });

    const nameTrim = String(name).trim();
    if (nameTrim.length < 2) return res.status(400).json({ message: 'Name too short' });
    if (String(password).length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });

    const emailLc = String(email).trim().toLowerCase();
    const existing = await User.findOne({ email: emailLc });
    if (existing) return res.status(400).json({ message: 'Email already in use' });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await User.create({ name: nameTrim, email: emailLc, phone: phone || '', password: hash });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({ token, user: { _id: user._id, name: user.name, email: user.email, phone: user.phone || '', createdAt: user.createdAt } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'All fields required' });

    const emailLc = String(email).trim().toLowerCase();
    const user = await User.findOne({ email: emailLc });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { _id: user._id, name: user.name, email: user.email, phone: user.phone || '', createdAt: user.createdAt } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/me', auth, async (req, res) => {
  try {
    const updates = {};
    const { name, email, phone, password } = req.body || {};

    if (name) {
      const nameTrim = String(name).trim();
      if (nameTrim.length < 2) return res.status(400).json({ message: 'Name too short' });
      updates.name = nameTrim;
    }

    if (email) {
      const emailLc = String(email).trim().toLowerCase();
      const existing = await User.findOne({ email: emailLc, _id: { $ne: req.userId } });
      if (existing) return res.status(400).json({ message: 'Email already in use' });
      updates.email = emailLc;
    }

    if (phone !== undefined) {
      updates.phone = String(phone || '');
    }

    if (password) {
      if (String(password).length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(password, salt);
    }

    const user = await User.findByIdAndUpdate(req.userId, { $set: updates }, { returnDocument: 'after' }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
