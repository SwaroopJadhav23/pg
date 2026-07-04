import { Router } from 'express';
import { ROLES } from '../../constants/roles.js';
import { authenticate, authorize } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import {
  approveExpense,
  assignStaffTask,
  assignTenantToRoom,
  checkInVisitor,
  checkOutVisitor,
  createExpense,
  createNotice,
  createRoom,
  createStaff,
  createTenant,
  dashboard,
  deleteTenant,
  generateRent,
  listComplaints,
  listExpenses,
  listNotices,
  listRents,
  listRooms,
  listStaff,
  listTenants,
  listVisitors,
  markRentPaid,
  markStaffAttendance,
  reports,
  sendRentReminder,
  updateComplaint,
  updateRoom,
  updateTenant,
  uploadTenantPhoto,
  vacateRoom
} from './admin.controller.js';
import { ADMIN_PERMISSIONS, requireAdminPermission } from './admin.permissions.js';
import { handleUploadError, tenantPhotoUpload } from '../../middleware/upload.js';
import {
  assignRoomSchema,
  createExpenseSchema,
  createNoticeSchema,
  createRoomSchema,
  createStaffSchema,
  createTenantSchema,
  generateRentSchema,
  markRentPaidSchema,
  staffAttendanceSchema,
  staffTaskSchema,
  updateComplaintSchema,
  updateRoomSchema,
  updateTenantSchema,
  visitorActionSchema
} from './admin.validation.js';

const router = Router();
router.use(authenticate, authorize(ROLES.ADMIN));

router.get('/dashboard', requireAdminPermission(ADMIN_PERMISSIONS.DASHBOARD_READ), dashboard);

router.get('/tenants', requireAdminPermission(ADMIN_PERMISSIONS.TENANTS_MANAGE), listTenants);
router.post('/tenants/photo', requireAdminPermission(ADMIN_PERMISSIONS.TENANTS_MANAGE), tenantPhotoUpload, handleUploadError, uploadTenantPhoto);
router.post('/tenants', requireAdminPermission(ADMIN_PERMISSIONS.TENANTS_MANAGE), validate(createTenantSchema), createTenant);
router.patch('/tenants/:id', requireAdminPermission(ADMIN_PERMISSIONS.TENANTS_MANAGE), validate(updateTenantSchema), updateTenant);
router.delete('/tenants/:id', requireAdminPermission(ADMIN_PERMISSIONS.TENANTS_MANAGE), deleteTenant);

router.get('/rooms', requireAdminPermission(ADMIN_PERMISSIONS.ROOMS_MANAGE), listRooms);
router.post('/rooms', requireAdminPermission(ADMIN_PERMISSIONS.ROOMS_MANAGE), validate(createRoomSchema), createRoom);
router.patch('/rooms/:id', requireAdminPermission(ADMIN_PERMISSIONS.ROOMS_MANAGE), validate(updateRoomSchema), updateRoom);
router.post('/rooms/:id/assign', requireAdminPermission(ADMIN_PERMISSIONS.ROOMS_MANAGE), validate(assignRoomSchema), assignTenantToRoom);
router.post('/rooms/:id/vacate', requireAdminPermission(ADMIN_PERMISSIONS.ROOMS_MANAGE), vacateRoom);

router.get('/rents', requireAdminPermission(ADMIN_PERMISSIONS.RENT_MANAGE), listRents);
router.post('/rents', requireAdminPermission(ADMIN_PERMISSIONS.RENT_MANAGE), validate(generateRentSchema), generateRent);
router.post('/rents/:id/mark-paid', requireAdminPermission(ADMIN_PERMISSIONS.RENT_MANAGE), validate(markRentPaidSchema), markRentPaid);
router.post('/rents/:id/send-reminder', requireAdminPermission(ADMIN_PERMISSIONS.RENT_MANAGE), sendRentReminder);

router.get('/expenses', requireAdminPermission(ADMIN_PERMISSIONS.EXPENSES_MANAGE), listExpenses);
router.post('/expenses', requireAdminPermission(ADMIN_PERMISSIONS.EXPENSES_MANAGE), validate(createExpenseSchema), createExpense);
router.post('/expenses/:id/approve', requireAdminPermission(ADMIN_PERMISSIONS.EXPENSES_MANAGE), approveExpense);

router.get('/complaints', requireAdminPermission(ADMIN_PERMISSIONS.COMPLAINTS_MANAGE), listComplaints);
router.patch('/complaints/:id', requireAdminPermission(ADMIN_PERMISSIONS.COMPLAINTS_MANAGE), validate(updateComplaintSchema), updateComplaint);

router.get('/visitors', requireAdminPermission(ADMIN_PERMISSIONS.VISITORS_MANAGE), listVisitors);
router.post('/visitors/:id/check-in', requireAdminPermission(ADMIN_PERMISSIONS.VISITORS_MANAGE), validate(visitorActionSchema), checkInVisitor);
router.post('/visitors/:id/check-out', requireAdminPermission(ADMIN_PERMISSIONS.VISITORS_MANAGE), validate(visitorActionSchema), checkOutVisitor);

router.get('/staff', requireAdminPermission(ADMIN_PERMISSIONS.STAFF_MANAGE), listStaff);
router.post('/staff', requireAdminPermission(ADMIN_PERMISSIONS.STAFF_MANAGE), validate(createStaffSchema), createStaff);
router.post('/staff/:id/attendance', requireAdminPermission(ADMIN_PERMISSIONS.STAFF_MANAGE), validate(staffAttendanceSchema), markStaffAttendance);
router.post('/staff/:id/tasks', requireAdminPermission(ADMIN_PERMISSIONS.STAFF_MANAGE), validate(staffTaskSchema), assignStaffTask);

router.get('/notices', requireAdminPermission(ADMIN_PERMISSIONS.NOTICES_MANAGE), listNotices);
router.post('/notices', requireAdminPermission(ADMIN_PERMISSIONS.NOTICES_MANAGE), validate(createNoticeSchema), createNotice);

router.get('/reports', requireAdminPermission(ADMIN_PERMISSIONS.REPORTS_READ), reports);

export default router;
