import api from './api';

export const studentService = {
  getProfile: () => api.get('/student/profile'),
  updateProfile: (data) => api.put('/student/profile', data),
  getRoomDetails: () => api.get('/student/room'),
  getAvailableRooms: () => api.get('/student/available-rooms'),
  getHostels: () => api.get('/student/hostels'),
  allocateRoom: (roomId, notes) => api.post('/student/room/allocate', { roomId, notes }),
  getFees: () => api.get('/student/fees'),
  payFee: (feeId, paymentData) => api.post(`/student/fees/${feeId}/pay`, paymentData),
  getComplaints: () => api.get('/student/complaints'),
  submitComplaint: (data) => api.post('/student/complaints', data),
  getVisitors: () => api.get('/student/visitors'),
  addVisitor: (data) => api.post('/student/visitors', data),
  updateVisitor: (id, data) => api.put(`/student/visitors/${id}`, data),
  checkOutVisitor: (id) => api.patch(`/student/visitors/${id}/checkout`),
};
