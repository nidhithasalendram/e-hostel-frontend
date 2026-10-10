import React, { useState, useEffect } from 'react';
import { studentService } from '../../services/studentService';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';
import { MessageSquareWarning, Plus, AlertCircle, CheckCircle, Clock } from 'lucide-react';

export const MyComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newComplaint, setNewComplaint] = useState({
    category: 'PLUMBING',
    title: '',
    description: '',
    priority: 'MEDIUM'
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await studentService.getComplaints();
      setComplaints(res.data || []);
    } catch (err) {
      console.error("Failed to load complaints", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComplaint = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await studentService.submitComplaint(newComplaint);
      setIsModalOpen(false);
      setNewComplaint({ category: 'PLUMBING', title: '', description: '', priority: 'MEDIUM' });
      fetchComplaints();
    } catch (err) {
      setError(err.message || 'Failed to submit complaint');
    }
  };

  if (loading) return <LoadingSpinner text="Fetching your complaint history..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Hostel Maintenance & Complaint Tickets</h2>
          <p className="text-xs text-gray-500 mt-1">Submit maintenance issues regarding plumbing, electrical, furniture or internet.</p>
        </div>
        <button
          onClick={() => { setError(''); setIsModalOpen(true); }}
          className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>+ Submit New Ticket</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {complaints.length === 0 ? (
          <div className="col-span-2 p-10 bg-white rounded-xl border border-gray-100 text-center text-xs text-gray-400">
            You have not submitted any complaints yet.
          </div>
        ) : (
          complaints.map(c => (
            <div key={c.id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-3">
              <div className="flex items-start justify-between">
                <span className="text-[10px] font-bold text-blue-600 uppercase bg-blue-50 px-2 py-0.5 rounded border border-blue-100">{c.category}</span>
                <StatusBadge status={c.status} />
              </div>

              <h3 className="text-base font-bold text-gray-900">{c.title}</h3>
              <p className="text-xs text-gray-600 bg-gray-50/80 p-3 rounded-xl border border-gray-100">{c.description}</p>

              {c.wardenComments && (
                <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 text-xs text-emerald-900 space-y-0.5">
                  <p className="font-bold flex items-center space-x-1 text-emerald-800">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Warden Response:</span>
                  </p>
                  <p>{c.wardenComments}</p>
                </div>
              )}

              <div className="pt-2 flex items-center justify-between text-[11px] text-gray-400 border-t border-gray-50">
                <span>Priority: <strong className="text-gray-700">{c.priority}</strong></span>
                <span>Submitted: {new Date(c.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Submit Complaint Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Submit Maintenance Ticket">
        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmitComplaint} className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Issue Category *</label>
              <select
                value={newComplaint.category}
                onChange={(e) => setNewComplaint({ ...newComplaint, category: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-semibold"
              >
                <option value="PLUMBING">PLUMBING</option>
                <option value="ELECTRICAL">ELECTRICAL</option>
                <option value="FURNITURE">FURNITURE</option>
                <option value="CLEANLINESS">CLEANLINESS</option>
                <option value="INTERNET">INTERNET</option>
                <option value="OTHER">OTHER</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Priority Level</label>
              <select
                value={newComplaint.priority}
                onChange={(e) => setNewComplaint({ ...newComplaint, priority: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-semibold"
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="URGENT">URGENT</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Complaint Title *</label>
            <input
              type="text"
              required
              value={newComplaint.title}
              onChange={(e) => setNewComplaint({ ...newComplaint, title: e.target.value })}
              placeholder="e.g. Broken study lamp in Room 101"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Detailed Description *</label>
            <textarea
              rows="3"
              required
              value={newComplaint.description}
              onChange={(e) => setNewComplaint({ ...newComplaint, description: e.target.value })}
              placeholder="Describe the issue clearly..."
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
            />
          </div>

          <div className="pt-3 flex justify-end space-x-2">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-100 rounded-xl font-semibold">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold">Submit Ticket</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MyComplaints;
