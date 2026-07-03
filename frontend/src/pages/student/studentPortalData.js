export const studentFallback = {
  student: {
    name: 'Aarav Sharma',
    email: 'student@pg.test',
    mobile: '9000000001',
    profile: {
      photoUrl: 'https://api.dicebear.com/8.x/initials/svg?seed=Aarav',
      address: 'Nagpur, Maharashtra',
      joiningDate: '2025-06-12',
      floorNumber: '2',
      roomNumber: 'A-204',
      bedNumber: 'B2',
      roomType: 'Premium Twin Sharing',
      sharingDetails: '2 sharing with attached washroom',
      guardianName: 'Raj Sharma',
      guardianMobile: '9000000100',
      emergencyContact: '9000000101',
      notificationPreference: 'all'
    }
  },
  property: { name: 'Om Sai Residency', city: 'Pune', address: 'Baner Road, Pune', amenities: ['WiFi', 'Food', 'Laundry', 'Security'] },
  room: {
    floor: '2',
    roomNumber: 'A-204',
    bedNumber: 'B2',
    roomType: 'Premium Twin Sharing',
    sharingDetails: '2 sharing with attached washroom',
    status: 'occupied',
    rent: 9500,
    amenities: ['WiFi', 'Cupboard', 'Study Table', 'Hot Water', 'Laundry']
  },
  stats: {
    currentRentStatus: 'pending',
    pendingAmount: 9500,
    nextDueDate: '2026-07-05',
    activeComplaints: 1,
    visitorsThisMonth: 8,
    noticesReceived: 5
  }
};

export const rentFallback = {
  currentRent: { month: 'July 2026', amount: 9500, dueDate: '2026-07-05', lateFees: 0, status: 'pending' },
  history: [
    { _id: 'r1', month: 'July 2026', amount: 9500, dueDate: '2026-07-05', status: 'pending' },
    { _id: 'r2', month: 'June 2026', amount: 9500, paidAt: '2026-06-03', dueDate: '2026-06-05', method: 'upi', receiptUrl: '/receipts/june-2026.pdf', status: 'paid' },
    { _id: 'r3', month: 'May 2026', amount: 9500, paidAt: '2026-05-04', dueDate: '2026-05-05', method: 'bank_transfer', receiptUrl: '/receipts/may-2026.pdf', status: 'paid' }
  ]
};

export const complaintsFallback = {
  complaints: [
    { _id: 'c1', category: 'plumbing', priority: 'medium', description: 'Washroom tap leakage needs repair.', assignedTo: 'Plumber', status: 'assigned', createdAt: '2026-06-22', timeline: [{ status: 'open', note: 'Created' }, { status: 'assigned', note: 'Assigned to plumber' }] },
    { _id: 'c2', category: 'internet', priority: 'high', description: 'WiFi speed is unstable during evening study hours.', assignedTo: 'Network team', status: 'in_progress', createdAt: '2026-06-18', timeline: [{ status: 'open', note: 'Created' }, { status: 'in_progress', note: 'Router inspection scheduled' }] }
  ]
};

export const noticesFallback = {
  notices: [
    { _id: 'n1', title: 'Monthly Maintenance', body: 'Water tank cleaning on Sunday from 10 AM to 1 PM.', audience: 'all_tenants', createdAt: '2026-06-20' },
    { _id: 'n2', title: 'Rent Reminder', body: 'July rent is due by 5 July. Please pay on time to avoid late fees.', audience: 'all_tenants', createdAt: '2026-06-24' },
    { _id: 'n3', title: 'Emergency Contact Update', body: 'Students must keep guardian and emergency contact details updated.', audience: 'all_tenants', createdAt: '2026-06-21' }
  ]
};

export const documentsFallback = {
  documents: [
    { _id: 'd1', title: 'Rent Agreement', type: 'rent_agreement', fileUrl: '/documents/rent-agreement.pdf', mimeType: 'application/pdf', size: 245000, createdAt: '2025-06-12' },
    { _id: 'd2', title: 'Aadhaar Copy', type: 'aadhaar', fileUrl: '/documents/aadhaar.pdf', mimeType: 'application/pdf', size: 120000, createdAt: '2025-06-12' },
    { _id: 'd3', title: 'June Rent Receipt', type: 'receipt', fileUrl: '/receipts/june-2026.pdf', mimeType: 'application/pdf', size: 82000, createdAt: '2026-06-03' }
  ]
};

export const visitorsFallback = {
  visitors: [
    { _id: 'v1', name: 'Rohan Sharma', mobile: '9888888888', relation: 'Brother', purpose: 'Family visit', visitDate: '2026-06-24', expectedTime: '18:30', status: 'approved' },
    { _id: 'v2', name: 'Meera Sharma', mobile: '9777777777', relation: 'Mother', purpose: 'Drop documents', visitDate: '2026-06-18', expectedTime: '11:00', status: 'checked_out' }
  ]
};

export const supportFallback = {
  tickets: [
    { _id: 's1', subject: 'Need receipt copy', category: 'billing', channel: 'portal', message: 'Please share my latest rent receipt copy.', status: 'waiting', createdAt: '2026-06-15', replies: [{ senderRole: 'admin', message: 'Receipt has been added in documents.' }] }
  ]
};
