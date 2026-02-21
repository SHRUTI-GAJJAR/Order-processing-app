
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: (process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000, // 15 mins default
  max: process.env.RATE_LIMIT_MAX || 100, // max requests per window
  message: 'Too many requests from this IP, please try again later.',
});

module.exports = limiter;
