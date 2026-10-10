import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import LoadingSpinner from './components/common/LoadingSpinner';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import NotFoundPage from './pages/NotFoundPage';

// Admin Views
import AdminOverview from './components/admin/AdminOverview';
import UserManagement from './components/admin/UserManagement';
import RoomManagement from './components/admin/RoomManagement';
import FeeManagement from './components/admin/FeeManagement';
import WardenComplaints from './components/warden/WardenComplaints'; // Shared view for Admin complaints review

// Warden Views
import WardenOverview from './components/warden/WardenOverview';
import WardenRooms from './components/warden/WardenRooms';
import VisitorLog from './components/warden/VisitorLog';

// Student Views
import StudentOverview from './components/student/StudentOverview';
import RoomDetails from './components/student/RoomDetails';
import MyFees from './components/student/MyFees';
import MyComplaints from './components/student/MyComplaints';
import MyVisitors from './components/student/MyVisitors';
import StudentProfile from './components/student/StudentProfile';

const RoleIndexRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'ROLE_ADMIN') return <Navigate to="/admin/dashboard" replace />;
  if (user.role === 'ROLE_WARDEN') return <Navigate to="/warden/dashboard" replace />;
  return <Navigate to="/student/dashboard" replace />;
};

export function App() {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Index Redirect */}
      <Route path="/" element={<RoleIndexRedirect />} />

      {/* Protected Admin Routes */}
      <Route element={<ProtectedRoute allowedRoles={['ROLE_ADMIN']} />}>
        <Route element={<DashboardPage />}>
          <Route path="/admin/dashboard" element={<AdminOverview />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/rooms" element={<RoomManagement />} />
          <Route path="/admin/allocations" element={<RoomManagement />} />
          <Route path="/admin/fees" element={<FeeManagement />} />
          <Route path="/admin/complaints" element={<WardenComplaints />} />
        </Route>
      </Route>

      {/* Protected Warden Routes */}
      <Route element={<ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_WARDEN']} />}>
        <Route element={<DashboardPage />}>
          <Route path="/warden/dashboard" element={<WardenOverview />} />
          <Route path="/warden/rooms" element={<WardenRooms />} />
          <Route path="/warden/complaints" element={<WardenComplaints />} />
          <Route path="/warden/visitors" element={<VisitorLog />} />
        </Route>
      </Route>

      {/* Protected Student Routes */}
      <Route element={<ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_WARDEN', 'ROLE_STUDENT']} />}>
        <Route element={<DashboardPage />}>
          <Route path="/student/dashboard" element={<StudentOverview />} />
          <Route path="/student/room" element={<RoomDetails />} />
          <Route path="/student/fees" element={<MyFees />} />
          <Route path="/student/complaints" element={<MyComplaints />} />
          <Route path="/student/visitors" element={<MyVisitors />} />
          <Route path="/student/profile" element={<StudentProfile />} />
        </Route>
      </Route>

      {/* 404 Catch All */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
