import React, { useState, useEffect } from 'react';
import { wardenService } from '../../services/wardenService';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { StatusBadge } from '../common/StatusBadge';
import { Search, BedDouble, User } from 'lucide-react';

export const WardenRooms = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await wardenService.getStudents();
      setStudents(res.data || []);
    } catch (err) {
      console.error("Failed to load students", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(s => 
    s.user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.roomDetails && s.roomDetails.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) return <LoadingSpinner text="Fetching student room directory..." />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Student Directory & Room Allocation</h2>
        <p className="text-xs text-gray-500 mt-1">View list of residents assigned to hostel rooms under warden supervision.</p>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search student name, roll no, room no..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-700 uppercase font-semibold">
              <tr>
                <th className="px-5 py-3.5">Student Resident</th>
                <th className="px-5 py-3.5">Roll Number</th>
                <th className="px-5 py-3.5">Department</th>
                <th className="px-5 py-3.5">Year</th>
                <th className="px-5 py-3.5">Room Assignment</th>
                <th className="px-5 py-3.5">Guardian Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-5 py-8 text-center text-gray-400">
                    No matching student room records found.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center border border-blue-200">
                          {s.user.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{s.user.fullName}</div>
                          <div className="text-[11px] text-gray-400">{s.user.phone || s.user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-mono font-bold text-gray-800">{s.rollNumber}</td>
                    <td className="px-5 py-4">{s.department}</td>
                    <td className="px-5 py-4 font-medium">{s.yearOfStudy}rd Year</td>
                    <td className="px-5 py-4">
                      {s.roomDetails ? (
                        <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg font-bold">
                          <BedDouble className="w-3.5 h-3.5" />
                          <span>Room {s.roomDetails.roomNumber} ({s.roomDetails.hostelName})</span>
                        </div>
                      ) : (
                        <span className="text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded text-[11px] font-semibold">Unallocated</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-semibold">{s.guardianName || 'N/A'}</div>
                      <div className="text-[11px] text-gray-400 font-mono">{s.guardianPhone || '-'}</div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WardenRooms;
