import { Property } from '../../models/Property.js';
import { User } from '../../models/User.js';
import { Complaint, Document, Notice, Rent, Room, SupportTicket, Visitor } from '../../models/Operations.js';
import { success, created } from '../../utils/apiResponse.js';

export async function dashboard(req, res) {
  const [property, room, currentRent, rentHistory, activeComplaints, notices, visitorsThisMonth] = await Promise.all([
    Property.findById(req.user.property),
    Room.findOne({ tenant: req.user._id }).populate('property', 'name city address'),
    Rent.findOne({ tenant: req.user._id }).sort('-dueDate'),
    Rent.find({ tenant: req.user._id }).sort('-dueDate').limit(6),
    Complaint.find({ tenant: req.user._id, status: { $ne: 'resolved' } }).sort('-createdAt').limit(5),
    Notice.find({ $or: [{ audience: 'all_tenants' }, { property: req.user.property }] }).sort('-createdAt').limit(5),
    Visitor.countDocuments({
      tenant: req.user._id,
      createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
    })
  ]);

  success(res, {
    student: req.user,
    property,
    room,
    currentRent,
    rentHistory,
    activeComplaints,
    notices,
    visitorsThisMonth,
    stats: {
      currentRentStatus: currentRent?.status || 'not_generated',
      pendingAmount: currentRent && currentRent.status !== 'paid' ? currentRent.amount + (currentRent.lateFees || 0) : 0,
      nextDueDate: currentRent?.dueDate,
      activeComplaints: activeComplaints.length,
      visitorsThisMonth,
      noticesReceived: notices.length
    }
  });
}

export async function myRoom(req, res) {
  const room = await Room.findOne({ tenant: req.user._id }).populate('property', 'name city address amenities');
  success(res, { room, profile: req.user.profile });
}

export async function rentPayments(req, res) {
  const [currentRent, history] = await Promise.all([
    Rent.findOne({ tenant: req.user._id }).sort('-dueDate'),
    Rent.find({ tenant: req.user._id }).sort('-dueDate')
  ]);
  success(res, { currentRent, history });
}

export async function listComplaints(req, res) {
  const complaints = await Complaint.find({ tenant: req.user._id }).sort('-createdAt');
  success(res, { complaints });
}

export async function createComplaint(req, res) {
  const complaint = await Complaint.create({
    ...req.body,
    tenant: req.user._id,
    property: req.user.property,
    timeline: [{ status: 'open', note: 'Complaint created by student' }]
  });
  created(res, { complaint }, 'Complaint raised');
}

export async function listNotices(req, res) {
  const notices = await Notice.find({ $or: [{ audience: 'all_tenants' }, { property: req.user.property }] }).sort('-createdAt');
  success(res, { notices });
}

export async function listDocuments(req, res) {
  const documents = await Document.find({ tenant: req.user._id }).sort('-createdAt');
  success(res, { documents });
}

export async function listVisitors(req, res) {
  const visitors = await Visitor.find({ tenant: req.user._id }).sort('-createdAt');
  success(res, { visitors });
}

export async function createVisitor(req, res) {
  const expectedAt = new Date(`${req.body.visitDate}T${req.body.expectedTime}`);
  const visitor = await Visitor.create({
    ...req.body,
    visitDate: new Date(req.body.visitDate),
    expectedAt,
    tenant: req.user._id,
    property: req.user.property
  });
  created(res, { visitor }, 'Visitor request created');
}

export async function profile(req, res) {
  const student = await User.findById(req.user._id).select('-password').populate('property', 'name city address');
  success(res, { student });
}

export async function updateProfile(req, res) {
  const { name, mobile, ...profile } = req.body;
  const student = await User.findByIdAndUpdate(
    req.user._id,
    {
      ...(name ? { name } : {}),
      ...(mobile ? { mobile } : {}),
      $set: Object.fromEntries(Object.entries(profile).map(([key, value]) => [`profile.${key}`, value]))
    },
    { new: true, runValidators: true }
  ).select('-password');

  success(res, { student }, 'Profile updated');
}

export async function listSupportTickets(req, res) {
  const tickets = await SupportTicket.find({ tenant: req.user._id }).sort('-createdAt');
  success(res, { tickets });
}

export async function createSupportTicket(req, res) {
  const ticket = await SupportTicket.create({ ...req.body, tenant: req.user._id, property: req.user.property });
  created(res, { ticket }, 'Support ticket created');
}
