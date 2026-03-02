'use client';

import { useEffect, useState } from 'react';
import { bookingsApi, facilitiesApi } from '@/lib/api';
import { Booking } from '@/types/booking';
import { Facility } from '@/types/facility';
import { Card, CardBody, Button, Select, Input } from '@/components/ui';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useToast } from '@/lib/toast';
import { formatDate, formatTime, getStatusColor } from '@/lib/utils';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterFacility, setFilterFacility] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [bookingsData, facilitiesData] = await Promise.all([
        bookingsApi.getAll(),
        facilitiesApi.getAll(),
      ]);
      setBookings(bookingsData);
      setFacilities(facilitiesData);
    } catch (error) {
      toast('Failed to load bookings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (bookingId: string) => {
    try {
      await bookingsApi.update(bookingId, { status: 'confirmed' });
      setBookings(prev => prev.map(b => 
        b.id === bookingId ? { ...b, status: 'confirmed' } : b
      ));
      toast('Booking approved successfully', 'success');
    } catch (error) {
      toast('Failed to approve booking', 'error');
    }
  };

  const handleReject = async (bookingId: string) => {
    try {
      await bookingsApi.update(bookingId, { status: 'cancelled' });
      setBookings(prev => prev.map(b => 
        b.id === bookingId ? { ...b, status: 'cancelled' } : b
      ));
      toast('Booking rejected', 'success');
    } catch (error) {
      toast('Failed to reject booking', 'error');
    }
  };

  const handleCancel = async (bookingId: string) => {
    try {
      await bookingsApi.cancel(bookingId);
      setBookings(prev => prev.map(b => 
        b.id === bookingId ? { ...b, status: 'cancelled' } : b
      ));
      toast('Booking cancelled', 'success');
    } catch (error) {
      toast('Failed to cancel booking', 'error');
    }
  };

  const handleDelete = async (bookingId: string) => {
    if (!confirm('Are you sure you want to delete this booking?')) return;
    
    try {
      await bookingsApi.delete(bookingId);
      setBookings(prev => prev.filter(b => b.id !== bookingId));
      toast('Booking deleted', 'success');
    } catch (error) {
      toast('Failed to delete booking', 'error');
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
    const matchesFacility = filterFacility === 'all' || booking.facility_id.toString() === filterFacility;
    const matchesSearch = searchTerm === '' || 
      booking.facility_id.toString().includes(searchTerm) ||
      booking.user_id.toString().includes(searchTerm) ||
      booking.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesFacility && matchesSearch;
  });

  const getFacilityName = (facilityId: number) => {
    const facility = facilities.find(f => f.id === facilityId.toString());
    return facility?.name || `Facility ${facilityId}`;
  };

  return (
    <ProtectedRoute requireAdmin>
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Booking Management</h1>
            <p className="text-slate-400 mt-2">Approve, reject, and manage all bookings</p>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardBody className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                options={[
                  { value: 'all', label: 'All Status' },
                  { value: 'pending', label: 'Pending' },
                  { value: 'confirmed', label: 'Confirmed' },
                  { value: 'cancelled', label: 'Cancelled' },
                ]}
              />
              
              <Select
                value={filterFacility}
                onChange={(e) => setFilterFacility(e.target.value)}
                options={[
                  { value: 'all', label: 'All Facilities' },
                  ...facilities.map(f => ({ value: f.id.toString(), label: f.name }))
                ]}
              />
              
              <Button onClick={loadData} disabled={loading}>
                {loading ? 'Refreshing...' : 'Refresh'}
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Bookings List */}
        <Card>
          <CardBody className="p-6">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="h-16 bg-slate-800 rounded animate-pulse"></div>
                ))}
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">📅</div>
                <p className="text-slate-400">No bookings found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-800">
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Facility</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">User ID</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Date</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Time</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Notes</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map(booking => (
                      <tr key={booking.id} className="border-b border-slate-800 hover:bg-slate-900/50">
                        <td className="py-3 px-4">
                          <div className="font-medium text-white">{getFacilityName(booking.facility_id)}</div>
                        </td>
                        <td className="py-3 px-4 text-slate-300">#{booking.user_id}</td>
                        <td className="py-3 px-4 text-slate-300">{formatDate(booking.date)}</td>
                        <td className="py-3 px-4 text-slate-300">
                          {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-300 text-sm">
                          {booking.notes || '-'}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            {booking.status === 'pending' && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => handleApprove(booking.id)}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => handleReject(booking.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Reject
                                </Button>
                              </>
                            )}
                            {booking.status === 'confirmed' && (
                              <Button
                                size="sm"
                                onClick={() => handleCancel(booking.id)}
                                className="bg-yellow-600 hover:bg-yellow-700"
                              >
                                Cancel
                              </Button>
                            )}
                            <Button
                              size="sm"
                              onClick={() => handleDelete(booking.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
