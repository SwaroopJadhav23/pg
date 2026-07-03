import { User } from '../../models/User.js';
import { AuditLog, Complaint, Expense, Notice, Rent, Room, Staff, Visitor } from '../../models/Operations.js';
import { ROLES } from '../../constants/roles.js';
import { created, success } from '../../utils/apiResponse.js';
import { AppError } from '../../utils/AppError.js';
import { paginate, regexSearch } from '../../utils/pagination.js';

function propertyScope(req) {
  return req.user.property ? { property: req.user.property } : {};
}

async function audit(req, action, entity, entityId, metadata = {}) {
  await AuditLog.create({ actor: req.user._id, action, entity, entityId: String(entityId || ''), metadata, ip: req.ip });
}

export async function dashboard(req, res) {
  const scope = propertyScope(req);
  const rentMatch = req.user.property ? { property: req.user.property } : {};
  const [tenants, occupiedBeds, vacantBeds, revenue, pendingRent, overdueRent, openComplaints, visitors, staffCount, recentRents, complaintsByStatus, expensesByCategory] = await Promise.all([
    User.countDocuments({ role: ROLES.STUDENT, ...scope }),
    Room.countDocuments({ status: 'occupied', ...scope }),
    Room.countDocuments({ status: 'vacant', ...scope }),
    Rent.aggregate([{ $match: { status: 'paid', ...rentMatch } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
    Rent.aggregate([{ $match: { status: { $in: ['pending', 'generated'] }, ...rentMatch } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
    Rent.aggregate([{ $match: { status: 'overdue', ...rentMatch } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
    Complaint.countDocuments({ status: { $ne: 'resolved' }, ...scope }),
    Visitor.countDocuments(scope),
    Staff.countDocuments(scope),
    Rent.find(rentMatch).populate('tenant', 'name profile.roomNumber').sort('-createdAt').limit(8),
    Complaint.aggregate([{ $match: scope }, { $group: { _id: '$status', count: { $sum: 1 } } }]),
    Expense.aggregate([{ $match: rentMatch }, { $group: { _id: '$category', total: { $sum: '$amount' } } }])
  ]);

  success(res, {
    stats: {
      totalTenants: tenants,
      occupiedBeds,
      vacantBeds,
      monthlyRevenue: revenue[0]?.total || 0,
      pendingRent: pendingRent[0]?.total || 0,
      overdueRent: overdueRent[0]?.total || 0,
      openComplaints,
      totalVisitors: visitors,
      staffCount
    },
    recentRents,
    complaintsByStatus,
    expensesByCategory
  });
}

export async function createTenant(req, res) {
  const tenant = await User.create({ ...req.body, role: ROLES.STUDENT, property: req.user.property });
  await audit(req, 'tenant.created', 'User', tenant._id, { email: tenant.email });
  created(res, { tenant }, 'Tenant created');
}

export async function listTenants(req, res) {
  const search = regexSearch(req.query.search);
  const filter = { role: ROLES.STUDENT, ...propertyScope(req), ...(req.query.status ? { status: req.query.status } : {}) };
  if (search) filter.$or = [{ name: search }, { email: search }, { mobile: search }, { 'profile.roomNumber': search }];
  const { items, pagination } = await paginate(User.find(filter).select('-password').sort('-createdAt'), User.countDocuments(filter), req.query);
  success(res, { tenants: items, pagination });
}

export async function updateTenant(req, res) {
  const tenant = await User.findOneAndUpdate({ _id: req.params.id, role: ROLES.STUDENT, ...propertyScope(req) }, req.body, { new: true, runValidators: true }).select('-password');
  if (!tenant) throw new AppError('Tenant not found', 404);
  await audit(req, 'tenant.updated', 'User', tenant._id);
  success(res, { tenant }, 'Tenant updated');
}

export async function deleteTenant(req, res) {
  const tenant = await User.findOneAndUpdate({ _id: req.params.id, role: ROLES.STUDENT, ...propertyScope(req) }, { status: 'inactive' }, { new: true }).select('-password');
  if (!tenant) throw new AppError('Tenant not found', 404);
  await Room.updateMany({ tenant: tenant._id, ...propertyScope(req) }, { $unset: { tenant: '' }, status: 'vacant' });
  await audit(req, 'tenant.deactivated', 'User', tenant._id);
  success(res, { tenant }, 'Tenant deactivated');
}

export async function listRooms(req, res) {
  const search = regexSearch(req.query.search);
  const filter = { ...propertyScope(req), ...(req.query.status ? { status: req.query.status } : {}) };
  if (search) filter.$or = [{ floor: search }, { roomNumber: search }, { bedNumber: search }, { roomType: search }];
  const { items, pagination } = await paginate(Room.find(filter).populate('tenant', 'name email mobile profile').sort('floor roomNumber bedNumber'), Room.countDocuments(filter), req.query);
  success(res, { rooms: items, pagination });
}

export async function createRoom(req, res) {
  const room = await Room.create({ ...req.body, property: req.user.property || req.body.property });
  await audit(req, 'room.created', 'Room', room._id);
  created(res, { room }, 'Room created');
}

export async function updateRoom(req, res) {
  const room = await Room.findOneAndUpdate({ _id: req.params.id, ...propertyScope(req) }, req.body, { new: true, runValidators: true });
  if (!room) throw new AppError('Room not found', 404);
  await audit(req, 'room.updated', 'Room', room._id);
  success(res, { room }, 'Room updated');
}

export async function assignTenantToRoom(req, res) {
  const tenant = await User.findOne({ _id: req.body.tenantId, role: ROLES.STUDENT, ...propertyScope(req) });
  if (!tenant) throw new AppError('Tenant not found for this property', 404);
  const room = await Room.findOneAndUpdate({ _id: req.params.id, ...propertyScope(req) }, { tenant: tenant._id, status: 'occupied' }, { new: true });
  if (!room) throw new AppError('Room not found', 404);
  tenant.profile = { ...tenant.profile, floorNumber: room.floor, roomNumber: room.roomNumber, bedNumber: room.bedNumber, roomType: room.roomType, sharingDetails: room.sharingDetails };
  await tenant.save();
  await audit(req, 'room.tenant_assigned', 'Room', room._id, { tenantId: tenant._id });
  success(res, { room }, 'Tenant assigned to bed');
}

export async function vacateRoom(req, res) {
  const room = await Room.findOneAndUpdate({ _id: req.params.id, ...propertyScope(req) }, { $unset: { tenant: '' }, status: 'vacant' }, { new: true });
  if (!room) throw new AppError('Room not found', 404);
  await audit(req, 'room.vacated', 'Room', room._id);
  success(res, { room }, 'Bed marked vacant');
}

export async function listRents(req, res) {
  const filter = { ...propertyScope(req), ...(req.query.status ? { status: req.query.status } : {}) };
  const { items, pagination } = await paginate(Rent.find(filter).populate('tenant', 'name email mobile profile').sort('-dueDate'), Rent.countDocuments(filter), req.query);
  success(res, { rents: items, pagination });
}

export async function generateRent(req, res) {
  const tenant = await User.findOne({ _id: req.body.tenantId, role: ROLES.STUDENT, ...propertyScope(req) });
  if (!tenant) throw new AppError('Tenant not found for this property', 404);
  const rent = await Rent.create({
    tenant: tenant._id,
    property: req.user.property,
    month: req.body.month,
    amount: req.body.amount,
    dueDate: new Date(req.body.dueDate),
    lateFees: req.body.lateFees,
    status: 'generated'
  });
  await audit(req, 'rent.generated', 'Rent', rent._id, { tenantId: tenant._id });
  created(res, { rent }, 'Rent generated');
}

export async function markRentPaid(req, res) {
  const rent = await Rent.findOneAndUpdate(
    { _id: req.params.id, ...propertyScope(req) },
    { method: req.body.method, paidAt: req.body.paidAt ? new Date(req.body.paidAt) : new Date(), transactionRef: req.body.transactionRef, receiptUrl: `/receipts/${req.params.id}.pdf`, status: 'paid' },
    { new: true, runValidators: true }
  );
  if (!rent) throw new AppError('Rent record not found', 404);
  await audit(req, 'rent.marked_paid', 'Rent', rent._id);
  success(res, { rent }, 'Rent marked paid');
}

export async function sendRentReminder(req, res) {
  const rent = await Rent.findOne({ _id: req.params.id, ...propertyScope(req) }).populate('tenant', 'name email mobile');
  if (!rent) throw new AppError('Rent record not found', 404);
  await audit(req, 'rent.reminder_sent', 'Rent', rent._id, { tenant: rent.tenant?.email });
  success(res, { rent }, 'Rent reminder queued');
}

export async function listExpenses(req, res) {
  const filter = { ...propertyScope(req), ...(req.query.category ? { category: req.query.category } : {}), ...(req.query.status ? { status: req.query.status } : {}) };
  const { items, pagination } = await paginate(Expense.find(filter).populate('approvedBy', 'name').sort('-expenseDate'), Expense.countDocuments(filter), req.query);
  success(res, { expenses: items, pagination });
}

export async function createExpense(req, res) {
  const expense = await Expense.create({ ...req.body, property: req.user.property, expenseDate: req.body.expenseDate ? new Date(req.body.expenseDate) : new Date() });
  await audit(req, 'expense.created', 'Expense', expense._id);
  created(res, { expense }, 'Expense added');
}

export async function approveExpense(req, res) {
  const expense = await Expense.findOneAndUpdate({ _id: req.params.id, ...propertyScope(req) }, { status: 'approved', approvedBy: req.user._id }, { new: true });
  if (!expense) throw new AppError('Expense not found', 404);
  await audit(req, 'expense.approved', 'Expense', expense._id);
  success(res, { expense }, 'Expense approved');
}

export async function listComplaints(req, res) {
  const filter = { ...propertyScope(req), ...(req.query.status ? { status: req.query.status } : {}), ...(req.query.priority ? { priority: req.query.priority } : {}) };
  const { items, pagination } = await paginate(Complaint.find(filter).populate('tenant', 'name mobile profile').sort('-createdAt'), Complaint.countDocuments(filter), req.query);
  success(res, { complaints: items, pagination });
}

export async function updateComplaint(req, res) {
  const update = {};
  if (req.body.assignedTo) update.assignedTo = req.body.assignedTo;
  if (req.body.status) update.status = req.body.status;
  const complaint = await Complaint.findOneAndUpdate(
    { _id: req.params.id, ...propertyScope(req) },
    { ...update, $push: { timeline: { status: req.body.status || 'assigned', note: req.body.note || 'Updated by admin' } } },
    { new: true }
  );
  if (!complaint) throw new AppError('Complaint not found', 404);
  await audit(req, 'complaint.updated', 'Complaint', complaint._id, update);
  success(res, { complaint }, 'Complaint updated');
}

export async function listVisitors(req, res) {
  const filter = { ...propertyScope(req), ...(req.query.status ? { status: req.query.status } : {}) };
  const { items, pagination } = await paginate(Visitor.find(filter).populate('tenant', 'name mobile profile').sort('-createdAt'), Visitor.countDocuments(filter), req.query);
  success(res, { visitors: items, pagination });
}

export async function checkInVisitor(req, res) {
  const visitor = await Visitor.findOneAndUpdate({ _id: req.params.id, ...propertyScope(req) }, { checkIn: new Date(), status: 'checked_in' }, { new: true });
  if (!visitor) throw new AppError('Visitor not found', 404);
  await audit(req, 'visitor.checked_in', 'Visitor', visitor._id);
  success(res, { visitor }, 'Visitor checked in');
}

export async function checkOutVisitor(req, res) {
  const visitor = await Visitor.findOneAndUpdate({ _id: req.params.id, ...propertyScope(req) }, { checkOut: new Date(), status: 'checked_out' }, { new: true });
  if (!visitor) throw new AppError('Visitor not found', 404);
  await audit(req, 'visitor.checked_out', 'Visitor', visitor._id);
  success(res, { visitor }, 'Visitor checked out');
}

export async function listStaff(req, res) {
  const filter = { ...propertyScope(req), ...(req.query.role ? { role: req.query.role } : {}), ...(req.query.status ? { status: req.query.status } : {}) };
  const { items, pagination } = await paginate(Staff.find(filter).sort('role name'), Staff.countDocuments(filter), req.query);
  success(res, { staff: items, pagination });
}

export async function createStaff(req, res) {
  const staff = await Staff.create({ ...req.body, property: req.user.property });
  await audit(req, 'staff.created', 'Staff', staff._id);
  created(res, { staff }, 'Staff member created');
}

export async function markStaffAttendance(req, res) {
  const staff = await Staff.findOneAndUpdate(
    { _id: req.params.id, ...propertyScope(req) },
    { $push: { attendance: { date: req.body.date ? new Date(req.body.date) : new Date(), status: req.body.status } } },
    { new: true }
  );
  if (!staff) throw new AppError('Staff member not found', 404);
  await audit(req, 'staff.attendance_marked', 'Staff', staff._id);
  success(res, { staff }, 'Attendance marked');
}

export async function assignStaffTask(req, res) {
  const staff = await Staff.findOneAndUpdate(
    { _id: req.params.id, ...propertyScope(req) },
    { $push: { tasks: { title: req.body.title, dueDate: req.body.dueDate ? new Date(req.body.dueDate) : undefined } } },
    { new: true }
  );
  if (!staff) throw new AppError('Staff member not found', 404);
  await audit(req, 'staff.task_assigned', 'Staff', staff._id);
  success(res, { staff }, 'Task assigned');
}

export async function createNotice(req, res) {
  const notice = await Notice.create({ ...req.body, property: req.user.property, scheduledAt: req.body.scheduledAt ? new Date(req.body.scheduledAt) : undefined, createdBy: req.user._id });
  await audit(req, 'notice.created', 'Notice', notice._id);
  created(res, { notice }, 'Notice created');
}

export async function listNotices(req, res) {
  const filter = { ...propertyScope(req), ...(req.query.audience ? { audience: req.query.audience } : {}) };
  const { items, pagination } = await paginate(Notice.find(filter).sort('-createdAt'), Notice.countDocuments(filter), req.query);
  success(res, { notices: items, pagination });
}

export async function reports(req, res) {
  const scope = propertyScope(req);
  const [occupancy, revenue, rentCollection, expenseReport, tenantReport, auditLogs] = await Promise.all([
    Room.aggregate([{ $match: scope }, { $group: { _id: '$status', count: { $sum: 1 } } }]),
    Rent.aggregate([{ $match: scope }, { $group: { _id: '$status', total: { $sum: '$amount' }, count: { $sum: 1 } } }]),
    Rent.find(scope).populate('tenant', 'name profile.roomNumber').sort('-dueDate').limit(50),
    Expense.aggregate([{ $match: scope }, { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } }]),
    User.find({ role: ROLES.STUDENT, ...scope }).select('name email mobile status profile').sort('name'),
    AuditLog.find({ actor: req.user._id }).sort('-createdAt').limit(50)
  ]);
  success(res, { occupancy, revenue, rentCollection, expenseReport, tenantReport, auditLogs, exports: ['pdf', 'excel'] });
}
