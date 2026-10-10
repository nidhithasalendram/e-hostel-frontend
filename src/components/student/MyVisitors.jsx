import React, { useState, useEffect } from 'react';
import { studentService } from '../../services/studentService';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { StatusBadge } from '../common/StatusBadge';
import { UserCheck, UserPlus, Edit3, LogOut, CheckCircle2, AlertCircle, Phone, FileText, User } from 'lucide-react';

export const MyVisitors = () => {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingVisitor, setEditingVisitor] = useState(null); // null = Add, object = Edit

  const [formData, setFormData] = useState({
    visitorName: '',
    relationship: '',
    visitorPhone: '',
    idProofNumber: '',
    purpose: ''
  });

  useEffect(() => {
    fetchVisitors();
  }, []);

  const fetchVisitors = async () => {
    try {
      const res = await studentService.getVisitors();
      setVisitors(res.data || []);
    } catch (err) {
      console.error("Failed to load visitor logs", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingVisitor(null);
    setFormData({
      visitorName: '',
      relationship: 'Parent / Family',
      visitorPhone: '',
      idProofNumber: '',
      purpose: ''
    });
    setError('');
    setShowModal(true);
  };

  const handleOpenEditModal = (visitor) => {
    setEditingVisitor(visitor);
    setFormData({
      visitorName: visitor.visitorName || '',
      relationship: visitor.relationship || '',
      visitorPhone: visitor.visitorPhone || '',
      idProofNumber: visitor.idProofNumber || '',
      purpose: visitor.purpose || ''
    });
    setError('');
    setShowModal(true);
  };

  const handleSaveVisitor = async (e) => {
    e.preventDefault();
    if (!formData.visitorName || !formData.relationship) {
      setError('Visitor Name and Relationship are required.');
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      if (editingVisitor) {
        await studentService.updateVisitor(editingVisitor.id, formData);
        setSuccess('Visitor profile updated successfully!');
      } else {
        await studentService.addVisitor(formData);
        setSuccess('Visitor registered successfully!');
      }
      setShowModal(false);
      fetchVisitors();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to save visitor log');
    } finally {
      setSaving(false);
    }
  };

  const handleCheckout = async (visitorId) => {
    try {
      await studentService.checkOutVisitor(visitorId);
      setSuccess('Visitor checked out successfully!');
      fetchVisitors();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to check out visitor');
    }
  };

  if (loading) return <LoadingSpinner text="Fetching your visitor records..." />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Personal Visitor Management</h2>
          <p className="text-xs text-gray-500 mt-1">Register new visitors, update visitor profiles, and view entry/exit logs.</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Register New Visitor</span>
        </button>
      </div>

      {success && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center space-x-2 text-emerald-700 text-xs">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center space-x-2 text-rose-700 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Visitor Table Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-700 uppercase font-semibold">
              <tr>
                <th className="px-5 py-3.5">Visitor Name & Phone</th>
                <th className="px-5 py-3.5">Relationship</th>
                <th className="px-5 py-3.5">Purpose & ID Proof</th>
                <th className="px-5 py-3.5">Entry / Exit Time</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {visitors.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-5 py-10 text-center text-gray-400">
                    No visitor logs recorded for you yet. Click "Register New Visitor" to add guest details.
                  </td>
                </tr>
              ) : (
                visitors.map((v) => (
                  <tr key={v.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-gray-900">{v.visitorName}</div>
                      <div className="text-[11px] text-gray-400 mt-0.5">{v.visitorPhone || 'No phone'}</div>
                    </td>
                    <td className="px-5 py-4 font-medium">{v.relationship}</td>
                    <td className="px-5 py-4">
                      <div>{v.purpose || '-'}</div>
                      {v.idProofNumber && (
                        <div className="text-[10px] text-gray-400 mt-0.5 font-mono">ID: {v.idProofNumber}</div>
                      )}
                    </td>
                    <td className="px-5 py-4 font-mono text-[11px]">
                      <div>In: {new Date(v.entryTime).toLocaleString()}</div>
                      {v.exitTime ? (
                        <div className="text-gray-400 mt-0.5">Out: {new Date(v.exitTime).toLocaleString()}</div>
                      ) : (
                        <div className="text-amber-600 font-semibold mt-0.5">Currently In Hostel</div>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={v.status} />
                    </td>
                    <td className="px-5 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(v)}
                        className="inline-flex items-center space-x-1 px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-[11px] font-semibold transition-colors"
                        title="Edit / Update Visitor Profile"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit Profile</span>
                      </button>
                      {v.status !== 'CHECKED_OUT' && (
                        <button
                          onClick={() => handleCheckout(v.id)}
                          className="inline-flex items-center space-x-1 px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-[11px] font-semibold transition-colors"
                          title="Check Out Visitor"
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

      {/* Add / Edit Visitor Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-2xl shadow-2xl border border-gray-100 p-6 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center space-x-3 border-b border-gray-100 pb-4">
              <div className="p-2.5 bg-blue-100 text-blue-700 rounded-xl">
                <UserCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  {editingVisitor ? 'Update Visitor Profile' : 'Register New Visitor'}
                </h3>
                <p className="text-xs text-gray-500">Enter personal & identification details of your guest</p>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSaveVisitor} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Visitor Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.visitorName}
                    onChange={(e) => setFormData({ ...formData, visitorName: e.target.value })}
                    placeholder="e.g. Robert Smith"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Relationship *</label>
                  <select
                    value={formData.relationship}
                    onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                  >
                    <option value="Parent / Family">Parent / Family</option>
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Friend">Friend</option>
                    <option value="Relative">Relative</option>
                    <option value="Guardian">Guardian</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Contact Phone Number</label>
                  <input
                    type="text"
                    value={formData.visitorPhone}
                    onChange={(e) => setFormData({ ...formData, visitorPhone: e.target.value })}
                    placeholder="+1-555-0199"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">ID Proof Number / Passport</label>
                  <input
                    type="text"
                    value={formData.idProofNumber}
                    onChange={(e) => setFormData({ ...formData, idProofNumber: e.target.value })}
                    placeholder="e.g. DL-889920 or Passport"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Purpose of Visit</label>
                <textarea
                  rows="2"
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  placeholder="e.g. Bringing luggage and books"
                  className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md transition-all disabled:opacity-70"
                >
                  {saving ? 'Saving...' : editingVisitor ? 'Update Profile' : 'Register Visitor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyVisitors;
