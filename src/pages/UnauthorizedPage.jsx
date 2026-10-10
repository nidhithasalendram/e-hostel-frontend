import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 text-center">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-gray-100 shadow-md space-y-4">
        <div className="p-3 bg-rose-50 text-rose-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto border border-rose-100">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">403 - Access Denied</h2>
        <p className="text-xs text-gray-500">
          You do not have administrative permissions to view this resource.
        </p>
        <Link
          to="/"
          className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white font-semibold text-xs rounded-xl shadow-xs hover:bg-blue-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
