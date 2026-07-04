import api from '../lib/api';

export const superAdminService = {
  dashboard: () => api.get('/super-admin/dashboard').then((response) => response.data.data),
  properties: () => api.get('/super-admin/properties').then((response) => response.data.data),
  uploadPropertyPhotos: (files) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('photos', file));
    return api.post('/super-admin/properties/photos', formData).then((response) => response.data.data);
  },
  createProperty: (payload) => api.post('/super-admin/properties', payload).then((response) => response.data.data),
  updateProperty: (id, payload) => api.patch(`/super-admin/properties/${id}`, payload).then((response) => response.data.data),
  disableProperty: (id) => api.post(`/super-admin/properties/${id}/disable`).then((response) => response.data.data),
  deleteProperty: (id) => api.delete(`/super-admin/properties/${id}`).then((response) => response.data.data),
  revenueCenter: () => api.get('/super-admin/revenue-center').then((response) => response.data.data),
  tenants: () => api.get('/super-admin/tenants').then((response) => response.data.data),
  managers: () => api.get('/super-admin/managers').then((response) => response.data.data),
  createManager: (payload) => api.post('/super-admin/managers', payload).then((response) => response.data.data),
  assignManager: (id, propertyId) => api.post(`/super-admin/managers/${id}/assign`, { propertyId }).then((response) => response.data.data),
  disableManager: (id) => api.post(`/super-admin/managers/${id}/disable`).then((response) => response.data.data),
  notices: () => api.get('/super-admin/notices').then((response) => response.data.data),
  createNotice: (payload) => api.post('/super-admin/notices', payload).then((response) => response.data.data),
  complaints: () => api.get('/super-admin/complaints').then((response) => response.data.data),
  analytics: () => api.get('/super-admin/analytics').then((response) => response.data.data),
  auditLogs: () => api.get('/super-admin/audit-logs').then((response) => response.data.data),
  settings: () => api.get('/super-admin/settings').then((response) => response.data.data),
  updateSettings: (payload) => api.patch('/super-admin/settings', payload).then((response) => response.data.data)
};
