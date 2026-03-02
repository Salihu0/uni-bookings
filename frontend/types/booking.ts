import { Facility } from './facility';

export type BookingStatus = 'confirmed' | 'pending' | 'cancelled' | 'completed';


export interface Booking {
  id: string;
  facility_id: number;
  facilityName?: string;
  user_id: number;
  date: string; // ISO date string YYYY-MM-DD
  start_time: string; // HH:mm
  end_time: string; // HH:mm
  status: BookingStatus;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}



export interface CreateBookingDto {
  facility_id: number;
  date: string;
  start_time: string;
  end_time: string;
  notes?: string;
}

export type UpdateBookingDto = Partial<CreateBookingDto> & {
  status?: BookingStatus;
};

export interface TimeSlot {
  time: string; // HH:mm
  label: string; // e.g. "08:00 AM"
  available: boolean;
  booking: Booking | null;
}
