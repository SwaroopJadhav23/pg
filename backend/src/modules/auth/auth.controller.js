import { User } from '../../models/User.js';
import { AppError } from '../../utils/AppError.js';
import { success } from '../../utils/apiResponse.js';
import { issueTokenPair, revokeRefreshToken, rotateRefreshToken } from '../../services/tokenService.js';
import { seedDemoUsers } from '../../utils/seedDemoData.js';

function publicUser(user) {
  return { id: user._id, name: user.name, email: user.email, mobile: user.mobile, role: user.role, property: user.property, profile: user.profile };
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) throw new AppError('Invalid email or password', 401);
    const tokens = await issueTokenPair(user, req);
    success(res, { ...tokens, user: publicUser(user) }, 'Login successful');
  } catch (error) { next(error); }
}

export async function me(req, res) {
  success(res, { user: publicUser(req.user) });
}

export async function refresh(req, res, next) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw new AppError('Refresh token required', 401);
    const tokens = await rotateRefreshToken(refreshToken, req);
    success(res, tokens, 'Token refreshed');
  } catch (error) {
    next(new AppError('Invalid or expired refresh token', 401));
  }
}

export async function logout(req, res, next) {
  try {
    await revokeRefreshToken(req.body.refreshToken, req);
    success(res, {}, 'Logged out');
  } catch (error) { next(error); }
}

export async function seed(req, res, next) {
  try {
    const data = await seedDemoUsers();
    success(res, data, 'Demo users seeded');
  } catch (error) { next(error); }
}
