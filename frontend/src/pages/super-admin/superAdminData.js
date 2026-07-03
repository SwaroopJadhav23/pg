export const superFallback = {
  stats: {
    totalProperties: 3,
    totalRooms: 244,
    totalBeds: 488,
    occupiedBeds: 421,
    activeTenants: 421,
    monthlyRevenue: 7840000,
    pendingRent: 680000,
    openComplaints: 42
  },
  properties: [
    { _id: 'p1', name: 'Om Sai Residency', city: 'Pune', address: 'Baner Road', occupancyRate: 86, monthlyRevenue: 1480000, availableBeds: 24, capacity: 172, floors: 5, rooms: 86, status: 'active', manager: { name: 'Priya Manager' } },
    { _id: 'p2', name: 'Om Sai Elite', city: 'Mumbai', address: 'Andheri East', occupancyRate: 92, monthlyRevenue: 2650000, availableBeds: 18, capacity: 220, floors: 8, rooms: 110, status: 'active', manager: { name: 'Ramesh Mumbai Manager' } },
    { _id: 'p3', name: 'Om Sai Comfort', city: 'Nashik', address: 'College Road', occupancyRate: 74, monthlyRevenue: 780000, availableBeds: 25, capacity: 96, floors: 4, rooms: 48, status: 'maintenance' }
  ],
  tenants: [
    { _id: 't1', name: 'Aarav Sharma', email: 'student@pg.test', mobile: '9000000001', status: 'active', property: { name: 'Om Sai Residency', city: 'Pune' }, profile: { roomNumber: 'A-204' } },
    { _id: 't2', name: 'Riya Patel', email: 'riya@pg.test', mobile: '9000000004', status: 'active', property: { name: 'Om Sai Elite', city: 'Mumbai' }, profile: { roomNumber: 'M-101' } }
  ],
  managers: [
    { _id: 'm1', name: 'Priya Manager', email: 'admin@pg.test', mobile: '9000000002', status: 'active', property: { name: 'Om Sai Residency', city: 'Pune' } },
    { _id: 'm2', name: 'Ramesh Mumbai Manager', email: 'mumbai.admin@pg.test', mobile: '9000000005', status: 'active', property: { name: 'Om Sai Elite', city: 'Mumbai' } }
  ],
  complaints: [
    { _id: 'c1', category: 'plumbing', priority: 'medium', status: 'assigned', property: { name: 'Om Sai Residency' }, tenant: { name: 'Aarav Sharma', profile: { roomNumber: 'A-204' } }, description: 'Washroom tap leakage needs repair.' },
    { _id: 'c2', category: 'internet', priority: 'high', status: 'in_progress', property: { name: 'Om Sai Elite' }, tenant: { name: 'Riya Patel', profile: { roomNumber: 'M-101' } }, description: 'WiFi speed unstable.' }
  ],
  notices: [
    { _id: 'n1', title: 'Portfolio Maintenance', body: 'Quarterly safety inspection across all PG branches.', audience: 'all_tenants', property: { name: 'All Properties' }, createdAt: '2026-06-20' }
  ],
  auditLogs: [
    { _id: 'a1', actor: { name: 'Om Sai Owner', role: 'super_admin' }, action: 'property.created', entity: 'Property', createdAt: '2026-06-20', metadata: { name: 'Om Sai Elite' } },
    { _id: 'a2', actor: { name: 'Priya Manager', role: 'admin' }, action: 'rent.marked_paid', entity: 'Rent', createdAt: '2026-06-21', metadata: { amount: 9500 } }
  ],
  settings: {
    platform: { name: 'Om Sai PG OS', supportEmail: 'support@omsai.test', supportPhone: '9000000999', timezone: 'Asia/Kolkata' },
    subscription: { plan: 'enterprise', billingCycle: 'monthly', maxProperties: 25 },
    notifications: { email: true, sms: true, whatsapp: true },
    security: { enforceMfa: false, sessionTimeoutMinutes: 60, allowedIpRanges: [] }
  }
};
