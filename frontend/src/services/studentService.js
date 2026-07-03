import api from '../lib/api';

export const studentService = {
  dashboard: () => api.get('/student/dashboard').then((response) => response.data.data),
  myRoom: () => api.get('/student/my-room').then((response) => response.data.data),
  rentPayments: () => api.get('/student/rent-payments').then((response) => response.data.data),
  complaints: () => api.get('/student/complaints').then((response) => response.data.data),
  createComplaint: (payload) => api.post('/student/complaints', payload).then((response) => response.data.data),
  notices: () => api.get('/student/notices').then((response) => response.data.data),
  documents: () => api.get('/student/documents').then((response) => response.data.data),
  visitors: () => api.get('/student/visitors').then((response) => response.data.data),
  createVisitor: (payload) => api.post('/student/visitors', payload).then((response) => response.data.data),
  profile: () => api.get('/student/profile').then((response) => response.data.data),
  updateProfile: (payload) => api.patch('/student/profile', payload).then((response) => response.data.data),
  support: () => api.get('/student/support').then((response) => response.data.data),
  createSupportTicket: (payload) => api.post('/student/support', payload).then((response) => response.data.data)
};
