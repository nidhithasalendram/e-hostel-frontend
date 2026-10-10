import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { studentService } from '../../services/studentService';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { StatusBadge } from '../common/StatusBadge';
import { DoorOpen, DollarSign, MessageSquareWarning, User, ShieldCheck } from 'lucide-react';

export const StudentOverview = () => {
  const [profile, setProfile] = useState(null);
  const [roomAlloc, setRoomAlloc] = useState(null);
  const [fees, setFees] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [pRes, rRes, fRes, cRes] = await Promise.all([
        studentService.getProfile(),
        studentService.getRoomDetails(),
        studentService.getFees(),
        studentService.getComplaints()
      ]);
      setProfile(pRes.data);
      setRoomAlloc(rRes.data);
      setFees(fRes.data || []);
      setComplaints(cRes.data || []);
    } catch (err) {
      console.error("Failed to load student dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading your student portal..." />;

  const activeRoom = roomAlloc?.room;
  const pendingFees = fees.filter(f => f.paymentStatus !== 'PAID');

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Roll No: {profile?.rollNumber || 'N/A'} • {profile?.department}
          </span>
          <h2 className="text-2xl font-bold text-gray-900 mt-2">Welcome back, {profile?.user?.fullName}</h2>
          <p className="text-xs text-gray-500 mt-1">Student Resident Portal • Year {profile?.yearOfStudy}</p>
        </div>
      </div>

      {/* Grid Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Room Card */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Assigned Room</span>
            <DoorOpen className="w-5 h-5 text-blue-600" />
          </div>
          {activeRoom ? (
            <div>
              <p className="text-2xl font-bold text-blue-600">Room {activeRoom.roomNumber}</p>
              <p className="text-xs text-gray-600 font-semibold mt-1">{activeRoom.hostelName}</p>
              <p className="text-[11px] text-gray-400">Type: {activeRoom.roomType} • Floor {activeRoom.floor}</p>
            </div>
          ) : (
            <div>
              <p className="text-base font-semibold text-rose-600">No Room Allocated</p>
              <Link to="/student/room" className="inline-block mt-2 text-xs font-bold text-blue-600 hover:text-blue-700 underline">
                Select & Allocate Room →
              </Link>
            </div>
          )}
        </div>

        {/* Fee Status Card */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Hostel Fees</span>
            <DollarSign className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {pendingFees.length === 0 ? 'All Clear' : `${pendingFees.length} Pending`}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {pendingFees.length > 0 ? `Total Due: $${pendingFees.reduce((acc, curr) => acc + curr.amount, 0)}` : 'No outstanding fee payments due'}
            </p>
          </div>
        </div>

        {/* Complaints Card */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">My Complaints</span>
            <MessageSquareWarning className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{complaints.length} Tickets</p>
            <p className="text-xs text-gray-500 mt-1">
              {complaints.filter(c => c.status === 'RESOLVED').length} Resolved tickets
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentOverview;
