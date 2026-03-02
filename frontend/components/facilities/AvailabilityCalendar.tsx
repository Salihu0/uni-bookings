'use client';

import { useState } from 'react';
import { Booking } from '@/types/booking';
import { getSlotsForDate, formatDate } from '@/lib/utils';

interface AvailabilityCalendarProps {
  bookings: Booking[];
}

function getDatesAround(days = 7): string[] {
  const dates: string[] = [];
  const today = new Date();
  for (let i = 0; i < days; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
}

export function AvailabilityCalendar({ bookings }: AvailabilityCalendarProps) {
  const dates = getDatesAround(7);
  const [selectedDate, setSelectedDate] = useState(dates[0]);
  const slots = getSlotsForDate(selectedDate, bookings);

  const available = slots.filter((s) => s.available).length;
  const booked = slots.filter((s) => !s.available).length;

  return (
    <div className="space-y-5">
      {/* Date selector */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {dates.map((d) => {
          const dt = new Date(d);
          const isSelected = d === selectedDate;
          return (
            <button
              key={d}
              onClick={() => setSelectedDate(d)}
              className={`flex-shrink-0 flex flex-col items-center px-3.5 py-2.5 rounded-xl border text-xs font-medium transition-all ${
                isSelected
                  ? 'bg-violet-600 border-violet-500 text-white shadow-lg shadow-violet-900/40'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200'
              }`}
            >
              <span className="uppercase text-[10px] tracking-wider opacity-70">
                {dt.toLocaleDateString('en-US', { weekday: 'short' })}
              </span>
              <span className="text-base font-bold mt-0.5">
                {dt.getDate()}
              </span>
              <span className="opacity-70">
                {dt.toLocaleDateString('en-US', { month: 'short' })}
              </span>
            </button>
          );
        })}
      </div>

      {/* Legend + stats */}
      <div className="flex items-center gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-emerald-500/30 border border-emerald-500/60" />
          Available ({available})
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-red-500/30 border border-red-500/60" />
          Booked ({booked})
        </div>
      </div>

      {/* Slots grid */}
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
        {slots.map((slot) => (
          <div
            key={slot.time}
            title={slot.available ? `${slot.label} - Available` : `${slot.label} - Booked`}
            className={`flex items-center justify-center rounded-lg py-2 px-1 text-xs font-medium border transition-all ${
              slot.available
                ? 'bg-emerald-950/60 border-emerald-800/60 text-emerald-400 hover:bg-emerald-900/60'
                : 'bg-red-950/60 border-red-800/60 text-red-400 cursor-not-allowed'
            }`}
          >
            {slot.label.replace(':00', '').replace(':30', ':30')}
          </div>
        ))}
      </div>
    </div>
  );
}
