export function getApiBaseUrl() {
  const apiUrl = import.meta.env.VITE_API_URL || '/api';
  if (apiUrl.startsWith('http')) {
    return apiUrl.replace(/\/api\/?$/, '');
  }
  return '';
}
