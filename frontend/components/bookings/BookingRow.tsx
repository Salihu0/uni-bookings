'use client';

import { Booking } from '@/types/booking';
import { Badge, Button } from '@/components/ui';
import { getStatusColor, formatTime, formatDate, toTitleCase } from '@/lib/utils';

interface BookingRowProps {
  booking: Booking;
  onCancel: (id: string) => void;
  onDelete: (id: string) => void;
  cancelling?: boolean;
  deleting?: boolean;
}

export function BookingRow({
  booking,
  onCancel,
  onDelete,
  cancelling,
  deleting,
}: BookingRowProps) {
  return (
    <tr className="border-b border-slate-800 hover:bg-slate-800/40 transition-colors group">
      <td className="px-4 py-3.5">
        <div className="font-medium text-white text-sm">
          {booking.facilityName || booking.facility_id}
        </div>
        <div className="text-xs text-slate-500 mt-0.5">{booking.facility_id}</div>
      </td>
      <td className="px-4 py-3.5 text-sm text-slate-300">
        {formatDate(booking.date)}
      </td>
      <td className="px-4 py-3.5 text-sm text-slate-300">
        {formatTime(booking.start_time)} – {formatTime(booking.end_time)}
      </td>
      <td className="px-4 py-3.5">
        <Badge className={getStatusColor(booking.status)}>
          {toTitleCase(booking.status)}
        </Badge>
      </td>
      <td className="px-4 py-3.5 text-sm text-slate-400">{booking.user_id}</td>
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {booking.status !== 'cancelled' && (
            <Button
              variant="ghost"
              size="sm"
              loading={cancelling}
              onClick={() => onCancel(booking.id)}
              className="text-amber-400 hover:text-amber-300 hover:bg-amber-900/20"
            >
              Cancel
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            loading={deleting}
            onClick={() => onDelete(booking.id)}
            className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
          >
            Delete
          </Button>
        </div>
      </td>
    </tr>
  );
}
