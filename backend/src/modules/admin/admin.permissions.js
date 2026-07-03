import { ROLES } from '../../constants/roles.js';
import { AppError } from '../../utils/AppError.js';

export const ADMIN_PERMISSIONS = {
  DASHBOARD_READ: 'admin.dashboard.read',
  TENANTS_MANAGE: 'admin.tenants.manage',
  ROOMS_MANAGE: 'admin.rooms.manage',
  RENT_MANAGE: 'admin.rent.manage',
  EXPENSES_MANAGE: 'admin.expenses.manage',
  COMPLAINTS_MANAGE: 'admin.complaints.manage',
  VISITORS_MANAGE: 'admin.visitors.manage',
  STAFF_MANAGE: 'admin.staff.manage',
  NOTICES_MANAGE: 'admin.notices.manage',
  REPORTS_READ: 'admin.reports.read'
};

export function requireAdminPermission(permission) {
  return (req, res, next) => {
    if (req.user.role !== ROLES.ADMIN) return next(new AppError('Only PG caretakers/managers can access Admin Portal APIs', 403));
    req.permission = permission;
    next();
  };
}
