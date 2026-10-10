import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';
import { DollarSign, Plus, Search, Filter, AlertCircle, CheckCircle } from 'lucide-react';

export const FeeManagement = () => {
  const [fees, setFees] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newFee, setNewFee] = useState({
    studentId: '',
    title: 'Hostel & Mess Fee - Fall Semester 2026',
    amount: 2100,
    dueDate: '2026-10-31',
    remarks: 'Semester hostel fee charge'
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [fRes, sRes] = await Promise.all([
        adminService.issueFeeBill ? adminService.issueFeeBill : null, // dummy check
        adminService.getStudents()
      ]);
      const feeRes = await fetch('/api/fees', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('ehostel_token')}` }
      }).then(r => r.json());

      setFees(feeRes.data || []);
      setStudents(sRes.data || []);
      if (sRes.data && sRes.data.length > 0 && !newFee.studentId) {
        setNewFee(prev => ({ ...prev, studentId: sRes.data[0].user.id }));
      }
    } catch (err) {
      console.error("Failed to load fee records", err);
    } finally {
      setLoading(false);
    }
  };

  const handleIssueFee = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await adminService.issueFeeBill({
        studentId: parseInt(newFee.studentId),
        title: newFee.title,
        amount: parseFloat(newFee.amount),
        dueDate: newFee.dueDate,
        remarks: newFee.remarks
      });
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      setError(err.message || 'Failed to issue fee bill');
    }
  };

  const filteredFees = fees.filter(f => {
    if (statusFilter === 'ALL') return true;
    return f.paymentStatus === statusFilter;
  });

  if (loading) return <LoadingSpinner text="Fetching financial records..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Hostel Fee Management</h2>
          <p className="text-xs text-gray-500 mt-1">Issue semester fee demands, track payment statuses and transaction logs.</p>
        </div>
        <button
          onClick={() => { setError(''); setIsModalOpen(true); }}
          className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>+ Issue Fee Bill</span>
        </button>
      </div>

      {/* Controls */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-xs font-semibold text-gray-700">Payment Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none"
          >
            <option value="ALL">All Records ({fees.length})</option>
            <option value="PAID">Paid Only</option>
            <option value="PENDING">Pending Only</option>
            <option value="OVERDUE">Overdue Only</option>
          </select>
        </div>
      </div>

      {/* Fees Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-700 uppercase font-semibold">
              <tr>
                <th className="px-5 py-3.5">Student</th>
                <th className="px-5 py-3.5">Fee Title</th>
                <th className="px-5 py-3.5">Amount</th>
                <th className="px-5 py-3.5">Due Date</th>
                <th className="px-5 py-3.5">Payment Method</th>
                <th className="px-5 py-3.5">Transaction Ref</th>
                <th className="px-5 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredFees.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-5 py-8 text-center text-gray-400">
                    No fee records found.
                  </td>
                </tr>
              ) : (
                filteredFees.map((f) => (
                  <tr key={f.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-gray-900">{f.student?.fullName}</div>
                      <div className="text-[11px] text-gray-400">{f.student?.email}</div>
                    </td>
                    <td className="px-5 py-4 font-medium">{f.title}</td>
                    <td className="px-5 py-4 font-bold text-gray-900">${f.amount}</td>
                    <td className="px-5 py-4 font-mono">{f.dueDate}</td>
                    <td className="px-5 py-4">{f.paymentMethod || '-'}</td>
                    <td className="px-5 py-4 font-mono text-[11px]">{f.transactionRef || '-'}</td>
                    <td className="px-5 py-4">
                      <StatusBadge status={f.paymentStatus} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Issue Fee Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Issue Student Fee Bill">
        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleIssueFee} className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Select Student *</label>
            <select
              required
              value={newFee.studentId}
              onChange={(e) => setNewFee({ ...newFee, studentId: e.target.value })}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
            >
              {students.map((s) => (
                <option key={s.user.id} value={s.user.id}>
                  {s.user.fullName} ({s.rollNumber || s.user.username})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Bill Title *</label>
            <input
              type="text"
              required
              value={newFee.title}
              onChange={(e) => setNewFee({ ...newFee, title: e.target.value })}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Amount ($) *</label>
              <input
                type="number"
                step="0.01"
                required
                value={newFee.amount}
                onChange={(e) => setNewFee({ ...newFee, amount: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Due Date *</label>
              <input
                type="date"
                required
                value={newFee.dueDate}
                onChange={(e) => setNewFee({ ...newFee, dueDate: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Remarks / Note</label>
            <textarea
              rows="2"
              value={newFee.remarks}
              onChange={(e) => setNewFee({ ...newFee, remarks: e.target.value })}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
            />
          </div>

          <div className="pt-3 flex justify-end space-x-2">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-100 rounded-xl font-semibold">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold">Issue Bill</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default FeeManagement;
