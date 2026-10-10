import React from 'react';

export const StatusBadge = ({ status }) => {
  if (!status) return null;

  const normalized = status.toUpperCase();

  let colorClasses = 'bg-gray-100 text-gray-800 border-gray-200';

  if (['ACTIVE', 'AVAILABLE', 'PAID', 'RESOLVED', 'CHECKED_OUT'].includes(normalized)) {
    colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  } else if (['PENDING', 'IN_PROGRESS', 'IN_HOSTEL', 'MEDIUM', 'DOUBLE'].includes(normalized)) {
    colorClasses = 'bg-amber-50 text-amber-700 border-amber-200';
  } else if (['INACTIVE', 'OCCUPIED', 'OVERDUE', 'REJECTED', 'MAINTENANCE', 'HIGH', 'URGENT'].includes(normalized)) {
    colorClasses = 'bg-rose-50 text-rose-700 border-rose-200';
  } else if (['VACATED', 'REASSIGNED', 'SINGLE', 'TRIPLE', 'BOYS', 'GIRLS', 'COED'].includes(normalized)) {
    colorClasses = 'bg-blue-50 text-blue-700 border-blue-200';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colorClasses}`}>
      <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-current opacity-75"></span>
      {status.replace('_', ' ')}
    </span>
  );
};

export default StatusBadge;
