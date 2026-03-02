'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { facilitiesApi, bookingsApi } from '@/lib/api';
import { Facility } from '@/types/facility';
import { Booking } from '@/types/booking';
import { Card, CardBody, PageLoader, ErrorMessage, Badge } from '@/components/ui';

export default function FacilityDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [facility, setFacility] = useState<Facility | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [f, b] = await Promise.all([
          facilitiesApi.getById(id),
          bookingsApi.getByFacility(id),
        ]);
        setFacility(f);
        setBookings(b);
      } catch (e: any) {
        setError(e.userMessage || 'Failed to load facility');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <div className="max-w-5xl mx-auto px-4 py-10"><PageLoader /></div>;
  if (error || !facility)
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        <ErrorMessage message={error || 'Facility not found'} />
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8 animate-fade-up">
      {/* Breadcrumb */}
      <div className="text-sm text-slate-500">
        <Link href="/" className="hover:text-slate-300">Home</Link>{' '}
        /{' '}
        <Link href="/facilities" className="hover:text-slate-300">Facilities</Link>{' '}
        / <span className="text-slate-300">{facility.name}</span>
      </div>

      {/* Facility header */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-800/60 to-slate-800 flex items-center justify-center text-4xl border border-violet-700/30 flex-shrink-0">
          🏢
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">{facility.name}</h1>
          <p className="text-slate-400 mt-1">📍 {facility.location}</p>
          {facility.description && (
            <p className="text-slate-400 text-sm mt-3 max-w-2xl leading-relaxed">
              {facility.description}
            </p>
          )}
          <div className="flex flex-wrap gap-3 mt-4">
            <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-300">
              <span>👥</span> Capacity: <strong>{facility.capacity}</strong>
            </div>
            {facility.amenities?.map((a) => (
              <Badge
                key={a}
                className="bg-slate-800 border-slate-700 text-slate-400 text-xs"
              >
                {a}
              </Badge>
            ))}
          </div>
        </div>
        <Link
          href={`/bookings/new?facility_id=${facility.id}`}
          className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-violet-900/40"
        >
          + Book Now
        </Link>
      </div>

      {/* Upcoming bookings */}
      <Card>
        <div className="px-6 pt-5 pb-4 border-b border-slate-800">
          <h2 className="font-bold text-white">Recent Bookings</h2>
          <p className="text-slate-500 text-sm mt-0.5">
            {bookings.length} booking{bookings.length !== 1 ? 's' : ''} for this facility
          </p>
        </div>
        <CardBody>
          {bookings.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-8">
              No bookings yet — be the first to reserve!
            </p>
          ) : (
            <div className="space-y-2">
              {bookings.slice(0, 8).map((b) => (
                <div
                  key={b.id}
                  className="flex items-center justify-between px-4 py-3 bg-slate-800/50 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-lg">📅</div>
                    <div>
                      <div className="text-sm font-medium text-white">{b.date}</div>
                      <div className="text-xs text-slate-400">
                        {b.start_time} – {b.end_time} · User: {b.user_id}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                      b.status === 'confirmed'
                        ? 'bg-emerald-900/40 border-emerald-700/40 text-emerald-400'
                        : b.status === 'cancelled'
                        ? 'bg-red-900/40 border-red-700/40 text-red-400'
                        : 'bg-amber-900/40 border-amber-700/40 text-amber-400'
                    }`}
                  >
                    {b.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
