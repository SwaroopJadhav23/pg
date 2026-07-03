import { ROLES } from '../../constants/roles.js';
import { AppError } from '../../utils/AppError.js';

export const SUPER_ADMIN_PERMISSIONS = {
  DASHBOARD_READ: 'super.dashboard.read',
  PROPERTIES_MANAGE: 'super.properties.manage',
  REVENUE_READ: 'super.revenue.read',
  TENANTS_READ: 'super.tenants.read',
  MANAGERS_MANAGE: 'super.managers.manage',
  NOTICES_MANAGE: 'super.notices.manage',
  COMPLAINTS_READ: 'super.complaints.read',
  ANALYTICS_READ: 'super.analytics.read',
  AUDIT_LOGS_READ: 'super.audit_logs.read',
  SETTINGS_MANAGE: 'super.settings.manage'
};

export function requireSuperAdminPermission(permission) {
  return (req, res, next) => {
    if (req.user.role !== ROLES.SUPER_ADMIN) return next(new AppError('Only owners can access Super Admin Portal APIs', 403));
    req.permission = permission;
    next();
  };
}
