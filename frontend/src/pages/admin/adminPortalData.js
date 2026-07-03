export const adminFallback = {
  stats: {
    totalTenants: 148,
    occupiedBeds: 148,
    vacantBeds: 24,
    monthlyRevenue: 1480000,
    pendingRent: 120000,
    overdueRent: 36000,
    openComplaints: 11,
    totalVisitors: 286,
    staffCount: 12
  },
  tenants: [
    { _id: 't1', name: 'Aarav Sharma', email: 'student@pg.test', mobile: '9000000001', status: 'active', profile: { roomNumber: 'A-204', bedNumber: 'B2', guardianName: 'Raj Sharma', emergencyContact: '9000000101' } },
    { _id: 't2', name: 'Riya Patel', email: 'riya@pg.test', mobile: '9000000004', status: 'active', profile: { roomNumber: 'A-118', bedNumber: 'B1', guardianName: 'Kiran Patel', emergencyContact: '9000000104' } }
  ],
  rooms: [
    { _id: 'r1', floor: '2', roomNumber: 'A-204', bedNumber: 'B2', status: 'occupied', rent: 9500, roomType: 'Premium Twin Sharing', tenant: { name: 'Aarav Sharma' }, amenities: ['WiFi', 'Cupboard'] },
    { _id: 'r2', floor: '2', roomNumber: 'A-205', bedNumber: 'B1', status: 'vacant', rent: 10000, roomType: 'Premium Twin Sharing', amenities: ['WiFi', 'Study Table'] },
    { _id: 'r3', floor: '2', roomNumber: 'A-206', bedNumber: 'B1', status: 'maintenance', rent: 9000, roomType: 'Standard Twin Sharing', amenities: ['WiFi'] }
  ],
  rents: [
    { _id: 'p1', tenant: { name: 'Aarav Sharma', profile: { roomNumber: 'A-204' } }, month: 'July 2026', amount: 9500, dueDate: '2026-07-05', status: 'pending' },
    { _id: 'p2', tenant: { name: 'Riya Patel', profile: { roomNumber: 'A-118' } }, month: 'June 2026', amount: 10000, paidAt: '2026-06-04', dueDate: '2026-06-05', method: 'upi', status: 'paid' }
  ],
  expenses: [
    { _id: 'e1', category: 'electricity', title: 'Electricity Bill June', amount: 42000, expenseDate: '2026-06-18', status: 'approved' },
    { _id: 'e2', category: 'internet', title: 'Internet Renewal', amount: 8500, expenseDate: '2026-06-10', status: 'submitted' }
  ],
  complaints: [
    { _id: 'c1', tenant: { name: 'Aarav Sharma', profile: { roomNumber: 'A-204' } }, category: 'plumbing', priority: 'medium', status: 'assigned', assignedTo: 'Plumber', description: 'Washroom tap leakage needs repair.', timeline: [{ status: 'open', note: 'Created' }, { status: 'assigned', note: 'Assigned to plumber' }] },
    { _id: 'c2', tenant: { name: 'Riya Patel', profile: { roomNumber: 'A-118' } }, category: 'internet', priority: 'high', status: 'in_progress', assignedTo: 'Staff', description: 'WiFi drops during evening study hours.', timeline: [{ status: 'open', note: 'Created' }, { status: 'in_progress', note: 'Router inspection scheduled' }] }
  ],
  visitors: [
    { _id: 'v1', tenant: { name: 'Aarav Sharma' }, name: 'Rohan Sharma', mobile: '9888888888', relation: 'Brother', expectedTime: '18:30', status: 'approved' },
    { _id: 'v2', tenant: { name: 'Riya Patel' }, name: 'Kiran Patel', mobile: '9777777777', relation: 'Father', checkIn: '2026-06-24T10:30:00', status: 'checked_in' }
  ],
  staff: [
    { _id: 's1', name: 'Suresh Patil', mobile: '9111111111', role: 'caretaker', salary: 22000, status: 'active', tasks: [{ title: 'Inspect second floor rooms', status: 'in_progress' }] },
    { _id: 's2', name: 'Maya Jadhav', mobile: '9222222222', role: 'cleaner', salary: 15000, status: 'active', tasks: [{ title: 'Deep clean common kitchen', status: 'todo' }] }
  ],
  notices: [
    { _id: 'n1', title: 'Monthly Maintenance', body: 'Water tank cleaning on Sunday from 10 AM to 1 PM.', audience: 'all_tenants', createdAt: '2026-06-20' }
  ]
};
