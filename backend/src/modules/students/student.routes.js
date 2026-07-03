import { Router } from 'express';
import { ROLES } from '../../constants/roles.js';
import { authenticate, authorize } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import {
  createComplaint,
  createSupportTicket,
  createVisitor,
  dashboard,
  listComplaints,
  listDocuments,
  listNotices,
  listSupportTickets,
  listVisitors,
  myRoom,
  profile,
  rentPayments,
  updateProfile
} from './student.controller.js';
import { createComplaintSchema, createSupportTicketSchema, createVisitorSchema, updateProfileSchema } from './student.validation.js';

const router = Router();
router.use(authenticate, authorize(ROLES.STUDENT));
router.get('/dashboard', dashboard);
router.get('/my-room', myRoom);
router.get('/rent-payments', rentPayments);
router.get('/complaints', listComplaints);
router.post('/complaints', validate(createComplaintSchema), createComplaint);
router.get('/notices', listNotices);
router.get('/documents', listDocuments);
router.get('/visitors', listVisitors);
router.post('/visitors', validate(createVisitorSchema), createVisitor);
router.get('/profile', profile);
router.patch('/profile', validate(updateProfileSchema), updateProfile);
router.get('/support', listSupportTickets);
router.post('/support', validate(createSupportTicketSchema), createSupportTicket);

export default router;
