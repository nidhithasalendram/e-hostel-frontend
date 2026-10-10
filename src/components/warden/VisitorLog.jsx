import React, { useState, useEffect } from 'react';
import { wardenService } from '../../services/wardenService';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';
import { UserCheck, Plus, LogOut, Search, AlertCircle } from 'lucide-react';

export const VisitorLog = () => {
  const [visitors, setVisitors] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newVisitor, setNewVisitor] = useState({
    studentId: '', visitorName: '', relationship: 'Parent', visitorPhone: '', idProofNumber: '', purpose: 'Visiting student'
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [vRes, sRes] = await Promise.all([
        wardenService.getVisitors(),
        wardenService.getStudents()
      ]);
      setVisitors(vRes.data || []);
      setStudents(sRes.data || []);
      if (sRes.data && sRes.data.length > 0 && !newVisitor.studentId) {
        setNewVisitor(prev => ({ ...prev, studentId: sRes.data[0].user.id }));
      }
    } catch (err) {
      console.error("Failed to load visitors", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogVisitor = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await wardenService.logVisitor({
        ...newVisitor,
        studentId: parseInt(newVisitor.studentId)
      });
      setIsModalOpen(false);
      setNewVisitor({ studentId: students[0]?.user.id || '', visitorName: '', relationship: 'Parent', visitorPhone: '', idProofNumber: '', purpose: 'Visiting student' });
      fetchData();
    } catch (err) {
      setError(err.message || 'Failed to log visitor');
    }
  };

  const handleCheckOut = async (visitorId) => {
    try {
      await wardenService.checkOutVisitor(visitorId);
      fetchData();
    } catch (err) {
      alert("Checkout failed: " + err.message);
    }
  };

  if (loading) return <LoadingSpinner text="Loading visitor entry log..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Hostel Visitor Register Log</h2>
          <p className="text-xs text-gray-500 mt-1">Record visitor check-in details, student visited, entry time, and check-out time.</p>
        </div>
        <button
          onClick={() => { setError(''); setIsModalOpen(true); }}
          className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>+ Log Visitor Entry</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-700 uppercase font-semibold">
              <tr>
                <th className="px-5 py-3.5">Visitor Name</th>
                <th className="px-5 py-3.5">Relationship</th>
                <th className="px-5 py-3.5">Student Visited</th>
                <th className="px-5 py-3.5">Entry Time</th>
                <th className="px-5 py-3.5">Exit Time</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {visitors.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-5 py-8 text-center text-gray-400">
                    No visitor records logged yet.
                  </td>
                </tr>
              ) : (
                visitors.map((v) => (
                  <tr key={v.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-gray-900">{v.visitorName}</div>
                      <div className="text-[11px] text-gray-400">Ph: {v.visitorPhone || 'N/A'} • ID: {v.idProofNumber || '-'}</div>
                    </td>
                    <td className="px-5 py-4 font-medium">{v.relationship}</td>
                    <td className="px-5 py-4 font-semibold text-blue-600">{v.student?.fullName}</td>
                    <td className="px-5 py-4 font-mono text-[11px]">{new Date(v.entryTime).toLocaleString()}</td>
                    <td className="px-5 py-4 font-mono text-[11px]">
                      {v.exitTime ? new Date(v.exitTime).toLocaleString() : <span className="text-amber-600 font-semibold">Still In Hostel</span>}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={v.status} />
                    </td>
                    <td className="px-5 py-4 text-right">
                      {v.status === 'IN_HOSTEL' && (
                        <button
                          onClick={() => handleCheckOut(v.id)}
                          className="px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 rounded-lg text-[11px] font-semibold transition-colors flex items-center space-x-1 ml-auto"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Check Out</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Visitor Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Log Visitor Entry">
        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogVisitor} className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Student Visited *</label>
            <select
              required
              value={newVisitor.studentId}
              onChange={(e) => setNewVisitor({ ...newVisitor, studentId: e.target.value })}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
            >
              {students.map((s) => (
                <option key={s.user.id} value={s.user.id}>
                  {s.user.fullName} ({s.rollNumber || s.user.username})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Visitor Name *</label>
              <input
                type="text"
                required
                value={newVisitor.visitorName}
                onChange={(e) => setNewVisitor({ ...newVisitor, visitorName: e.target.value })}
                placeholder="Full Name"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Relationship *</label>
              <input
                type="text"
                required
                value={newVisitor.relationship}
                onChange={(e) => setNewVisitor({ ...newVisitor, relationship: e.target.value })}
                placeholder="Father / Mother / Friend"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Visitor Phone</label>
              <input
                type="text"
                value={newVisitor.visitorPhone}
                onChange={(e) => setNewVisitor({ ...newVisitor, visitorPhone: e.target.value })}
                placeholder="+1-555-0000"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">ID Proof Number</label>
              <input
                type="text"
                value={newVisitor.idProofNumber}
                onChange={(e) => setNewVisitor({ ...newVisitor, idProofNumber: e.target.value })}
                placeholder="Govt ID / DL"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Purpose of Visit</label>
            <input
              type="text"
              value={newVisitor.purpose}
              onChange={(e) => setNewVisitor({ ...newVisitor, purpose: e.target.value })}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
            />
          </div>

          <div className="pt-3 flex justify-end space-x-2">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-100 rounded-xl font-semibold">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold">Save Log</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default VisitorLog;
