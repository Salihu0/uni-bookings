import { AvailabilityResponse, TimeSlot } from '@/types/booking';

interface AvailabilityDisplayProps {
  availability: AvailabilityResponse | null;
  loading: boolean;
  error: string | null;
}

export function AvailabilityDisplay({ availability, loading, error }: AvailabilityDisplayProps) {
  if (loading) {
    return (
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 mb-6">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-slate-600 rounded-full border-t-transparent animate-spin"></div>
          <span className="text-slate-400">Checking availability...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-700 rounded-lg p-6 mb-6">
        <div className="text-red-400">Failed to check availability: {error}</div>
      </div>
    );
  }

  if (!availability) {
    return (
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 mb-6">
        <div className="text-slate-400">No availability data</div>
      </div>
    );
  }

  const { facility, date, time_slots, total_slots, available_slots } = availability;

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">
            {facility.name} - {date}
          </h3>
          <p className="text-slate-400 text-sm">
            {available_slots} of {total_slots} slots available
          </p>
        </div>
        <div className="text-sm text-slate-400">
          Available: {available_slots} | Total: {total_slots}
        </div>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
        {time_slots.map((slot, index) => (
          <div
            key={index}
            className={`
              p-3 rounded-lg border text-center transition-all
              ${slot.available 
                ? 'bg-green-900/20 border-green-700 text-green-300 hover:bg-green-800/30 cursor-pointer' 
                : 'bg-red-900/20 border-red-700 text-red-300'
              }
            `}
          >
            <div className="text-xs font-medium text-slate-400 mb-1">
              {slot.time}
            </div>
            <div className="text-sm font-medium">
              {slot.available ? 'Available' : 'Booked'}
            </div>
            {slot.booking && (
              <div className="text-xs text-slate-400 mt-1">
                Booked by: User {slot.booking.user_id}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
