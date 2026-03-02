'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { bookingsApi } from '@/lib/api';
import { Booking } from '@/types/booking';
import { useToast } from '@/lib/toast';
import { AvailabilityDisplay } from '@/components/AvailabilityDisplay';
import { getStatusColor, formatTime, formatDate, toTitleCase } from '@/lib/utils';
import {
  Card,
  Button,
  Badge,
  PageLoader,
  ErrorMessage,
  ConfirmDialog,
  Input,
  Select,
  EmptyState,
  Skeleton,
} from '@/components/ui';

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'pending', label: 'Pending' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'completed', label: 'Completed' },
];

const PAGE_SIZE = 10;

export default function BookingsPage() {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  // Action states
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Booking | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await bookingsApi.getAll();
      setBookings(data);
    } catch (e: any) {
      setError(e.userMessage || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    let result = bookings;
    if (statusFilter) result = result.filter((b) => b.status === statusFilter);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (b) =>
          (b.facilityName || b.facility_id).toLowerCase().includes(q) ||
          b.user_id.toLowerCase().includes(q) ||
          b.date.includes(q)
      );
    }
    return result;
  }, [bookings, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleCancel = async (id: string) => {
    setCancellingId(id);
    // Optimistic update
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: 'cancelled' } : b))
    );
    try {
      await bookingsApi.cancel(id);
      toast('Booking cancelled', 'success');
    } catch (e: any) {
      // Revert
      setBookings((prev) =>
        prev.map((b) =>
          b.id === id ? { ...b, status: 'confirmed' } : b
        )
      );
      toast(e.userMessage || 'Failed to cancel booking', 'error');
    } finally {
      setCancellingId(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    const id = deleteTarget.id;
    setDeletingId(id);
    // Optimistic remove
    setBookings((prev) => prev.filter((b) => b.id !== id));
    setDeleteTarget(null);
    try {
      await bookingsApi.delete(id);
      toast('Booking deleted', 'success');
    } catch (e: any) {
      load(); // refetch on failure
      toast(e.userMessage || 'Failed to delete booking', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-8 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Booking History</h1>
          <p className="text-slate-400 text-sm mt-1">
            {bookings.length} total bookings
          </p>
        </div>
        <Link href="/bookings/new">
          <Button>+ New Booking</Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="Search facility, user, or date…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <div className="sm:w-48">
          <Select
            options={STATUS_OPTIONS}
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          />
        </div>
      </div>

      {/* Availability Display */}
      {watchedfacility_id && watchedDate && (
        <AvailabilityDisplay
          availability={facilityBookings.length > 0 ? null : {
            facility: facilities.find(f => f.id.toString() === watchedfacility_id),
            date: watchedDate,
            time_slots: facilityBookings.map(booking => ({
              time: `${booking.start_time} - ${booking.end_time}`,
              available: false,
              booking: {
                id: booking.id,
                user_id: booking.user_id,
                date: booking.date,
                start_time: booking.start_time,
                end_time: booking.end_time,
                status: booking.status,
                notes: booking.notes,
              }
            })),
            total_slots: facilityBookings.length,
            available_slots: 0
          }}
          loading={loading}
          error={null}
        />
      )}

      {error && <ErrorMessage message={error} onRetry={load} />}

      {/* Table */}
      <Card>
        {loading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : paginated.length === 0 ? (
          <EmptyState
            icon="📋"
            title="No bookings found"
            description={
              search || statusFilter
                ? 'Try adjusting your filters.'
                : 'You have no bookings yet.'
            }
            action={
              !search && !statusFilter ? (
                <Link href="/bookings/new">
                  <Button size="sm">Create your first booking</Button>
                </Link>
              ) : undefined
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-slate-500 border-b border-slate-800">
                  <th className="px-5 py-3 text-left font-semibold uppercase tracking-wider">
                    Facility
                  </th>
                  <th className="px-5 py-3 text-left font-semibold uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-5 py-3 text-left font-semibold uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-5 py-3 text-left font-semibold uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-5 py-3 text-left font-semibold uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-5 py-3 text-right font-semibold uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((booking) => (
                  <tr
                    key={booking.id}
                    className="border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors group"
                  >
                    <td className="px-5 py-4">
                      <div className="font-medium text-white">
                        {booking.facilityName || booking.facility_id}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5 font-mono">
                        #{booking.id.slice(0, 8)}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-300">
                      {formatDate(booking.date)}
                    </td>
                    <td className="px-5 py-4 text-slate-300 whitespace-nowrap">
                      {formatTime(booking.start_time)} – {formatTime(booking.end_time)}
                    </td>
                    <td className="px-5 py-4 text-slate-400 font-mono text-xs">
                      {booking.user_id}
                    </td>
                    <td className="px-5 py-4">
                      <Badge className={getStatusColor(booking.status)}>
                        {toTitleCase(booking.status)}
                      </Badge>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            loading={cancellingId === booking.id}
                            onClick={() => handleCancel(booking.id)}
                            className="text-amber-400 hover:text-amber-300 hover:bg-amber-900/20 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            Cancel
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          loading={deletingId === booking.id}
                          onClick={() => setDeleteTarget(booking)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-opacity"
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

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="px-5 py-4 border-t border-slate-800 flex items-center justify-between text-sm text-slate-400">
            <span>
              Showing {(page - 1) * PAGE_SIZE + 1}–
              {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                ← Prev
              </Button>
              <span className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs font-medium">
                {page} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next →
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Delete confirmation modal */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Booking"
        description={`Are you sure you want to permanently delete this booking for "${deleteTarget?.facilityName || deleteTarget?.facility_id}" on ${deleteTarget ? formatDate(deleteTarget.date) : ''}? This action cannot be undone.`}
        confirmLabel="Delete"
        confirmVariant="danger"
        loading={!!deletingId}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
