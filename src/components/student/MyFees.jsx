import React, { useState, useEffect } from 'react';
import { studentService } from '../../services/studentService';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';
import { DollarSign, CreditCard, CheckCircle, AlertCircle, ShieldCheck } from 'lucide-react';

export const MyFees = () => {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Payment Modal
  const [selectedFee, setSelectedFee] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('ONLINE');
  const [txnRef, setTxnRef] = useState('');
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    try {
      const res = await studentService.getFees();
      setFees(res.data || []);
    } catch (err) {
      console.error("Failed to load fees", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePayFee = async (e) => {
    e.preventDefault();
    setError('');
    setPaying(true);
    try {
      await studentService.payFee(selectedFee.id, {
        paymentMethod,
        transactionRef: txnRef || `TXN-${System.currentTimeMillis()}`
      });
      setSelectedFee(null);
      fetchFees();
    } catch (err) {
      setError(err.message || 'Payment processing failed');
    } finally {
      setPaying(false);
    }
  };

  if (loading) return <LoadingSpinner text="Fetching your fee bills..." />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">My Hostel Fee Bills & Payment History</h2>
        <p className="text-xs text-gray-500 mt-1">Review outstanding fee invoices, due dates, and make secure online fee payments.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-700 uppercase font-semibold">
              <tr>
                <th className="px-5 py-3.5">Bill Title</th>
                <th className="px-5 py-3.5">Amount</th>
                <th className="px-5 py-3.5">Due Date</th>
                <th className="px-5 py-3.5">Paid Date</th>
                <th className="px-5 py-3.5">Transaction Ref</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {fees.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-5 py-8 text-center text-gray-400">
                    No fee records assigned to your account.
                  </td>
                </tr>
              ) : (
                fees.map(f => (
                  <tr key={f.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4 font-semibold text-gray-900">{f.title}</td>
                    <td className="px-5 py-4 font-bold text-gray-900">${f.amount}</td>
                    <td className="px-5 py-4 font-mono">{f.dueDate}</td>
                    <td className="px-5 py-4 font-mono">{f.paidDate || '-'}</td>
                    <td className="px-5 py-4 font-mono text-[11px]">{f.transactionRef || '-'}</td>
                    <td className="px-5 py-4">
                      <StatusBadge status={f.paymentStatus} />
                    </td>
                    <td className="px-5 py-4 text-right">
                      {f.paymentStatus !== 'PAID' && (
                        <button
                          onClick={() => {
                            setSelectedFee(f);
                            setTxnRef(`TXN-${Math.floor(1000000000 + Math.random() * 9000000000)}`);
                            setError('');
                          }}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] rounded-lg shadow-xs transition-colors flex items-center space-x-1 ml-auto"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>Pay Now</span>
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

      {/* Pay Fee Modal */}
      <Modal isOpen={!!selectedFee} onClose={() => setSelectedFee(null)} title="Pay Hostel Fee">
        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {selectedFee && (
          <form onSubmit={handlePayFee} className="space-y-4 text-xs">
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-1">
              <p className="text-gray-400 uppercase text-[10px] font-bold">Fee Bill Summary</p>
              <p className="text-sm font-bold text-gray-900">{selectedFee.title}</p>
              <p className="text-xl font-extrabold text-emerald-600">${selectedFee.amount}</p>
              <p className="text-[11px] text-gray-500">Due Date: {selectedFee.dueDate}</p>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Select Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-semibold"
              >
                <option value="ONLINE">Online Net Banking / Debit Card</option>
                <option value="BANK_TRANSFER">Bank Wire Transfer</option>
                <option value="CASH">Cash Deposit at Hostel Desk</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Transaction Reference Number</label>
              <input
                type="text"
                required
                value={txnRef}
                onChange={(e) => setTxnRef(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-mono"
              />
            </div>

            <div className="pt-2 flex justify-end space-x-2">
              <button type="button" onClick={() => setSelectedFee(null)} className="px-4 py-2 bg-gray-100 rounded-xl font-semibold">Cancel</button>
              <button
                type="submit"
                disabled={paying}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold flex items-center space-x-1.5 shadow-sm"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{paying ? 'Processing...' : 'Confirm & Pay'}</span>
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default MyFees;
