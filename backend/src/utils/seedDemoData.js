import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { env } from '../config/env.js';
import { ROLES } from '../constants/roles.js';
import { Property } from '../models/Property.js';
import { PlatformSetting } from '../models/PlatformSetting.js';
import { User } from '../models/User.js';
import { Complaint, Document, Expense, Notice, Rent, Room, Staff, SupportTicket, Visitor } from '../models/Operations.js';

const password = 'Password@123';

export async function seedDemoUsers() {
  const property = await Property.findOneAndUpdate(
    { name: 'Om Sai Residency' },
    { name: 'Om Sai Residency', imageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800', address: 'Baner Road', city: 'Pune', capacity: 172, floors: 5, rooms: 86, amenities: ['WiFi', 'Food', 'Laundry', 'Security'], pricing: { minRent: 8500, maxRent: 12500 }, status: 'active' },
    { upsert: true, new: true }
  );
  const propertyTwo = await Property.findOneAndUpdate(
    { name: 'Om Sai Elite' },
    { name: 'Om Sai Elite', imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', address: 'Andheri East', city: 'Mumbai', capacity: 220, floors: 8, rooms: 110, amenities: ['WiFi', 'Gym', 'Food', 'Security'], pricing: { minRent: 12000, maxRent: 18000 }, status: 'active' },
    { upsert: true, new: true }
  );
  const propertyThree = await Property.findOneAndUpdate(
    { name: 'Om Sai Comfort' },
    { name: 'Om Sai Comfort', imageUrl: 'https://images.unsplash.com/photo-1494526585095-c41746248156?w=800', address: 'College Road', city: 'Nashik', capacity: 96, floors: 4, rooms: 48, amenities: ['WiFi', 'Food', 'Housekeeping'], pricing: { minRent: 7000, maxRent: 9500 }, status: 'maintenance' },
    { upsert: true, new: true }
  );

  const users = [
    { name: 'Aarav Sharma', email: 'student@pg.test', mobile: '9000000001', role: ROLES.STUDENT, property: property._id, profile: { photoUrl: 'https://api.dicebear.com/8.x/initials/svg?seed=Aarav', address: 'Nagpur, Maharashtra', joiningDate: new Date('2025-06-12'), floorNumber: '2', roomNumber: 'A-204', bedNumber: 'B2', roomType: 'Premium Twin Sharing', sharingDetails: '2 sharing with attached washroom', guardianName: 'Raj Sharma', guardianMobile: '9000000100', emergencyContact: '9000000101', aadhaar: 'XXXX-XXXX-1234', pan: 'ABCDE1234F', notificationPreference: 'all' } },
    { name: 'Priya Manager', email: 'admin@pg.test', mobile: '9000000002', role: ROLES.ADMIN, property: property._id },
    { name: 'Ramesh Mumbai Manager', email: 'mumbai.admin@pg.test', mobile: '9000000005', role: ROLES.ADMIN, property: propertyTwo._id },
    { name: 'Om Sai Owner', email: 'owner@pg.test', mobile: '9000000003', role: ROLES.SUPER_ADMIN }
  ];

  const createdUsers = [];
  for (const user of users) {
    const exists = await User.findOne({ email: user.email });
    if (exists) {
      exists.set({ ...user, password, status: 'active' });
      await exists.save();
      createdUsers.push(exists);
    } else {
      createdUsers.push(await User.create({ ...user, password }));
    }
  }

  await Property.findByIdAndUpdate(property._id, { manager: createdUsers[1]._id });
  await Property.findByIdAndUpdate(propertyTwo._id, { manager: createdUsers[2]._id });

  await Promise.all([
    Room.findOneAndUpdate({ property: property._id, roomNumber: 'A-204', bedNumber: 'B2' }, { property: property._id, floor: '2', roomNumber: 'A-204', bedNumber: 'B2', tenant: createdUsers[0]._id, status: 'occupied', rent: 9500, roomType: 'Premium Twin Sharing', sharingDetails: '2 sharing with attached washroom', amenities: ['WiFi', 'Cupboard', 'Study Table', 'Hot Water', 'Laundry'] }, { upsert: true }),
    Rent.findOneAndUpdate({ tenant: createdUsers[0]._id, month: 'June 2026' }, { tenant: createdUsers[0]._id, property: property._id, month: 'June 2026', amount: 9500, dueDate: new Date('2026-06-05'), paidAt: new Date('2026-06-03'), method: 'upi', lateFees: 0, receiptUrl: '/receipts/june-2026.pdf', transactionRef: 'UPI-JUN-1024', status: 'paid' }, { upsert: true }),
    Rent.findOneAndUpdate({ tenant: createdUsers[0]._id, month: 'July 2026' }, { tenant: createdUsers[0]._id, property: property._id, month: 'July 2026', amount: 9500, dueDate: new Date('2026-07-05'), lateFees: 0, status: 'pending' }, { upsert: true }),
    Room.findOneAndUpdate({ property: property._id, roomNumber: 'A-205', bedNumber: 'B1' }, { property: property._id, floor: '2', roomNumber: 'A-205', bedNumber: 'B1', status: 'vacant', rent: 10000, roomType: 'Premium Twin Sharing', sharingDetails: '2 sharing with attached washroom', amenities: ['WiFi', 'Cupboard', 'Study Table'] }, { upsert: true }),
    Room.findOneAndUpdate({ property: property._id, roomNumber: 'A-206', bedNumber: 'B1' }, { property: property._id, floor: '2', roomNumber: 'A-206', bedNumber: 'B1', status: 'maintenance', rent: 9000, roomType: 'Standard Twin Sharing', sharingDetails: '2 sharing', amenities: ['WiFi', 'Cupboard'] }, { upsert: true }),
    Complaint.findOneAndUpdate({ tenant: createdUsers[0]._id, category: 'plumbing' }, { tenant: createdUsers[0]._id, property: property._id, category: 'plumbing', priority: 'medium', description: 'Washroom tap leakage needs repair.', assignedTo: 'Plumber', status: 'assigned', timeline: [{ status: 'open', note: 'Created' }, { status: 'assigned', note: 'Assigned to plumber' }] }, { upsert: true }),
    Notice.findOneAndUpdate({ title: 'Monthly Maintenance' }, { title: 'Monthly Maintenance', body: 'Water tank cleaning on Sunday from 10 AM to 1 PM.', audience: 'all_tenants', property: property._id, createdBy: createdUsers[1]._id }, { upsert: true }),
    Expense.findOneAndUpdate({ property: property._id, title: 'Electricity Bill June' }, { property: property._id, category: 'electricity', title: 'Electricity Bill June', amount: 42000, expenseDate: new Date('2026-06-18'), billUrl: '/bills/electricity-june.pdf', status: 'approved', approvedBy: createdUsers[1]._id }, { upsert: true }),
    Expense.findOneAndUpdate({ property: property._id, title: 'Internet Renewal' }, { property: property._id, category: 'internet', title: 'Internet Renewal', amount: 8500, expenseDate: new Date('2026-06-10'), status: 'submitted' }, { upsert: true }),
    Staff.findOneAndUpdate({ property: property._id, mobile: '9111111111' }, { property: property._id, name: 'Suresh Patil', mobile: '9111111111', role: 'caretaker', salary: 22000, attendance: [{ date: new Date(), status: 'present' }], tasks: [{ title: 'Inspect second floor rooms', status: 'in_progress', dueDate: new Date() }] }, { upsert: true }),
    Staff.findOneAndUpdate({ property: property._id, mobile: '9222222222' }, { property: property._id, name: 'Maya Jadhav', mobile: '9222222222', role: 'cleaner', salary: 15000, attendance: [{ date: new Date(), status: 'present' }], tasks: [{ title: 'Deep clean common kitchen', status: 'todo', dueDate: new Date() }] }, { upsert: true }),
    Document.findOneAndUpdate({ tenant: createdUsers[0]._id, type: 'rent_agreement' }, { tenant: createdUsers[0]._id, property: property._id, title: 'Rent Agreement', type: 'rent_agreement', fileUrl: '/documents/rent-agreement.pdf', mimeType: 'application/pdf', size: 245000, uploadedBy: createdUsers[1]._id }, { upsert: true }),
    Document.findOneAndUpdate({ tenant: createdUsers[0]._id, type: 'aadhaar' }, { tenant: createdUsers[0]._id, property: property._id, title: 'Aadhaar Copy', type: 'aadhaar', fileUrl: '/documents/aadhaar.pdf', mimeType: 'application/pdf', size: 120000, uploadedBy: createdUsers[1]._id }, { upsert: true }),
    Visitor.findOneAndUpdate({ tenant: createdUsers[0]._id, mobile: '9888888888' }, { tenant: createdUsers[0]._id, property: property._id, name: 'Rohan Sharma', mobile: '9888888888', relation: 'Brother', purpose: 'Family visit', visitDate: new Date(), expectedTime: '18:30', expectedAt: new Date(), status: 'approved' }, { upsert: true }),
    SupportTicket.findOneAndUpdate({ tenant: createdUsers[0]._id, subject: 'Need receipt copy' }, { tenant: createdUsers[0]._id, property: property._id, subject: 'Need receipt copy', category: 'billing', channel: 'portal', message: 'Please share my latest rent receipt copy.', status: 'waiting', replies: [{ senderRole: 'admin', message: 'Receipt has been added in documents.' }] }, { upsert: true }),
    Room.findOneAndUpdate({ property: propertyTwo._id, roomNumber: 'M-101', bedNumber: 'B1' }, { property: propertyTwo._id, floor: '1', roomNumber: 'M-101', bedNumber: 'B1', status: 'occupied', rent: 15000, roomType: 'Premium Twin Sharing', amenities: ['WiFi', 'Gym Access'] }, { upsert: true }),
    Room.findOneAndUpdate({ property: propertyThree._id, roomNumber: 'N-301', bedNumber: 'B1' }, { property: propertyThree._id, floor: '3', roomNumber: 'N-301', bedNumber: 'B1', status: 'vacant', rent: 8500, roomType: 'Standard Twin Sharing', amenities: ['WiFi'] }, { upsert: true }),
    PlatformSetting.findOneAndUpdate({ key: 'global' }, { key: 'global', platform: { name: 'Om Sai PG OS', supportEmail: 'support@omsai.test', supportPhone: '9000000999', timezone: 'Asia/Kolkata' }, subscription: { plan: 'enterprise', billingCycle: 'monthly', maxProperties: 25 }, notifications: { email: true, sms: true, whatsapp: true }, security: { enforceMfa: false, sessionTimeoutMinutes: 60, allowedIpRanges: [] } }, { upsert: true })
  ]);

  return { credentials: users.map((user) => ({ role: user.role, email: user.email, password })), property: property.name };
}

if (fileURLToPath(import.meta.url) === process.argv[1]) {
  await mongoose.connect(env.mongoUri);
  console.log(await seedDemoUsers());
  await mongoose.disconnect();
}
