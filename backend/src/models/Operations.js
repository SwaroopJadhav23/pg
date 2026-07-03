import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  floor: String,
  roomNumber: String,
  bedNumber: String,
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['occupied', 'vacant', 'reserved', 'maintenance'], default: 'vacant' },
  rent: Number,
  roomType: String,
  sharingDetails: String,
  amenities: [String]
}, { timestamps: true });
roomSchema.index({ property: 1, status: 1 });
roomSchema.index({ property: 1, floor: 1, roomNumber: 1, bedNumber: 1 });
export const Room = mongoose.model('Room', roomSchema);

const rentSchema = new mongoose.Schema({
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  month: String,
  amount: Number,
  dueDate: Date,
  paidAt: Date,
  method: { type: String, enum: ['cash', 'upi', 'bank_transfer'] },
  lateFees: { type: Number, default: 0 },
  receiptUrl: String,
  transactionRef: String,
  status: { type: String, enum: ['generated', 'paid', 'pending', 'overdue'], default: 'generated' }
}, { timestamps: true });
rentSchema.index({ property: 1, status: 1, dueDate: -1 });
rentSchema.index({ tenant: 1, dueDate: -1 });
export const Rent = mongoose.model('Rent', rentSchema);

const complaintSchema = new mongoose.Schema({
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
  category: String,
  priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
  description: String,
  photoUrl: String,
  assignedTo: String,
  status: { type: String, enum: ['open', 'assigned', 'in_progress', 'resolved'], default: 'open' },
  timeline: [{ status: String, note: String, at: { type: Date, default: Date.now } }]
}, { timestamps: true });
complaintSchema.index({ property: 1, status: 1, priority: 1 });
complaintSchema.index({ tenant: 1, createdAt: -1 });
export const Complaint = mongoose.model('Complaint', complaintSchema);

const noticeSchema = new mongoose.Schema({
  title: String,
  body: String,
  audience: { type: String, enum: ['all_tenants', 'property', 'floor', 'room', 'managers'], default: 'all_tenants' },
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
  floor: String,
  roomNumber: String,
  scheduledAt: Date,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });
noticeSchema.index({ property: 1, audience: 1, createdAt: -1 });
export const Notice = mongoose.model('Notice', noticeSchema);

const visitorSchema = new mongoose.Schema({
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
  name: String,
  mobile: String,
  relation: String,
  purpose: String,
  visitDate: Date,
  expectedTime: String,
  expectedAt: Date,
  checkIn: Date,
  checkOut: Date,
  status: { type: String, enum: ['requested', 'approved', 'checked_in', 'checked_out', 'rejected'], default: 'requested' }
}, { timestamps: true });
visitorSchema.index({ property: 1, status: 1, createdAt: -1 });
visitorSchema.index({ tenant: 1, createdAt: -1 });
export const Visitor = mongoose.model('Visitor', visitorSchema);

const documentSchema = new mongoose.Schema({
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
  title: { type: String, required: true },
  type: { type: String, enum: ['rent_agreement', 'aadhaar', 'pan', 'receipt', 'other'], default: 'other' },
  fileUrl: { type: String, required: true },
  mimeType: String,
  size: Number,
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isShareable: { type: Boolean, default: true }
}, { timestamps: true });
documentSchema.index({ tenant: 1, type: 1 });
export const Document = mongoose.model('Document', documentSchema);

const supportTicketSchema = new mongoose.Schema({
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
  subject: { type: String, required: true },
  category: { type: String, enum: ['billing', 'room', 'complaint', 'document', 'visitor', 'general'], default: 'general' },
  channel: { type: String, enum: ['portal', 'chat', 'whatsapp'], default: 'portal' },
  message: { type: String, required: true },
  status: { type: String, enum: ['open', 'waiting', 'resolved'], default: 'open' },
  replies: [{ senderRole: String, message: String, at: { type: Date, default: Date.now } }]
}, { timestamps: true });
supportTicketSchema.index({ tenant: 1, status: 1 });
supportTicketSchema.index({ property: 1, status: 1 });
export const SupportTicket = mongoose.model('SupportTicket', supportTicketSchema);

const expenseSchema = new mongoose.Schema({
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  category: { type: String, enum: ['electricity', 'water', 'internet', 'maintenance', 'staff_salary', 'food', 'miscellaneous'], required: true },
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  expenseDate: { type: Date, default: Date.now },
  billUrl: String,
  notes: String,
  status: { type: String, enum: ['draft', 'submitted', 'approved', 'rejected'], default: 'submitted' },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });
expenseSchema.index({ property: 1, category: 1, expenseDate: -1 });
export const Expense = mongoose.model('Expense', expenseSchema);

const staffSchema = new mongoose.Schema({
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  name: { type: String, required: true },
  mobile: String,
  role: { type: String, enum: ['caretaker', 'security', 'cleaner', 'cook', 'electrician', 'plumber', 'staff'], default: 'staff' },
  salary: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  attendance: [{ date: Date, status: { type: String, enum: ['present', 'absent', 'half_day'], default: 'present' } }],
  tasks: [{ title: String, status: { type: String, enum: ['todo', 'in_progress', 'done'], default: 'todo' }, dueDate: Date }]
}, { timestamps: true });
staffSchema.index({ property: 1, role: 1, status: 1 });
export const Staff = mongoose.model('Staff', staffSchema);

const auditLogSchema = new mongoose.Schema({
  actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  action: String,
  entity: String,
  entityId: String,
  metadata: Object,
  ip: String
}, { timestamps: true });
auditLogSchema.index({ actor: 1, createdAt: -1 });
auditLogSchema.index({ action: 1, createdAt: -1 });
export const AuditLog = mongoose.model('AuditLog', auditLogSchema);
