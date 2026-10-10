import api from './api';

export const wardenService = {
  getProfile: () => api.get('/warden/my-profile'),
  getStudents: () => api.get('/warden/students'),
  getAllocations: () => api.get('/warden/allocations'),
  getComplaints: () => api.get('/warden/complaints'),
  updateComplaintStatus: (id, status, comments) => api.patch(`/warden/complaints/${id}/status`, { status, comments }),
  getVisitors: () => api.get('/warden/visitors'),
  logVisitor: (data) => api.post('/warden/visitors', data),
  checkOutVisitor: (id) => api.patch(`/warden/visitors/${id}/checkout`),
};
