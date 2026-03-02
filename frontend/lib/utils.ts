import { Booking, TimeSlot } from '@/types/booking';
import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/** Format HH:mm → "08:00 AM" */
export function formatTime(time: string): string {
  const [hourStr, min] = time.split(':');
  const hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${String(displayHour).padStart(2, '0')}:${min} ${ampm}`;
}

/** Format ISO date → "Mon, Jan 1 2024" */
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/** Generate 30-min slots from 08:00 to 20:00 */
export function generateTimeSlots(): string[] {
  const slots: string[] = [];
  for (let h = 8; h < 20; h++) {
    slots.push(`${String(h).padStart(2, '0')}:00`);
    slots.push(`${String(h).padStart(2, '0')}:30`);
  }
  return slots;
}

/** Check if a given time slot overlaps with existing bookings */
export function isSlotBooked(
  slotTime: string,
  date: string,
  bookings: Booking[]
): { booked: boolean; bookingId?: string } {
  const [sh, sm] = slotTime.split(':').map(Number);
  const slotMinutes = sh * 60 + sm;
  const nextSlotMinutes = slotMinutes + 30;

  for (const booking of bookings) {
    if (booking.date !== date) continue;
    if (booking.status === 'cancelled') continue;

    const [bsh, bsm] = booking.start_time.split(':').map(Number);
    const [beh, bem] = booking.end_time.split(':').map(Number);
    const bookingStart = bsh * 60 + bsm;
    const bookingEnd = beh * 60 + bem;

    if (slotMinutes < bookingEnd && nextSlotMinutes > bookingStart) {
      return { booked: true, bookingId: booking.id };
    }
  }
  return { booked: false };
}

/** Generate full slot objects for a date */
export function getSlotsForDate(
  date: string,
  bookings: Booking[]
): TimeSlot[] {
  const times = generateTimeSlots();
  return times.map((time) => {
    const { booked, bookingId } = isSlotBooked(time, date, bookings);
    return {
      time,
      label: formatTime(time),
      available: !booked,
      bookingId,
    };
  });
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'confirmed':
      return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'pending':
      return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'cancelled':
      return 'bg-red-100 text-red-700 border-red-200';
    case 'completed':
      return 'bg-slate-100 text-slate-600 border-slate-200';
    default:
      return 'bg-gray-100 text-gray-600 border-gray-200';
  }
}

export function toTitleCase(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
