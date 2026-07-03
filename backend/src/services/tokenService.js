import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { RefreshToken, hashRefreshToken } from '../models/RefreshToken.js';

export function signToken(user) {
  return jwt.sign({ sub: user._id, role: user.role }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
}

export function signRefreshToken(user) {
  return jwt.sign({ sub: user._id, type: 'refresh' }, env.jwtRefreshSecret, { expiresIn: env.jwtRefreshExpiresIn });
}

export async function issueTokenPair(user, req) {
  const token = signToken(user);
  const refreshToken = signRefreshToken(user);
  const decoded = jwt.decode(refreshToken);

  await RefreshToken.create({
    user: user._id,
    tokenHash: hashRefreshToken(refreshToken),
    expiresAt: new Date(decoded.exp * 1000),
    createdByIp: req?.ip,
    userAgent: req?.headers?.['user-agent']
  });

  return { token, refreshToken };
}

export async function rotateRefreshToken(refreshToken, req) {
  const payload = jwt.verify(refreshToken, env.jwtRefreshSecret);
  if (payload.type !== 'refresh') throw new Error('Invalid refresh token');

  const stored = await RefreshToken.findOne({ tokenHash: hashRefreshToken(refreshToken), revokedAt: { $exists: false }, expiresAt: { $gt: new Date() } }).populate('user');
  if (!stored || !stored.user || stored.user.status !== 'active') throw new Error('Refresh token is no longer valid');

  stored.revokedAt = new Date();
  stored.revokedByIp = req?.ip;
  await stored.save();

  return issueTokenPair(stored.user, req);
}

export async function revokeRefreshToken(refreshToken, req) {
  if (!refreshToken) return;
  await RefreshToken.findOneAndUpdate(
    { tokenHash: hashRefreshToken(refreshToken), revokedAt: { $exists: false } },
    { revokedAt: new Date(), revokedByIp: req?.ip }
  );
}
