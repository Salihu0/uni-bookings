'use client';

import { useEffect, useState } from 'react';
import { facilitiesApi, bookingsApi, authApi } from '@/lib/api';
import { Facility } from '@/types/facility';
import { Booking } from '@/types/booking';
import { User } from '@/types/auth';
import { Card, CardBody, Button } from '@/components/ui';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';

export default function AdminDashboard() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [facilitiesData, bookingsData] = await Promise.all([
          facilitiesApi.getAll(),
          bookingsApi.getAll(),
        ]);
        setFacilities(facilitiesData);
        setBookings(bookingsData);
      } catch (error) {
        console.error('Failed to load admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const stats = {
    totalFacilities: facilities.length,
    totalBookings: bookings.length,
    pendingBookings: bookings.filter(b => b.status === 'pending').length,
    confirmedBookings: bookings.filter(b => b.status === 'confirmed').length,
    cancelledBookings: bookings.filter(b => b.status === 'cancelled').length,
    todayBookings: bookings.filter(b => {
      const bookingDate = new Date(b.date).toDateString();
      const today = new Date().toDateString();
      return bookingDate === today;
    }).length,
  };

  return (
    <ProtectedRoute requireAdmin>
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-slate-400 mt-2">Manage facilities, bookings, and users</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-slate-800">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400">Total Facilities</p>
                  <p className="text-2xl font-bold text-white mt-1">{stats.totalFacilities}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center text-2xl">
                  🏢
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="border-slate-800">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400">Total Bookings</p>
                  <p className="text-2xl font-bold text-white mt-1">{stats.totalBookings}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-violet-500/10 text-violet-400 flex items-center justify-center text-2xl">
                  📅
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="border-slate-800">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400">Pending Bookings</p>
                  <p className="text-2xl font-bold text-white mt-1">{stats.pendingBookings}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-yellow-500/10 text-yellow-400 flex items-center justify-center text-2xl">
                  ⏳
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="border-slate-800">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400">Today's Bookings</p>
                  <p className="text-2xl font-bold text-white mt-1">{stats.todayBookings}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-green-500/10 text-green-400 flex items-center justify-center text-2xl">
                  📆
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/admin/facilities">
            <Card className="group hover:border-slate-700 transition-all cursor-pointer">
              <CardBody className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center text-2xl">
                    🏢
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Manage Facilities</h3>
                    <p className="text-sm text-slate-400">Add, edit, or delete facilities</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Link>

          <Link href="/admin/bookings">
            <Card className="group hover:border-slate-700 transition-all cursor-pointer">
              <CardBody className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center text-2xl">
                    📅
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Manage Bookings</h3>
                    <p className="text-sm text-slate-400">Approve, reject, or cancel bookings</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Link>

          <Link href="/admin/users">
            <Card className="group hover:border-slate-700 transition-all cursor-pointer">
              <CardBody className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-500/10 text-green-400 flex items-center justify-center text-2xl">
                    👥
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Manage Users</h3>
                    <p className="text-sm text-slate-400">View and manage user accounts</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Bookings */}
          <Card>
            <CardBody className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Recent Bookings</h3>
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-12 bg-slate-800 rounded animate-pulse"></div>
                  ))}
                </div>
              ) : bookings.slice(0, 5).length === 0 ? (
                <p className="text-slate-400 text-center py-8">No bookings yet</p>
              ) : (
                <div className="space-y-3">
                  {bookings.slice(0, 5).map(booking => (
                    <div key={booking.id} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-white">Facility {booking.facility_id}</p>
                        <p className="text-xs text-slate-400">{new Date(booking.date).toLocaleDateString()}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        booking.status === 'confirmed' ? 'bg-green-500/10 text-green-400' :
                        booking.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400' :
                        'bg-red-500/10 text-red-400'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>

          {/* Facilities Overview */}
          <Card>
            <CardBody className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Facilities Overview</h3>
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-12 bg-slate-800 rounded animate-pulse"></div>
                  ))}
                </div>
              ) : facilities.slice(0, 5).length === 0 ? (
                <p className="text-slate-400 text-center py-8">No facilities yet</p>
              ) : (
                <div className="space-y-3">
                  {facilities.slice(0, 5).map(facility => (
                    <div key={facility.id} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-white">{facility.name}</p>
                        <p className="text-xs text-slate-400">{facility.location} • Capacity: {facility.capacity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
