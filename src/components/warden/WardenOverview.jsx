import React, { useState, useEffect } from 'react';
import { wardenService } from '../../services/wardenService';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { StatCard } from '../common/StatCard';
import { StatusBadge } from '../common/StatusBadge';
import { Building, Users, MessageSquareWarning, UserCheck } from 'lucide-react';

export const WardenOverview = () => {
  const [profile, setProfile] = useState(null);
  const [students, setStudents] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [pRes, sRes, cRes, vRes] = await Promise.all([
        wardenService.getProfile(),
        wardenService.getStudents(),
        wardenService.getComplaints(),
        wardenService.getVisitors()
      ]);
      setProfile(pRes.data);
      setStudents(sRes.data || []);
      setComplaints(cRes.data || []);
      setVisitors(vRes.data || []);
    } catch (err) {
      console.error("Failed to load warden dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading warden workspace..." />;

  const hostel = profile?.hostel;
  const pendingComplaints = complaints.filter(c => c.status === 'PENDING' || c.status === 'IN_PROGRESS');
  const activeVisitors = visitors.filter(v => v.status === 'IN_HOSTEL');

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-2 border border-blue-100">
            <Building className="w-3.5 h-3.5" />
            <span>Assigned Hostel: {hostel ? hostel.name : 'All Buildings'}</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Welcome, {profile?.user?.fullName}</h2>
          <p className="text-xs text-gray-500 mt-1">
            Employee ID: <strong>{profile?.employeeId}</strong> • Office: {profile?.officeLocation || 'Main Office'} • Ext: {profile?.officePhone || 'N/A'}
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Students"
          value={students.length}
          icon={Users}
          color="blue"
          subtitle="Assigned residents"
        />
        <StatCard
          title="Active Complaints"
          value={pendingComplaints.length}
          icon={MessageSquareWarning}
          color="amber"
          subtitle={`${complaints.length - pendingComplaints.length} Resolved`}
        />
        <StatCard
          title="Visitors Checked In"
          value={activeVisitors.length}
          icon={UserCheck}
          color="emerald"
          subtitle="Currently inside hostel"
        />
      </div>

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pending Complaints */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-gray-900 flex items-center space-x-2">
            <MessageSquareWarning className="w-4 h-4 text-amber-500" />
            <span>Pending Student Complaints ({pendingComplaints.length})</span>
          </h3>
          <div className="space-y-2">
            {pendingComplaints.length === 0 ? (
              <p className="text-xs text-gray-400 py-4 text-center">No pending complaints!</p>
            ) : (
              pendingComplaints.slice(0, 4).map(c => (
                <div key={c.id} className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-semibold text-gray-900">{c.title}</p>
                    <p className="text-[11px] text-gray-500">{c.student?.fullName} • Category: {c.category}</p>
                  </div>
                  <StatusBadge status={c.status} />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Current Visitors */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-gray-900 flex items-center space-x-2">
            <UserCheck className="w-4 h-4 text-emerald-500" />
            <span>Visitors In Hostel ({activeVisitors.length})</span>
          </h3>
          <div className="space-y-2">
            {activeVisitors.length === 0 ? (
              <p className="text-xs text-gray-400 py-4 text-center">No active visitors logged.</p>
            ) : (
              activeVisitors.slice(0, 4).map(v => (
                <div key={v.id} className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-semibold text-gray-900">{v.visitorName} ({v.relationship})</p>
                    <p className="text-[11px] text-gray-500">Visiting: {v.student?.fullName}</p>
                  </div>
                  <StatusBadge status={v.status} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WardenOverview;
