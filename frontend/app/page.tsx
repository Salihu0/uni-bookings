'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { facilitiesApi } from '@/lib/api';
import { bookingsApi } from '@/lib/api';
import { Facility } from '@/types/facility';
import { Booking } from '@/types/booking';
import { Card, CardBody, Skeleton } from '@/components/ui';
import { getStatusColor, toTitleCase, formatDate, formatTime } from '@/lib/utils';
import ProtectedRoute from '@/components/ProtectedRoute';

function StatCard({
  label,
  value,
  icon,
  loading,
  accent,
}: {
  label: string;
  value: number | string;
  icon: string;
  loading?: boolean;
  accent: string;
}) {
  return (
    <Card className="group hover:border-slate-700 transition-all">
      <CardBody className="flex items-center gap-4">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${accent}`}
        >
          {icon}
        </div>
        <div>
          {loading ? (
            <Skeleton className="h-7 w-16 mb-1" />
          ) : (
            <div className="text-2xl font-bold text-white">{value}</div>
          )}
          <div className="text-sm text-slate-400">{label}</div>
        </div>
      </CardBody>
    </Card>
  );
}

export default function DashboardPage() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([facilitiesApi.getAll(), bookingsApi.getAll()])
      .then(([f, b]) => {
        setFacilities(f);
        setBookings(b);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const activeBookings = bookings.filter((b) => b.status !== 'cancelled');
  const recentBookings = bookings.slice(0, 5);

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 py-10 space-y-10 animate-fade-up">
        {/* Hero */}

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Facilities"
            value={facilities.length}
            icon="🏢"
            loading={loading}
            accent="bg-violet-900/40 border border-violet-800/30"
          />
          <StatCard
            label="Total Bookings"
            value={bookings.length}
            icon="📅"
            loading={loading}
            accent="bg-blue-900/40 border border-blue-800/30"
          />
          <StatCard
            label="Active Bookings"
            value={activeBookings.length}
            icon="✅"
            loading={loading}
            accent="bg-emerald-900/40 border border-emerald-800/30"
          />
          <StatCard
            label="Cancelled"
            value={bookings.filter((b) => b.status === 'cancelled').length}
            icon="✕"
            loading={loading}
            accent="bg-red-900/40 border border-red-800/30"
          />
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              href: '/facilities',
              icon: '🏢',
              label: 'View Facilities',
              desc: 'Browse all campus spaces',
              color: 'from-violet-900/40 to-slate-900 border-violet-800/30 hover:border-violet-600/60',
            },
            {
              href: '/bookings/new',
              icon: '+',
              label: 'Create Booking',
              desc: 'Reserve a facility now',
              color: 'from-emerald-900/40 to-slate-900 border-emerald-800/30 hover:border-emerald-600/60',
            },
            {
              href: '/bookings',
              icon: '📋',
              label: 'Booking History',
              desc: 'View all your bookings',
              color: 'from-blue-900/40 to-slate-900 border-blue-800/30 hover:border-blue-600/60',
            },
          ].map((item) => (
            <Link key={item.href} href={item.href}>
              <div
                className={`group bg-gradient-to-br ${item.color} border rounded-2xl px-6 py-5 flex items-center gap-4 cursor-pointer transition-all duration-150 hover:scale-[1.01]`}
              >
                <div className="w-11 h-11 rounded-xl bg-slate-800/80 flex items-center justify-center text-2xl border border-slate-700 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <div>
                  <div className="font-semibold text-white text-sm">{item.label}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{item.desc}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Recent bookings */}
        <Card>
          <div className="px-6 pt-5 pb-4 border-b border-slate-800 flex items-center justify-between">
            <h2 className="font-bold text-white">Recent Bookings</h2>
            <Link
              href="/bookings"
              className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
            >
              View all →
            </Link>
          </div>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-6 space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : recentBookings.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                No bookings yet.{' '}
                <Link href="/bookings/new" className="text-violet-400 hover:text-violet-300">
                  Create one
                </Link>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-slate-500 border-b border-slate-800">
                    <th className="px-4 py-2.5 text-left font-medium">Facility</th>
                    <th className="px-4 py-2.5 text-left font-medium">Date</th>
                    <th className="px-4 py-2.5 text-left font-medium">Time</th>
                    <th className="px-4 py-2.5 text-left font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((b) => (
                    <tr
                      key={b.id}
                      className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="px-4 py-3 text-white font-medium">
                        {b.facilityName || b.facility_id}
                      </td>
                      <td className="px-4 py-3 text-slate-400">{formatDate(b.date)}</td>
                      <td className="px-4 py-3 text-slate-400">
                        {formatTime(b.start_time)} – {formatTime(b.end_time)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(b.status)}`}
                        >
                          {toTitleCase(b.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
