import React, { useState, useEffect } from 'react';
import { studentService } from '../../services/studentService';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { StatusBadge } from '../common/StatusBadge';
import { 
  DoorOpen, 
  Building, 
  BedDouble, 
  UserCheck, 
  CheckCircle2, 
  AlertCircle, 
  PlusCircle, 
  ArrowRightLeft,
  Phone,
  Mail,
  MapPin,
  Info,
  Filter,
  Search
} from 'lucide-react';

export const RoomDetails = () => {
  const [allocation, setAllocation] = useState(null);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allocating, setAllocating] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedHostelFilter, setSelectedHostelFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [notes, setNotes] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [roomRes, availRes, hostelsRes] = await Promise.all([
        studentService.getRoomDetails(),
        studentService.getAvailableRooms(),
        studentService.getHostels()
      ]);
      setAllocation(roomRes.data);
      setAvailableRooms(availRes.data || []);
      setHostels(hostelsRes.data || []);
    } catch (err) {
      console.error("Failed to load room or hostel details", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenConfirmModal = (room) => {
    setSelectedRoom(room);
    setNotes('');
    setError('');
    setShowConfirmModal(true);
  };

  const handleAllocateRoom = async (e) => {
    e.preventDefault();
    if (!selectedRoom) return;

    setAllocating(true);
    setError('');
    setSuccess('');

    try {
      await studentService.allocateRoom(selectedRoom.id, notes || 'Allocated by student');
      const actionText = allocation ? 'shifted to' : 'allocated';
      setSuccess(`Successfully ${actionText} Room ${selectedRoom.roomNumber} (${selectedRoom.hostelName})!`);
      setShowConfirmModal(false);
      setSelectedRoom(null);
      setNotes('');
      // Refresh all data
      await fetchData();
    } catch (err) {
      setError(err.message || 'Failed to allocate/shift room');
    } finally {
      setAllocating(false);
    }
  };

  if (loading) return <LoadingSpinner text="Fetching hostels and available rooms..." />;

  const currentRoom = allocation?.room;

  // Filter available rooms
  const filteredRooms = availableRooms.filter(room => {
    const matchesHostel = selectedHostelFilter === 'ALL' || room.hostelId === Number(selectedHostelFilter) || room.hostelName === selectedHostelFilter;
    const matchesSearch = searchQuery === '' || 
      room.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.hostelName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.roomType.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesHostel && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Hostel Directory & Room Allocation</h2>
          <p className="text-xs text-gray-500 mt-1">Explore all hostels, check assigned wardens, and select or shift to available rooms.</p>
        </div>
      </div>

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center space-x-3 text-emerald-700 text-xs">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
          <span className="font-medium">{success}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center space-x-3 text-rose-700 text-xs">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      {/* 1. Active Room Allocation Card */}
      {allocation ? (
        <div className="bg-gradient-to-br from-blue-900 to-slate-900 text-white rounded-2xl p-6 shadow-lg space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div className="flex items-center space-x-3.5">
              <div className="p-3 bg-blue-500/20 text-blue-300 rounded-xl border border-blue-400/20 backdrop-blur-xs">
                <DoorOpen className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-blue-300 bg-blue-500/20 px-2.5 py-0.5 rounded-full border border-blue-400/20">
                  Current Assigned Room
                </span>
                <h3 className="text-2xl font-extrabold text-white mt-1">Room {currentRoom?.roomNumber}</h3>
                <p className="text-xs text-slate-300">{currentRoom?.hostelName}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-semibold rounded-xl border border-emerald-500/30">
                ACTIVE ALLOCATION
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-3.5 bg-white/5 rounded-xl border border-white/10 backdrop-blur-xs">
              <p className="text-slate-400 text-[10px] uppercase font-bold">Floor Level</p>
              <p className="text-base font-bold text-white mt-0.5">Floor {currentRoom?.floor}</p>
            </div>
            <div className="p-3.5 bg-white/5 rounded-xl border border-white/10 backdrop-blur-xs">
              <p className="text-slate-400 text-[10px] uppercase font-bold">Room Category</p>
              <p className="text-base font-bold text-white mt-0.5">{currentRoom?.roomType}</p>
            </div>
            <div className="p-3.5 bg-white/5 rounded-xl border border-white/10 backdrop-blur-xs">
              <p className="text-slate-400 text-[10px] uppercase font-bold">Occupancy</p>
              <p className="text-base font-bold text-white mt-0.5">{currentRoom?.occupiedCount} / {currentRoom?.capacity} Beds</p>
            </div>
            <div className="p-3.5 bg-white/5 rounded-xl border border-white/10 backdrop-blur-xs">
              <p className="text-slate-400 text-[10px] uppercase font-bold">Monthly Fee</p>
              <p className="text-base font-bold text-emerald-400 mt-0.5">${currentRoom?.monthlyFee}/mo</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-300 pt-2 border-t border-white/10">
            <div>
              <span>Allocated On: <strong>{allocation.allocatedDate}</strong></span>
              {allocation.notes && <span className="ml-3 italic">({allocation.notes})</span>}
            </div>
            <a
              href="#available-rooms"
              className="inline-flex items-center space-x-2 text-blue-300 hover:text-white font-semibold underline text-xs"
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span>Shift / Request Different Room ↓</span>
            </a>
          </div>
        </div>
      ) : (
        <div className="p-6 bg-amber-50/70 rounded-2xl border border-amber-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center space-x-3.5">
            <div className="p-3 bg-amber-100 text-amber-800 rounded-xl">
              <DoorOpen className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-amber-900">No Room Currently Allocated</h3>
              <p className="text-xs text-amber-700 mt-0.5">Browse the available hostels and room options below to pick your preferred accommodation.</p>
            </div>
          </div>
          <a
            href="#available-rooms"
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-all whitespace-nowrap"
          >
            Allocate Room Now ↓
          </a>
        </div>
      )}

      {/* 2. All 3 Hostels Overview Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
              <Building className="w-5 h-5 text-blue-600" />
              <span>All Hostels & Assigned Wardens ({hostels.length})</span>
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">Complete overview of available campus hostels and warden contacts.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {hostels.map((hostel) => (
            <div 
              key={hostel.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
            >
              <div className="p-5 space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                      {hostel.code}
                    </span>
                    <h4 className="text-base font-bold text-gray-900 mt-1.5 line-clamp-1">{hostel.name}</h4>
                  </div>
                  <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-xl border ${
                    hostel.genderType === 'GIRLS' 
                      ? 'bg-pink-50 text-pink-700 border-pink-100'
                      : hostel.genderType === 'BOYS'
                      ? 'bg-blue-50 text-blue-700 border-blue-100'
                      : 'bg-purple-50 text-purple-700 border-purple-100'
                  }`}>
                    {hostel.genderType}
                  </span>
                </div>

                <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">{hostel.description}</p>

                <div className="space-y-1.5 text-xs text-gray-500 pt-2 border-t border-gray-100">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="truncate">{hostel.address}</span>
                  </div>
                </div>

                {/* Assigned Warden Box */}
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-gray-400">Assigned Warden</span>
                    <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                  {hostel.wardenName ? (
                    <div>
                      <p className="font-bold text-gray-900">{hostel.wardenName}</p>
                      {hostel.wardenPhone && (
                        <div className="flex items-center space-x-1 text-[11px] text-gray-500 mt-0.5">
                          <Phone className="w-3 h-3 text-gray-400" />
                          <span>{hostel.wardenPhone}</span>
                        </div>
                      )}
                      {hostel.wardenEmail && (
                        <div className="flex items-center space-x-1 text-[11px] text-gray-500 mt-0.5">
                          <Mail className="w-3 h-3 text-gray-400" />
                          <span className="truncate">{hostel.wardenEmail}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-[11px] text-gray-400 italic">Warden details pending</p>
                  )}
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-5 py-3 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-gray-500">Capacity: <strong>{hostel.totalCapacity} beds</strong></span>
                <span className="font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                  {hostel.availableRoomsCount || 0} Rooms Free
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Available Rooms Section */}
      <div id="available-rooms" className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
              <BedDouble className="w-5 h-5 text-blue-600" />
              <span>Available Rooms for Allocation & Shifting</span>
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">Select any open room across hostels to request allocation or shift your room.</p>
          </div>

          {/* Controls / Filter */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search room no. or hostel..."
                className="pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
              />
            </div>

            <div className="flex items-center space-x-1.5">
              <Filter className="w-3.5 h-3.5 text-gray-400" />
              <select
                value={selectedHostelFilter}
                onChange={(e) => setSelectedHostelFilter(e.target.value)}
                className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Hostels ({availableRooms.length} rooms)</option>
                {hostels.map(h => (
                  <option key={h.id} value={h.name}>{h.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {filteredRooms.length === 0 ? (
          <div className="p-10 text-center text-xs text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200 space-y-2">
            <DoorOpen className="w-8 h-8 text-gray-300 mx-auto" />
            <p className="font-semibold text-gray-600">No available rooms match your filter.</p>
            <p className="text-[11px] text-gray-400">Try changing the hostel filter or clear your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredRooms.map((room) => {
              const isCurrentAllocated = currentRoom?.id === room.id;
              const freeBeds = room.capacity - room.occupiedCount;

              return (
                <div
                  key={room.id}
                  className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                    isCurrentAllocated
                      ? 'border-blue-400 bg-blue-50/40 ring-2 ring-blue-500/20'
                      : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                          Floor {room.floor}
                        </span>
                        <h4 className="text-lg font-extrabold text-gray-900 mt-1">Room {room.roomNumber}</h4>
                        <p className="text-xs font-semibold text-gray-600">{room.hostelName}</p>
                      </div>
                      <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-100">
                        ${room.monthlyFee}/mo
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 text-xs">
                      <div className="p-2 bg-gray-50 rounded-lg">
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Room Type</p>
                        <p className="font-bold text-gray-800">{room.roomType}</p>
                      </div>
                      <div className="p-2 bg-gray-50 rounded-lg">
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Vacancy</p>
                        <p className="font-bold text-emerald-700">{freeBeds} Bed(s) Free</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100">
                    {isCurrentAllocated ? (
                      <div className="w-full py-2.5 text-center text-xs font-bold text-blue-700 bg-blue-100/60 rounded-xl">
                        Your Current Room
                      </div>
                    ) : (
                      <button
                        onClick={() => handleOpenConfirmModal(room)}
                        className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center space-x-2"
                      >
                        <ArrowRightLeft className="w-4 h-4" />
                        <span>{allocation ? 'Shift to This Room' : 'Allocate This Room'}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Confirmation & Shift Room Modal */}
      {showConfirmModal && selectedRoom && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl border border-gray-100 p-6 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center space-x-3 border-b border-gray-100 pb-4">
              <div className="p-2.5 bg-blue-100 text-blue-700 rounded-xl">
                <ArrowRightLeft className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  {allocation ? 'Confirm Room Shift' : 'Confirm Room Allocation'}
                </h3>
                <p className="text-xs text-gray-500">
                  {allocation ? 'You are requesting to shift to a new room' : 'Confirm room selection for your hostel stay'}
                </p>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="bg-gray-50 p-4 rounded-xl text-xs space-y-2.5 border border-gray-200">
              {allocation && (
                <div className="pb-2 border-b border-gray-200 text-gray-500">
                  <span className="block text-[10px] font-bold uppercase text-gray-400">Current Room:</span>
                  <span className="font-bold text-gray-800">Room {currentRoom?.roomNumber} ({currentRoom?.hostelName})</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-gray-500">Target Hostel:</span>
                <span className="font-bold text-gray-900">{selectedRoom.hostelName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Target Room:</span>
                <span className="font-bold text-gray-900">Room {selectedRoom.roomNumber} (Floor {selectedRoom.floor})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Room Category:</span>
                <span className="font-bold text-gray-900">{selectedRoom.roomType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Monthly Rent:</span>
                <span className="font-bold text-emerald-600">${selectedRoom.monthlyFee}/mo</span>
              </div>
            </div>

            <form onSubmit={handleAllocateRoom} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Reason / Notes for Allocation (Optional)</label>
                <textarea
                  rows="2"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Shifting to closer floor near study lounge"
                  className="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={allocating}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-md transition-all disabled:opacity-70"
                >
                  {allocating ? 'Processing...' : allocation ? 'Confirm Room Shift' : 'Confirm Allocation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomDetails;
