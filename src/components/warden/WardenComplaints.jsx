import React, { useState, useEffect } from 'react';
import { wardenService } from '../../services/wardenService';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';
import { MessageSquareWarning, Filter, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export const WardenComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  
  // Update Modal
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [newStatus, setNewStatus] = useState('IN_PROGRESS');
  const [comments, setComments] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await wardenService.getComplaints();
      setComplaints(res.data || []);
    } catch (err) {
      console.error("Failed to load complaints", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await wardenService.updateComplaintStatus(selectedComplaint.id, newStatus, comments);
      setSelectedComplaint(null);
      fetchComplaints();
    } catch (err) {
      setError(err.message || 'Failed to update status');
    }
  };

  const filteredComplaints = complaints.filter(c => {
    if (statusFilter === 'ALL') return true;
    return c.status === statusFilter;
  });

  if (loading) return <LoadingSpinner text="Fetching student complaint tickets..." />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Student Complaints & Maintenance Workflow</h2>
        <p className="text-xs text-gray-500 mt-1">Review student issues (Plumbing, Electrical, Wi-Fi) and update resolution status.</p>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-xs font-semibold text-gray-700">Filter Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none"
          >
            <option value="ALL">All Complaints ({complaints.length})</option>
            <option value="PENDING">Pending Only</option>
            <option value="IN_PROGRESS">In Progress Only</option>
            <option value="RESOLVED">Resolved Only</option>
            <option value="REJECTED">Rejected Only</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredComplaints.length === 0 ? (
          <div className="col-span-2 p-10 bg-white rounded-xl border border-gray-100 text-center text-xs text-gray-400">
            No complaints found for selected filter.
          </div>
        ) : (
          filteredComplaints.map(c => (
            <div key={c.id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-bold text-blue-600 uppercase bg-blue-50 px-2 py-0.5 rounded border border-blue-100">{c.category}</span>
                  <StatusBadge status={c.status} />
                </div>
                <h3 className="text-base font-bold text-gray-900">{c.title}</h3>
                <p className="text-xs text-gray-600 bg-gray-50/80 p-3 rounded-xl border border-gray-100">{c.description}</p>
                <div className="text-[11px] text-gray-400 space-y-0.5">
                  <p>Submitted by: <strong className="text-gray-700">{c.student?.fullName}</strong> ({c.student?.email})</p>
                  <p>Priority level: <strong className="text-amber-700">{c.priority}</strong></p>
                </div>
                {c.wardenComments && (
                  <div className="p-2.5 bg-blue-50/60 rounded-xl border border-blue-100 text-xs text-blue-900">
                    <span className="font-bold">Warden Note: </span>{c.wardenComments}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[10px] text-gray-400">{new Date(c.createdAt).toLocaleString()}</span>
                <button
                  onClick={() => {
                    setSelectedComplaint(c);
                    setNewStatus(c.status);
                    setComments(c.wardenComments || '');
                    setError('');
                  }}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
                >
                  Update Ticket
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Update Complaint Modal */}
      <Modal isOpen={!!selectedComplaint} onClose={() => setSelectedComplaint(null)} title="Update Complaint Ticket">
        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {selectedComplaint && (
          <form onSubmit={handleUpdateStatus} className="space-y-3 text-xs">
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
              <p className="font-bold text-gray-900">{selectedComplaint.title}</p>
              <p className="text-gray-500 text-[11px] mt-0.5">Category: {selectedComplaint.category} • Student: {selectedComplaint.student?.fullName}</p>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">New Status *</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold"
              >
                <option value="PENDING">PENDING</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="RESOLVED">RESOLVED</option>
                <option value="REJECTED">REJECTED</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Warden Comments / Action Notes</label>
              <textarea
                rows="3"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Details of repair or action taken..."
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
              />
            </div>

            <div className="pt-3 flex justify-end space-x-2">
              <button type="button" onClick={() => setSelectedComplaint(null)} className="px-4 py-2 bg-gray-100 rounded-xl font-semibold">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold">Save Status</button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default WardenComplaints;
