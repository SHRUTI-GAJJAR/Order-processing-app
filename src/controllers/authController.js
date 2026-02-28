const generateToken = require('../utils/generateToken');
const User = require('../models/User');
const { hashPassword, comparePassword } = require('../utils/hashPassword');
const crypto = require('crypto');
const { sendRegisterEmail , sendOtpEmail } = require('../services/emailService');

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

// =======================
// LOGOUT USER
// =======================
const logout = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Logout successful. Please remove token from client.',
  });
};

// =======================
// FORGOT PASSWORD
// =======================
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    await sendOtpEmail(user.email, otp);

    res.json({
      success: true,
      message: 'OTP sent to your email',
    });

  } catch (error) {
    next(error);
  }
};

// =======================
// RESET PASSWORD
// =======================
const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });

    if (!user.otp || user.otp !== otp)
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP',
      });

    if (user.otpExpiry < Date.now())
      return res.status(400).json({
        success: false,
        message: 'OTP expired',
      });

    const hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;

    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save();

    res.json({
      success: true,
      message: 'Password reset successfully',
    });

  } catch (error) {
    next(error);
  }
};

module.exports = { register, login , logout,forgotPassword, resetPassword };
