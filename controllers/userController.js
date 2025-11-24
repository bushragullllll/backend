import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import logger from '../config/logger.js';
import { sendWelcomeEmail } from '../utils/sendEmial.js'; // ✅ added
const generateToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, email, password, role });
    logger.info(`🟢 New user registered: ${email}`);

    // Send welcome email (persistent transporter ensures first-try success)
    sendWelcomeEmail(email, name); // no await needed for fast response

    // Auto-login: generate token and send response
    const token = generateToken(user.id, user.role);
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (error) {
    logger.error(`❌ Registration failed: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && await user.matchPassword(password)) {
      logger.info(`✅ Login success: ${email}`);
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user.id, user.role),
      });
    } else {
      logger.warn(`⚠️ Invalid login attempt for: ${email}`);
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    logger.error(`❌ Login failed: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all members
export const getMembers = async (req, res) => {
  try {
    const members = await User.find({ role: 'Member' }).select('name email');
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching members' });
  }
};
