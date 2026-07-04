import { User } from '../../models/User.js';
import { Property } from '../../models/Property.js';
import { ROLES } from '../../constants/roles.js';
import { AppError } from '../../utils/AppError.js';
import { success } from '../../utils/apiResponse.js';
import { issueTokenPair, revokeRefreshToken, rotateRefreshToken } from '../../services/tokenService.js';

const PROPERTY_ADMIN_PASSWORD = 'admin123';

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function propertyAdminEmail(property) {
  const slug = property.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'property';
  return `${slug}.${property._id}@pg.admin`;
}

async function findUserByLogin(identifier) {
  const trimmed = identifier.trim();
  if (!trimmed) return null;

  let user = await User.findOne({ email: trimmed.toLowerCase() }).select('+password');
  if (user) return user;

  const property = await Property.findOne({
    $or: [
      { adminLoginId: { $regex: new RegExp(`^${escapeRegex(trimmed)}$`, 'i') } },
      { name: { $regex: new RegExp(`^${escapeRegex(trimmed)}$`, 'i') } }
    ]
  });
  if (!property) return null;

  return User.findOne({
    role: ROLES.ADMIN,
    property: property._id,
    status: 'active'
  }).select('+password');
}

function publicUser(user) {
  return { id: user._id, name: user.name, email: user.email, mobile: user.mobile, role: user.role, property: user.property, profile: user.profile };
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await findUserByLogin(email);
    if (!user || !(await user.comparePassword(password))) {
      throw new AppError('Invalid email, property name or password', 401);
    }
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
