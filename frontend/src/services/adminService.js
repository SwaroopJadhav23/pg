import api from '../lib/api';

export const adminService = {
  dashboard: () => api.get('/admin/dashboard').then((response) => response.data.data),
  tenants: () => api.get('/admin/tenants').then((response) => response.data.data),
  uploadTenantPhoto: (file) => {
    const formData = new FormData();
    formData.append('photo', file);
    return api.post('/admin/tenants/photo', formData).then((response) => response.data.data);
  },
  createTenant: (payload) => api.post('/admin/tenants', payload).then((response) => response.data.data),
  rooms: () => api.get('/admin/rooms').then((response) => response.data.data),
  createRoom: (payload) => api.post('/admin/rooms', payload).then((response) => response.data.data),
  assignTenant: (roomId, tenantId) => api.post(`/admin/rooms/${roomId}/assign`, { tenantId }).then((response) => response.data.data),
  vacateRoom: (roomId) => api.post(`/admin/rooms/${roomId}/vacate`).then((response) => response.data.data),
  rents: () => api.get('/admin/rents').then((response) => response.data.data),
  generateRent: (payload) => api.post('/admin/rents', payload).then((response) => response.data.data),
  markRentPaid: (rentId, payload) => api.post(`/admin/rents/${rentId}/mark-paid`, payload).then((response) => response.data.data),
  sendRentReminder: (rentId) => api.post(`/admin/rents/${rentId}/send-reminder`).then((response) => response.data.data),
  expenses: () => api.get('/admin/expenses').then((response) => response.data.data),
  createExpense: (payload) => api.post('/admin/expenses', payload).then((response) => response.data.data),
  approveExpense: (expenseId) => api.post(`/admin/expenses/${expenseId}/approve`).then((response) => response.data.data),
  complaints: () => api.get('/admin/complaints').then((response) => response.data.data),
  updateComplaint: (complaintId, payload) => api.patch(`/admin/complaints/${complaintId}`, payload).then((response) => response.data.data),
  visitors: () => api.get('/admin/visitors').then((response) => response.data.data),
  checkInVisitor: (visitorId) => api.post(`/admin/visitors/${visitorId}/check-in`).then((response) => response.data.data),
  checkOutVisitor: (visitorId) => api.post(`/admin/visitors/${visitorId}/check-out`).then((response) => response.data.data),
  staff: () => api.get('/admin/staff').then((response) => response.data.data),
  createStaff: (payload) => api.post('/admin/staff', payload).then((response) => response.data.data),
  markAttendance: (staffId, payload) => api.post(`/admin/staff/${staffId}/attendance`, payload).then((response) => response.data.data),
  assignTask: (staffId, payload) => api.post(`/admin/staff/${staffId}/tasks`, payload).then((response) => response.data.data),
  notices: () => api.get('/admin/notices').then((response) => response.data.data),
  createNotice: (payload) => api.post('/admin/notices', payload).then((response) => response.data.data),
  reports: () => api.get('/admin/reports').then((response) => response.data.data)
};
