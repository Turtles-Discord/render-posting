import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many auth attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false
});

export const tokenLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // Limit each IP to 50 token operations per hour
  message: 'Too many token operations, please try again later'
}); 