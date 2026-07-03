import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { AppError } from '../utils/AppError.js';

export async function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) throw new AppError('Authentication token required', 401);
    const token = header.split(' ')[1];
    const payload = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(payload.sub).select('-password');
    if (!user || user.status !== 'active') throw new AppError('User is not authorized', 401);
    req.user = user;
    next();
  } catch (error) {
    next(error.statusCode ? error : new AppError('Invalid or expired token', 401));
  }
}

export function authorize(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) return next(new AppError('Forbidden for this role', 403));
    next();
  };
}
