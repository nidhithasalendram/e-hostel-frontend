import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building2, LogIn, Lock, User, ShieldCheck, CheckCircle2, AlertCircle, Shield } from 'lucide-react';

export const LoginPage = () => {
  const [selectedRole, setSelectedRole] = useState('STUDENT'); // STUDENT, WARDEN, ADMIN
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!usernameOrEmail.trim()) {
      setError('Please enter your email or username.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);

    try {
      const res = await login(usernameOrEmail.trim(), password);
      const role = res.data.role;

      if (role === 'ROLE_ADMIN') navigate('/admin/dashboard');
      else if (role === 'ROLE_WARDEN') navigate('/warden/dashboard');
      else navigate('/student/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid username/email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRole = (roleType, defaultUsername) => {
    setSelectedRole(roleType);
    setUsernameOrEmail(defaultUsername);
    setPassword(''); // Require typing password explicitly for security
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl"></div>

      <div className="max-w-md w-full relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-500/30 mb-3">
            <Building2 className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">e-Hostel Management System</h1>
          <p className="text-xs text-slate-400 mt-1">Online Hostel Allocation & Administrative Portal</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          {/* Role Selection Tabs */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-gray-100 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => handleSelectRole('STUDENT', 'student1')}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                selectedRole === 'STUDENT'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => handleSelectRole('WARDEN', 'warden1')}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                selectedRole === 'WARDEN'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Warden
            </button>
            <button
              type="button"
              onClick={() => handleSelectRole('ADMIN', 'admin')}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                selectedRole === 'ADMIN'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Admin
            </button>
          </div>

          <div className="flex items-center space-x-2 border-b border-gray-100 pb-4 mb-6">
            <LogIn className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              {selectedRole === 'WARDEN'
                ? 'Warden Portal Sign In'
                : selectedRole === 'ADMIN'
                ? 'Administrator Sign In'
                : 'Student Portal Sign In'}
            </h2>
          </div>

          {error && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-3 text-rose-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                {selectedRole === 'WARDEN' ? 'Warden Username or Email' : selectedRole === 'ADMIN' ? 'Admin Username or Email' : 'Student Username or Email'}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                  placeholder={
                    selectedRole === 'WARDEN'
                      ? 'e.g. warden1 or warden@hostel.edu'
                      : selectedRole === 'ADMIN'
                      ? 'e.g. admin or admin@hostel.edu'
                      : 'e.g. student1 or alex@student.edu'
                  }
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter account password"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-70"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In as {selectedRole === 'WARDEN' ? 'Warden' : selectedRole === 'ADMIN' ? 'Admin' : 'Student'}</span>
                  <LogIn className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Demo Hint Helper */}
          <div className="mt-6 pt-4 border-t border-gray-100 text-center">
            <p className="text-[11px] text-gray-500">
              Default password for system accounts: <code className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-gray-700">password123</code>
            </p>
          </div>

          <div className="mt-4 text-center text-xs text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-blue-600 hover:underline">
              Register as Student
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
