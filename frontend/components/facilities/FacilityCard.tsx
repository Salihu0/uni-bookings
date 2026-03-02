'use client';

import Link from 'next/link';
import { Facility } from '@/types/facility';
import { Card, CardBody } from '@/components/ui';

interface FacilityCardProps {
  facility: Facility;
}

const locationIcons: Record<string, string> = {
  lab: '🔬',
  library: '📚',
  gym: '🏋️',
  hall: '🏛️',
  auditorium: '🎭',
  classroom: '🎓',
  court: '🏀',
  default: '🏢',
};

function getIcon(name: string): string {
  const lower = name.toLowerCase();
  for (const key of Object.keys(locationIcons)) {
    if (lower.includes(key)) return locationIcons[key];
  }
  return locationIcons.default;
}

export function FacilityCard({ facility }: FacilityCardProps) {
  return (
    <Card className="group hover:border-slate-600 transition-all duration-200 hover:shadow-2xl hover:shadow-violet-900/10">
      <CardBody className="flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-900/60 to-slate-800 flex items-center justify-center text-2xl border border-violet-800/30">
            {getIcon(facility.name)}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-800/80 rounded-full px-2.5 py-1 border border-slate-700">
            <span>👥</span>
            <span>{facility.capacity}</span>
          </div>
        </div>

        <div>
          <h3 className="text-base font-bold text-white group-hover:text-violet-300 transition-colors">
            {facility.name}
          </h3>
          <p className="text-sm text-slate-400 mt-0.5 flex items-center gap-1">
            <span>📍</span>
            {facility.location}
          </p>
        </div>

        {facility.description && (
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {facility.description}
          </p>
        )}

        {facility.amenities && facility.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {facility.amenities.slice(0, 3).map((a) => (
              <span
                key={a}
                className="text-xs px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-slate-400"
              >
                {a}
              </span>
            ))}
            {facility.amenities.length > 3 && (
              <span className="text-xs px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-slate-500">
                +{facility.amenities.length - 3}
              </span>
            )}
          </div>
        )}

        <Link
          href={`/facilities/${facility.id}`}
          className="mt-auto inline-flex items-center justify-center gap-2 w-full py-2 px-4 bg-slate-800 hover:bg-violet-700/20 border border-slate-700 hover:border-violet-600/50 text-slate-300 hover:text-violet-300 rounded-lg text-sm font-medium transition-all duration-150"
        >
          View Details →
        </Link>
      </CardBody>
    </Card>
  );
}

// ─── Skeleton ──────────────────────────────────────────────────────────────────

export function FacilityCardSkeleton() {
  return (
    <Card>
      <CardBody className="flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-xl bg-slate-800 animate-pulse" />
          <div className="h-6 w-16 rounded-full bg-slate-800 animate-pulse" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-3/4 rounded bg-slate-800 animate-pulse" />
          <div className="h-3 w-1/2 rounded bg-slate-800 animate-pulse" />
        </div>
        <div className="h-3 w-full rounded bg-slate-800 animate-pulse" />
        <div className="h-9 w-full rounded-lg bg-slate-800 animate-pulse mt-auto" />
      </CardBody>
    </Card>
  );
}
