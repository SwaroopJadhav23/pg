import api from '../lib/api';

export const landingService = {
  getImages: () => api.get('/public/pg-images').then((res) => res.data.data),
  bookRoom: (payload) => api.post('/public/book-room', payload).then((res) => res.data)
};
