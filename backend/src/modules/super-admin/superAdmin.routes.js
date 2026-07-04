import { Router } from 'express';
import { ROLES } from '../../constants/roles.js';
import { authenticate, authorize } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import {
  analytics,
  assignManager,
  auditLogs,
  complaintMonitoring,
  createGlobalNotice,
  createManager,
  createProperty,
  deleteProperty,
  disableManager,
  disableProperty,
  globalDashboard,
  listManagers,
  listProperties,
  noticeCenter,
  revenueCenter,
  settings,
  tenantMonitoring,
  updateProperty,
  updateSettings,
  uploadPropertyPhotos
} from './superAdmin.controller.js';
import { requireSuperAdminPermission, SUPER_ADMIN_PERMISSIONS } from './superAdmin.permissions.js';
import { handleUploadError, propertyPhotosUpload } from '../../middleware/upload.js';
import { assignManagerSchema, createGlobalNoticeSchema, createManagerSchema, createPropertySchema, settingsSchema, updatePropertySchema } from './superAdmin.validation.js';

const router = Router();
router.use(authenticate, authorize(ROLES.SUPER_ADMIN));
router.get('/dashboard', requireSuperAdminPermission(SUPER_ADMIN_PERMISSIONS.DASHBOARD_READ), globalDashboard);

router.get('/properties', requireSuperAdminPermission(SUPER_ADMIN_PERMISSIONS.PROPERTIES_MANAGE), listProperties);
router.post('/properties/photos', requireSuperAdminPermission(SUPER_ADMIN_PERMISSIONS.PROPERTIES_MANAGE), propertyPhotosUpload, handleUploadError, uploadPropertyPhotos);
router.post('/properties', requireSuperAdminPermission(SUPER_ADMIN_PERMISSIONS.PROPERTIES_MANAGE), validate(createPropertySchema), createProperty);
router.patch('/properties/:id', requireSuperAdminPermission(SUPER_ADMIN_PERMISSIONS.PROPERTIES_MANAGE), validate(updatePropertySchema), updateProperty);
router.post('/properties/:id/disable', requireSuperAdminPermission(SUPER_ADMIN_PERMISSIONS.PROPERTIES_MANAGE), disableProperty);
router.delete('/properties/:id', requireSuperAdminPermission(SUPER_ADMIN_PERMISSIONS.PROPERTIES_MANAGE), deleteProperty);

router.get('/revenue-center', requireSuperAdminPermission(SUPER_ADMIN_PERMISSIONS.REVENUE_READ), revenueCenter);
router.get('/tenants', requireSuperAdminPermission(SUPER_ADMIN_PERMISSIONS.TENANTS_READ), tenantMonitoring);

router.get('/managers', requireSuperAdminPermission(SUPER_ADMIN_PERMISSIONS.MANAGERS_MANAGE), listManagers);
router.post('/managers', requireSuperAdminPermission(SUPER_ADMIN_PERMISSIONS.MANAGERS_MANAGE), validate(createManagerSchema), createManager);
router.post('/managers/:id/assign', requireSuperAdminPermission(SUPER_ADMIN_PERMISSIONS.MANAGERS_MANAGE), validate(assignManagerSchema), assignManager);
router.post('/managers/:id/disable', requireSuperAdminPermission(SUPER_ADMIN_PERMISSIONS.MANAGERS_MANAGE), disableManager);

router.get('/notices', requireSuperAdminPermission(SUPER_ADMIN_PERMISSIONS.NOTICES_MANAGE), noticeCenter);
router.post('/notices', requireSuperAdminPermission(SUPER_ADMIN_PERMISSIONS.NOTICES_MANAGE), validate(createGlobalNoticeSchema), createGlobalNotice);

router.get('/complaints', requireSuperAdminPermission(SUPER_ADMIN_PERMISSIONS.COMPLAINTS_READ), complaintMonitoring);
router.get('/analytics', requireSuperAdminPermission(SUPER_ADMIN_PERMISSIONS.ANALYTICS_READ), analytics);
router.get('/audit-logs', requireSuperAdminPermission(SUPER_ADMIN_PERMISSIONS.AUDIT_LOGS_READ), auditLogs);
router.get('/settings', requireSuperAdminPermission(SUPER_ADMIN_PERMISSIONS.SETTINGS_MANAGE), settings);
router.patch('/settings', requireSuperAdminPermission(SUPER_ADMIN_PERMISSIONS.SETTINGS_MANAGE), validate(settingsSchema), updateSettings);

export default router;
