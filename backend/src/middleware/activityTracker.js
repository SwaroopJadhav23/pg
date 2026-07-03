import { AuditLog } from '../models/Operations.js';

const trackedMethods = new Set(['POST', 'PATCH', 'PUT', 'DELETE']);

export function activityTracker(req, res, next) {
  if (!trackedMethods.has(req.method)) return next();

  res.on('finish', () => {
    if (!req.user || res.statusCode >= 400) return;
    AuditLog.create({
      actor: req.user._id,
      action: `${req.method} ${req.baseUrl}${req.route?.path || ''}`,
      entity: 'HttpActivity',
      entityId: req.params?.id,
      metadata: {
        requestId: req.id,
        statusCode: res.statusCode,
        bodyKeys: Object.keys(req.body || {})
      },
      ip: req.ip
    }).catch((error) => console.error('Activity tracking failed', error.message));
  });

  next();
}
