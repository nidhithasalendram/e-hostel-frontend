import api from './api';

export const adminService = {
  getUsers: () => api.get('/admin/users'),
  getStudents: () => api.get('/admin/students'),
  getWardens: () => api.get('/admin/wardens'),
  toggleUserStatus: (userId) => api.patch(`/admin/users/${userId}/toggle-status`),
  
  getHostels: () => api.get('/admin/hostels'),
  createHostel: (data) => api.post('/admin/hostels', data),
  updateHostel: (id, data) => api.put(`/admin/hostels/${id}`, data),

  getRooms: () => api.get('/rooms'),
  createRoom: (data) => api.post('/admin/rooms', data),
  updateRoom: (id, data) => api.put(`/admin/rooms/${id}`, data),

  getAllocations: () => api.get('/admin/allocations'),
  allocateRoom: (data) => api.post('/admin/allocate', data),
  vacateRoom: (allocationId) => api.post(`/admin/vacate/${allocationId}`),

  getDashboardStats: () => api.get('/analytics/dashboard'),
  issueFeeBill: (data) => api.post('/fees', data),
};
