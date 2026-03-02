'use client';

import { useEffect, useState, useMemo } from 'react';
import { facilitiesApi } from '@/lib/api';
import { Facility } from '@/types/facility';
import { FacilityCard, FacilityCardSkeleton } from '@/components/facilities/FacilityCard';
import { ErrorMessage, Input } from '@/components/ui';

export default function FacilitiesPage() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await facilitiesApi.getAll();
      setFacilities(data);
    } catch (e: any) {
      setError(e.userMessage || 'Failed to load facilities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(
    () =>
      facilities.filter(
        (f) =>
          f.name.toLowerCase().includes(search.toLowerCase()) ||
          f.location.toLowerCase().includes(search.toLowerCase())
      ),
    [facilities, search]
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-8 animate-fade-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Facilities</h1>
          <p className="text-slate-400 text-sm mt-1">
            {facilities.length} spaces available across campus
          </p>
        </div>
        <div className="sm:w-72">
          <Input
            placeholder="Search by name or location…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {error && <ErrorMessage message={error} onRetry={load} />}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <FacilityCardSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
          <div className="text-4xl">🔍</div>
          <h3 className="text-lg font-semibold text-slate-300">
            {search ? 'No results found' : 'No facilities yet'}
          </h3>
          <p className="text-slate-500 text-sm">
            {search
              ? `Nothing matching "${search}". Try a different term.`
              : 'Facilities will appear here once added.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((f) => (
            <FacilityCard key={f.id} facility={f} />
          ))}
        </div>
      )}
    </div>
  );
}
