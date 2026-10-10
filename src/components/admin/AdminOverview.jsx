import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { StatCard } from '../common/StatCard';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { StatusBadge } from '../common/StatusBadge';
import { Users, Building, BedDouble, DollarSign, MessageSquareWarning, UserCheck, Percent } from 'lucide-react';

export const AdminOverview = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await adminService.getDashboardStats();
      setStats(res.data);
    } catch (err) {
      console.error("Failed to load dashboard stats", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner text="Fetching system statistics..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Admin Dashboard Overview</h2>
          <p className="text-xs text-gray-500 mt-1">Real-time summary of hostel operations, room occupancy, fees & complaints.</p>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Students"
          value={stats?.totalStudents || 0}
          icon={Users}
          color="blue"
          subtitle="Enrolled residents"
        />
        <StatCard
          title="Room Occupancy"
          value={`${stats?.occupancyRate || 0}%`}
          icon={Percent}
          color="emerald"
          subtitle={`${stats?.occupiedRooms || 0} / ${stats?.totalRooms || 0} Rooms Occupied`}
        />
        <StatCard
          title="Collected Fees"
          value={`$${stats?.totalPaidFees ? Number(stats.totalPaidFees).toLocaleString() : '0'}`}
          icon={DollarSign}
          color="indigo"
          subtitle={`$${stats?.totalPendingFees ? Number(stats.totalPendingFees).toLocaleString() : '0'} Pending`}
        />
        <StatCard
          title="Active Complaints"
          value={stats?.pendingComplaints || 0}
          icon={MessageSquareWarning}
          color="amber"
          subtitle={`${stats?.resolvedComplaints || 0} Resolved`}
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase">Hostel Buildings</p>
            <p className="text-xl font-bold text-gray-900 mt-1">{stats?.totalHostels || 0} Hostels</p>
          </div>
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl border border-purple-100">
            <Building className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase">Hostel Wardens</p>
            <p className="text-xl font-bold text-gray-900 mt-1">{stats?.totalWardens || 0} Wardens</p>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase">Active Visitors</p>
            <p className="text-xl font-bold text-gray-900 mt-1">{stats?.activeVisitors || 0} In Hostel</p>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl border border-amber-100">
            <BedDouble className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
