import React from 'react';
import { Inbox } from 'lucide-react';

export const EmptyState = ({ title = "No data found", description = "There are no records to display at this moment.", actionButton }) => {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
      <div className="p-3 bg-white rounded-full border border-gray-100 shadow-sm mb-3">
        <Inbox className="w-8 h-8 text-gray-400" />
      </div>
      <h4 className="text-base font-semibold text-gray-800 mb-1">{title}</h4>
      <p className="text-xs text-gray-500 max-w-sm mb-4">{description}</p>
      {actionButton}
    </div>
  );
};

export default EmptyState;
