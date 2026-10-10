import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';
import { RoomAllocationModal } from './RoomAllocationModal';
import { Building, BedDouble, Plus, Search, Filter, AlertCircle } from 'lucide-react';

export const RoomManagement = () => {
  const [hostels, setHostels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedHostelFilter, setSelectedHostelFilter] = useState('ALL');
  
  // Modals
  const [isHostelModalOpen, setIsHostelModalOpen] = useState(false);
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [isAllocationModalOpen, setIsAllocationModalOpen] = useState(false);

  // Forms
  const [newHostel, setNewHostel] = useState({
    name: '', code: '', genderType: 'BOYS', totalRooms: 10, totalCapacity: 20, address: '', description: ''
  });

  const [newRoom, setNewRoom] = useState({
    hostelId: '', roomNumber: '', floor: 1, roomType: 'DOUBLE', capacity: 2, monthlyFee: 350, status: 'AVAILABLE'
  });

  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [hRes, rRes] = await Promise.all([
        adminService.getHostels(),
        adminService.getRooms()
      ]);
      setHostels(hRes.data || []);
      setRooms(rRes.data || []);
      if (hRes.data && hRes.data.length > 0 && !newRoom.hostelId) {
        setNewRoom(prev => ({ ...prev, hostelId: hRes.data[0].id }));
      }
    } catch (err) {
      console.error("Failed to load hostel and room data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateHostel = async (e) => {
    e.preventDefault();
    setFormError('');
    try {
      await adminService.createHostel(newHostel);
      setIsHostelModalOpen(false);
      setNewHostel({ name: '', code: '', genderType: 'BOYS', totalRooms: 10, totalCapacity: 20, address: '', description: '' });
      fetchData();
    } catch (err) {
      setFormError(err.message || 'Failed to create hostel');
    }
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    setFormError('');
    try {
      await adminService.createRoom({
        ...newRoom,
        hostelId: parseInt(newRoom.hostelId),
        floor: parseInt(newRoom.floor),
        capacity: parseInt(newRoom.capacity),
        monthlyFee: parseFloat(newRoom.monthlyFee)
      });
      setIsRoomModalOpen(false);
      setNewRoom({ hostelId: hostels[0]?.id || '', roomNumber: '', floor: 1, roomType: 'DOUBLE', capacity: 2, monthlyFee: 350, status: 'AVAILABLE' });
      fetchData();
    } catch (err) {
      setFormError(err.message || 'Failed to create room');
    }
  };

  const filteredRooms = rooms.filter(r => {
    if (selectedHostelFilter === 'ALL') return true;
    return r.hostelId === parseInt(selectedHostelFilter);
  });

  if (loading) return <LoadingSpinner text="Loading hostel & room inventory..." />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Hostels & Room Management</h2>
          <p className="text-xs text-gray-500 mt-1">Configure hostel buildings, rooms, types, monthly fees, and capacity.</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => { setFormError(''); setIsHostelModalOpen(true); }}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors flex items-center space-x-1.5"
          >
            <Building className="w-4 h-4" />
            <span>+ Add Hostel</span>
          </button>
          <button
            onClick={() => { setFormError(''); setIsRoomModalOpen(true); }}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Room</span>
          </button>
          <button
            onClick={() => setIsAllocationModalOpen(true)}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors flex items-center space-x-1.5"
          >
            <BedDouble className="w-4 h-4" />
            <span>Allocate Student</span>
          </button>
        </div>
      </div>

      {/* Hostels Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {hostels.map(h => (
          <div key={h.id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">{h.code}</span>
                <h3 className="text-base font-bold text-gray-900">{h.name}</h3>
              </div>
              <StatusBadge status={h.genderType} />
            </div>
            <p className="text-xs text-gray-500">{h.description}</p>
            <div className="pt-2 flex items-center justify-between text-xs text-gray-600 border-t border-gray-50">
              <span>Rooms: <strong>{h.totalRooms}</strong></span>
              <span>Capacity: <strong>{h.totalCapacity} beds</strong></span>
            </div>
          </div>
        ))}
      </div>

      {/* Room Directory Controls */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-xs font-semibold text-gray-700">Filter by Hostel:</span>
          <select
            value={selectedHostelFilter}
            onChange={(e) => setSelectedHostelFilter(e.target.value)}
            className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none"
          >
            <option value="ALL">All Hostels ({rooms.length} Rooms)</option>
            {hostels.map(h => (
              <option key={h.id} value={h.id}>{h.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Rooms Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-700 uppercase font-semibold">
              <tr>
                <th className="px-5 py-3.5">Hostel Building</th>
                <th className="px-5 py-3.5">Room No.</th>
                <th className="px-5 py-3.5">Floor</th>
                <th className="px-5 py-3.5">Room Type</th>
                <th className="px-5 py-3.5">Capacity & Occupancy</th>
                <th className="px-5 py-3.5">Monthly Fee</th>
                <th className="px-5 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRooms.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-5 py-8 text-center text-gray-400">
                    No rooms found in selected hostel.
                  </td>
                </tr>
              ) : (
                filteredRooms.map(r => (
                  <tr key={r.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4 font-semibold text-gray-900">{r.hostelName}</td>
                    <td className="px-5 py-4 font-bold text-blue-600 font-mono">Room {r.roomNumber}</td>
                    <td className="px-5 py-4">Floor {r.floor}</td>
                    <td className="px-5 py-4 font-medium">{r.roomType}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold">{r.occupiedCount} / {r.capacity} Beds</span>
                        {r.occupiedCount >= r.capacity && (
                          <span className="text-[10px] bg-rose-50 text-rose-600 font-bold px-1.5 py-0.5 rounded border border-rose-200">FULL</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 font-bold text-gray-900">${r.monthlyFee}</td>
                    <td className="px-5 py-4">
                      <StatusBadge status={r.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Hostel Modal */}
      <Modal isOpen={isHostelModalOpen} onClose={() => setIsHostelModalOpen(false)} title="Add New Hostel Building">
        {formError && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}
        <form onSubmit={handleCreateHostel} className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Hostel Name *</label>
            <input
              type="text"
              required
              value={newHostel.name}
              onChange={(e) => setNewHostel({ ...newHostel, name: e.target.value })}
              placeholder="e.g. Ramanujan Hall of Residence"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Hostel Code *</label>
              <input
                type="text"
                required
                value={newHostel.code}
                onChange={(e) => setNewHostel({ ...newHostel, code: e.target.value })}
                placeholder="HOSTEL-D"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Gender Type</label>
              <select
                value={newHostel.genderType}
                onChange={(e) => setNewHostel({ ...newHostel, genderType: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
              >
                <option value="BOYS">BOYS</option>
                <option value="GIRLS">GIRLS</option>
                <option value="COED">COED</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Address / Location</label>
            <input
              type="text"
              value={newHostel.address}
              onChange={(e) => setNewHostel({ ...newHostel, address: e.target.value })}
              placeholder="Campus Sector..."
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
            />
          </div>
          <div className="pt-3 flex justify-end space-x-2">
            <button type="button" onClick={() => setIsHostelModalOpen(false)} className="px-4 py-2 bg-gray-100 rounded-xl">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold">Save Hostel</button>
          </div>
        </form>
      </Modal>

      {/* Add Room Modal */}
      <Modal isOpen={isRoomModalOpen} onClose={() => setIsRoomModalOpen(false)} title="Add New Room">
        {formError && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}
        <form onSubmit={handleCreateRoom} className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Select Hostel Building *</label>
            <select
              required
              value={newRoom.hostelId}
              onChange={(e) => setNewRoom({ ...newRoom, hostelId: e.target.value })}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
            >
              {hostels.map(h => (
                <option key={h.id} value={h.id}>{h.name}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Room Number *</label>
              <input
                type="text"
                required
                value={newRoom.roomNumber}
                onChange={(e) => setNewRoom({ ...newRoom, roomNumber: e.target.value })}
                placeholder="e.g. 103"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Floor *</label>
              <input
                type="number"
                min="0"
                required
                value={newRoom.floor}
                onChange={(e) => setNewRoom({ ...newRoom, floor: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Room Type</label>
              <select
                value={newRoom.roomType}
                onChange={(e) => setNewRoom({ ...newRoom, roomType: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
              >
                <option value="SINGLE">SINGLE (1 Bed)</option>
                <option value="DOUBLE">DOUBLE (2 Beds)</option>
                <option value="TRIPLE">TRIPLE (3 Beds)</option>
                <option value="DORMITORY">DORMITORY (4+ Beds)</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Capacity (Max Beds) *</label>
              <input
                type="number"
                min="1"
                required
                value={newRoom.capacity}
                onChange={(e) => setNewRoom({ ...newRoom, capacity: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
              />
            </div>
          </div>
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Monthly Fee ($) *</label>
            <input
              type="number"
              step="0.01"
              required
              value={newRoom.monthlyFee}
              onChange={(e) => setNewRoom({ ...newRoom, monthlyFee: e.target.value })}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
            />
          </div>
          <div className="pt-3 flex justify-end space-x-2">
            <button type="button" onClick={() => setIsRoomModalOpen(false)} className="px-4 py-2 bg-gray-100 rounded-xl">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold">Save Room</button>
          </div>
        </form>
      </Modal>

      {/* Allocation Modal */}
      <RoomAllocationModal
        isOpen={isAllocationModalOpen}
        onClose={() => setIsAllocationModalOpen(false)}
        onSuccess={fetchData}
      />
    </div>
  );
};

export default RoomManagement;
