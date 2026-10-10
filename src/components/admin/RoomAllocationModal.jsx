import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { Modal } from '../common/Modal';
import { StatusBadge } from '../common/StatusBadge';
import { AlertCircle, BedDouble, CheckCircle } from 'lucide-react';

export const RoomAllocationModal = ({ isOpen, onClose, onSuccess }) => {
  const [students, setStudents] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchDropdowns();
    }
  }, [isOpen]);

  const fetchDropdowns = async () => {
    try {
      const [sRes, rRes] = await Promise.all([
        adminService.getStudents(),
        adminService.getRooms()
      ]);
      setStudents(sRes.data || []);
      setRooms(rRes.data || []);
    } catch (err) {
      console.error("Failed to load allocation options", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedStudentId || !selectedRoomId) {
      setError('Please select both a student and a target room.');
      return;
    }

    setLoading(true);
    try {
      await adminService.allocateRoom({
        studentId: parseInt(selectedStudentId),
        roomId: parseInt(selectedRoomId),
        notes: notes
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Allocation failed');
    } finally {
      setLoading(false);
    }
  };

  const targetRoom = rooms.find(r => r.id === parseInt(selectedRoomId));

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Allocate / Reassign Room" maxWidth="max-w-lg">
      {error && (
        <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block font-semibold text-gray-700 mb-1">Select Student *</label>
          <select
            required
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Select Student --</option>
            {students.map((s) => (
              <option key={s.user.id} value={s.user.id}>
                {s.user.fullName} ({s.rollNumber || 'No Roll'}) - {s.roomDetails ? `Currently: Room ${s.roomDetails.roomNumber}` : 'Unallocated'}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold text-gray-700 mb-1">Select Target Room *</label>
          <select
            required
            value={selectedRoomId}
            onChange={(e) => setSelectedRoomId(e.target.value)}
            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Select Available Room --</option>
            {rooms.map((r) => {
              const isFull = r.occupiedCount >= r.capacity;
              return (
                <option key={r.id} value={r.id} disabled={isFull}>
                  Room {r.roomNumber} ({r.hostelName}) - Type: {r.roomType} | Occupancy: {r.occupiedCount}/{r.capacity} {isFull ? '[FULL CAPACITY]' : ''}
                </option>
              );
            })}
          </select>
        </div>

        {targetRoom && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 space-y-1">
            <div className="font-semibold flex items-center justify-between">
              <span>Selected Room Summary:</span>
              <StatusBadge status={targetRoom.status} />
            </div>
            <p>Hostel: <strong>{targetRoom.hostelName}</strong></p>
            <p>Room Type: <strong>{targetRoom.roomType}</strong> (Floor {targetRoom.floor})</p>
            <p>Capacity: <strong>{targetRoom.occupiedCount} / {targetRoom.capacity} Occupied</strong></p>
            <p>Monthly Fee: <strong>${targetRoom.monthlyFee}/month</strong></p>
          </div>
        )}

        <div>
          <label className="block font-semibold text-gray-700 mb-1">Allocation Notes (Optional)</label>
          <textarea
            rows="2"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Special request or academic term..."
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="pt-2 flex items-center justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors shadow-sm flex items-center space-x-1.5"
          >
            <BedDouble className="w-4 h-4" />
            <span>{loading ? 'Allocating...' : 'Confirm Allocation'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default RoomAllocationModal;
