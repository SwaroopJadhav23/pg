export const emptySuperDashboard = {
  stats: {
    totalProperties: 0,
    totalBeds: 0,
    occupiedBeds: 0,
    activeTenants: 0,
    monthlyRevenue: 0,
    pendingRent: 0,
    openComplaints: 0
  },
  propertyPerformance: [],
  monthlyGrowth: []
};

export const emptyRevenueCenter = {
  metrics: {
    totalRevenue: 0,
    collectionRate: 0,
    outstandingAmount: 0,
    profitEstimate: 0
  },
  propertyRevenue: []
};

export const emptyAnalytics = {
  propertyPerformance: [],
  complaints: [],
  revenueTrends: [],
  tenantRetention: [],
  operational: { staffCount: 0, visitorCount: 0 },
  insights: []
};

export const emptySettings = {
  platform: { name: '', supportEmail: '', supportPhone: '', timezone: '' },
  subscription: { plan: '', billingCycle: 'monthly', maxProperties: 0 },
  notifications: { email: true, sms: true, whatsapp: true },
  security: { enforceMfa: false, sessionTimeoutMinutes: 60, allowedIpRanges: [] }
};

export const emptyAdminDashboard = {
  stats: {
    totalTenants: 0,
    occupiedBeds: 0,
    vacantBeds: 0,
    monthlyRevenue: 0,
    pendingRent: 0,
    overdueRent: 0,
    openComplaints: 0,
    totalVisitors: 0
  },
  recentRents: [],
  complaintsByStatus: [],
  expensesByCategory: []
};

export const emptyStudentDashboard = {
  student: null,
  currentRent: null,
  rentHistory: [],
  notices: [],
  complaints: []
};
