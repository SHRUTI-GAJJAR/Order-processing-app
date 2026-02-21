const generateToken = require('../utils/generateToken');
const User = require('../models/User');
const { hashPassword, comparePassword } = require('../utils/hashPassword');
const { sendRegisterEmail } = require('../services/emailService');

// Secret key to allow admin creation (for testing)
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'myadminkey';

// =======================
// REGISTER USER
// =======================
const register = async (req, res, next) => {
  try {
    const { name, email, password, role, adminSecret } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user)
      return res
        .status(400)
        .json({ success: false, message: 'User already exists' });

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Determine role safely
    let finalRole = 'user';
    if (role === 'admin' && adminSecret === ADMIN_SECRET) {
      finalRole = 'admin';
    }

    // Create user
    user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: finalRole,
    });

    // ✅ SEND EMAIL ON REGISTER (Moved Here)
    await sendRegisterEmail(user.email, user.name);

    // Dynamic message based on role
    const message =
      finalRole === 'admin'
        ? 'Admin registered successfully'
        : 'User registered successfully';

    res.status(201).json({
      success: true,
      message,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};


// =======================
// LOGIN USER
// =======================
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: 'Invalid credentials' });

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ success: false, message: 'Invalid credentials' });

    const token = generateToken(user);

    // ❌ Email removed from login

    res.json({
      success: true,
      token,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login };
