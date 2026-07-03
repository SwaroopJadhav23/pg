import { User } from '../../models/User.js';
import { Property } from '../../models/Property.js';
import { PlatformSetting } from '../../models/PlatformSetting.js';
import { AuditLog, Complaint, Expense, Notice, Rent, Room, Staff, Visitor } from '../../models/Operations.js';
import { ROLES } from '../../constants/roles.js';
import { created, success } from '../../utils/apiResponse.js';
import { AppError } from '../../utils/AppError.js';
import { paginate, regexSearch } from '../../utils/pagination.js';

async function audit(req, action, entity, entityId, metadata = {}) {
  await AuditLog.create({ actor: req.user._id, action, entity, entityId: String(entityId || ''), metadata, ip: req.ip });
}

async function propertyCards() {
  const properties = await Property.find().populate('manager', 'name email mobile').sort('-createdAt');
  const cards = [];

  for (const property of properties) {
    const [beds, occupied, revenue, pendingRent, complaints] = await Promise.all([
      Room.countDocuments({ property: property._id }),
      Room.countDocuments({ property: property._id, status: 'occupied' }),
      Rent.aggregate([{ $match: { property: property._id, status: 'paid' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
      Rent.aggregate([{ $match: { property: property._id, status: { $in: ['pending', 'generated', 'overdue'] } } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
      Complaint.countDocuments({ property: property._id, status: { $ne: 'resolved' } })
    ]);
    cards.push({
      ...property.toObject(),
      beds,
      occupiedBeds: occupied,
      availableBeds: Math.max((property.capacity || beds) - occupied, 0),
      occupancyRate: beds ? Math.round((occupied / beds) * 100) : 0,
      monthlyRevenue: revenue[0]?.total || 0,
      pendingRent: pendingRent[0]?.total || 0,
      openComplaints: complaints
    });
  }

  return cards;
}

export async function globalDashboard(req, res) {
  const [properties, rooms, beds, occupiedBeds, tenants, revenue, pendingRent, openComplaints, propertyPerformance, complaintAnalytics] = await Promise.all([
    Property.countDocuments(), Room.distinct('roomNumber'), Room.countDocuments(), Room.countDocuments({ status: 'occupied' }), User.countDocuments({ role: ROLES.STUDENT, status: 'active' }),
    Rent.aggregate([{ $match: { status: 'paid' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
    Rent.aggregate([{ $match: { status: { $in: ['pending', 'overdue', 'generated'] } } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
    Complaint.countDocuments({ status: { $ne: 'resolved' } }),
    propertyCards(),
    Complaint.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }])
  ]);
  success(res, {
    stats: { totalProperties: properties, totalRooms: rooms.length, totalBeds: beds, occupiedBeds, activeTenants: tenants, monthlyRevenue: revenue[0]?.total || 0, pendingRent: pendingRent[0]?.total || 0, openComplaints },
    propertyPerformance,
    complaintAnalytics,
    monthlyGrowth: [
      { name: 'Jan', value: 420000 }, { name: 'Feb', value: 470000 }, { name: 'Mar', value: 510000 },
      { name: 'Apr', value: 545000 }, { name: 'May', value: 590000 }, { name: 'Jun', value: revenue[0]?.total || 640000 }
    ]
  });
}

export async function createProperty(req, res) {
  const property = await Property.create(req.body);
  await audit(req, 'property.created', 'Property', property._id, { name: property.name });
  created(res, { property }, 'Property created');
}

export async function listProperties(req, res) {
  const properties = await propertyCards();
  success(res, { properties });
}

export async function updateProperty(req, res) {
  const property = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!property) throw new AppError('Property not found', 404);
  await audit(req, 'property.updated', 'Property', property._id);
  success(res, { property }, 'Property updated');
}

export async function disableProperty(req, res) {
  const property = await Property.findByIdAndUpdate(req.params.id, { status: 'disabled' }, { new: true });
  if (!property) throw new AppError('Property not found', 404);
  await audit(req, 'property.disabled', 'Property', property._id);
  success(res, { property }, 'Property disabled');
}

export async function createManager(req, res) {
  const manager = await User.create({ ...req.body, role: ROLES.ADMIN });
  if (req.body.property) await Property.findByIdAndUpdate(req.body.property, { manager: manager._id });
  await audit(req, 'manager.created', 'User', manager._id, { property: req.body.property });
  created(res, { manager }, 'Manager created');
}

export async function listManagers(req, res) {
  const managers = await User.find({ role: ROLES.ADMIN }).select('-password').populate('property', 'name city status').sort('-createdAt');
  success(res, { managers });
}

export async function assignManager(req, res) {
  const manager = await User.findOneAndUpdate({ _id: req.params.id, role: ROLES.ADMIN }, { property: req.body.propertyId, status: 'active' }, { new: true }).select('-password');
  if (!manager) throw new AppError('Manager not found', 404);
  await Property.findByIdAndUpdate(req.body.propertyId, { manager: manager._id });
  await audit(req, 'manager.assigned_property', 'User', manager._id, { propertyId: req.body.propertyId });
  success(res, { manager }, 'Manager assigned to property');
}

export async function disableManager(req, res) {
  const manager = await User.findOneAndUpdate({ _id: req.params.id, role: ROLES.ADMIN }, { status: 'inactive' }, { new: true }).select('-password');
  if (!manager) throw new AppError('Manager not found', 404);
  await audit(req, 'manager.disabled', 'User', manager._id);
  success(res, { manager }, 'Manager disabled');
}

export async function tenantMonitoring(req, res) {
  const search = regexSearch(req.query.search);
  const filter = { role: ROLES.STUDENT, ...(req.query.status ? { status: req.query.status } : {}) };
  if (search) filter.$or = [{ name: search }, { email: search }, { mobile: search }, { 'profile.roomNumber': search }];
  const { items, pagination } = await paginate(User.find(filter).select('-password').populate('property', 'name city').sort('-createdAt'), User.countDocuments(filter), req.query);
  const rentStatus = await Rent.aggregate([{ $group: { _id: '$tenant', latestStatus: { $last: '$status' }, totalDue: { $sum: { $cond: [{ $ne: ['$status', 'paid'] }, '$amount', 0] } } } }]);
  success(res, { tenants: items, rentStatus, pagination });
}

export async function revenueCenter(req, res) {
  const [totalRevenue, outstanding, propertyRevenue, expenses] = await Promise.all([
    Rent.aggregate([{ $match: { status: 'paid' } }, { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }]),
    Rent.aggregate([{ $match: { status: { $ne: 'paid' } } }, { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }]),
    Rent.aggregate([{ $group: { _id: '$property', total: { $sum: '$amount' }, paid: { $sum: { $cond: [{ $eq: ['$status', 'paid'] }, '$amount', 0] } } } }]),
    Expense.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }])
  ]);
  const total = totalRevenue[0]?.total || 0;
  const due = outstanding[0]?.total || 0;
  success(res, {
    metrics: { totalRevenue: total, collectionRate: total + due ? Math.round((total / (total + due)) * 100) : 0, outstandingAmount: due, profitEstimate: total - (expenses[0]?.total || 0) },
    propertyRevenue
  });
}

export async function complaintMonitoring(req, res) {
  const filter = { ...(req.query.status ? { status: req.query.status } : {}), ...(req.query.priority ? { priority: req.query.priority } : {}), ...(req.query.property ? { property: req.query.property } : {}) };
  const { items, pagination } = await paginate(Complaint.find(filter).populate('tenant', 'name profile').populate('property', 'name city').sort('-createdAt'), Complaint.countDocuments(filter), req.query);
  const filters = await Complaint.aggregate([{ $group: { _id: { status: '$status', priority: '$priority', property: '$property' }, count: { $sum: 1 } } }]);
  success(res, { complaints: items, filters, pagination });
}

export async function createGlobalNotice(req, res) {
  const propertyIds = req.body.propertyIds?.length ? req.body.propertyIds : [];
  const targets = propertyIds.length ? propertyIds : [undefined];
  const notices = await Promise.all(targets.map((property) => Notice.create({ title: req.body.title, body: req.body.body, audience: req.body.audience, property, scheduledAt: req.body.scheduledAt ? new Date(req.body.scheduledAt) : undefined, createdBy: req.user._id })));
  await audit(req, 'notice.global_created', 'Notice', notices.map((notice) => notice._id).join(','), { audience: req.body.audience, propertyIds });
  created(res, { notices }, 'Global notice created');
}

export async function noticeCenter(req, res) {
  const notices = await Notice.find().populate('property', 'name city').populate('createdBy', 'name role').sort('-createdAt');
  success(res, { notices });
}

export async function analytics(req, res) {
  const [propertyPerformance, complaints, occupancyTrends, revenueTrends, tenantRetention, staffCount, visitorCount] = await Promise.all([
    propertyCards(),
    Complaint.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    Room.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    Rent.aggregate([{ $group: { _id: '$month', total: { $sum: '$amount' } } }, { $sort: { _id: 1 } }]),
    User.aggregate([{ $match: { role: ROLES.STUDENT } }, { $group: { _id: '$status', count: { $sum: 1 } } }]),
    Staff.countDocuments(),
    Visitor.countDocuments()
  ]);
  success(res, {
    propertyPerformance,
    complaints,
    occupancyTrends,
    revenueTrends,
    tenantRetention,
    operational: { staffCount, visitorCount },
    insights: ['Revenue forecast is positive based on current paid rent.', 'Properties above 90% occupancy should plan capacity expansion.', 'Open complaint resolution time should be monitored weekly.'],
    exports: ['pdf', 'excel', 'csv']
  });
}

export async function auditLogs(req, res) {
  const search = regexSearch(req.query.search);
  const filter = {};
  if (req.query.action) filter.action = req.query.action;
  if (search) filter.$or = [{ action: search }, { entity: search }, { entityId: search }];
  const { items, pagination } = await paginate(AuditLog.find(filter).populate('actor', 'name role email').sort('-createdAt'), AuditLog.countDocuments(filter), { limit: 25, ...req.query });
  success(res, { logs: items, pagination });
}

export async function settings(req, res) {
  const setting = await PlatformSetting.findOneAndUpdate({ key: 'global' }, { key: 'global' }, { upsert: true, new: true, setDefaultsOnInsert: true });
  success(res, { setting });
}

export async function updateSettings(req, res) {
  const setting = await PlatformSetting.findOneAndUpdate({ key: 'global' }, { $set: req.body }, { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true });
  await audit(req, 'settings.updated', 'PlatformSetting', setting._id);
  success(res, { setting }, 'Settings updated');
}
