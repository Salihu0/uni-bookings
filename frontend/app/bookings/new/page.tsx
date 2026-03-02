'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { facilitiesApi, bookingsApi } from '@/lib/api';
import { Facility } from '@/types/facility';
import { useToast } from '@/lib/toast';
import { generateTimeSlots, formatTime, isSlotBooked } from '@/lib/utils';
import { Booking } from '@/types/booking';
import {
  Card,
  CardBody,
  Button,
  Input,
  Select,
} from '@/components/ui';
import Link from 'next/link';

const schema = z
  .object({
    facility_id: z.string().min(1, 'Please select a facility'),
    date: z.string().min(1, 'Date is required'),
    start_time: z.string().min(1, 'Start time is required'),
    end_time: z.string().min(1, 'End time is required'),
    notes: z.string().optional(),
  })
  .refine(
    (d) => d.start_time < d.end_time,
    { message: 'End time must be after start time', path: ['end_time'] }
  );

type FormData = z.infer<typeof schema>;

export default function NewBookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [facilityBookings, setFacilityBookings] = useState<Booking[]>([])
  const [loadingFacilities, setLoadingFacilities] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [slotConflict, setSlotConflict] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      facility_id: searchParams?.get('facility_id') || '',
      date: new Date().toISOString().split('T')[0],
    },
  });

  const watchedfacility_id = watch('facility_id');
  const watchedDate = watch('date');
  const watchedstart_time = watch('start_time');
  const watchedend_time = watch('end_time');

  const timeSlots = generateTimeSlots();
  const timeOptions = [
    { value: '', label: 'Select time' },
    ...timeSlots.map((t) => ({ value: t, label: formatTime(t) })),
  ];

  useEffect(() => {
    facilitiesApi
      .getAll()
      .then(setFacilities)
      .catch(() => toast('Failed to load facilities', 'error'))
      .finally(() => setLoadingFacilities(false));
  }, []);

  useEffect(() => {
    if (watchedfacility_id && watchedDate) {
      // Bookings are already loaded via the other useEffect
      // Slot conflict will be checked in the next useEffect
      setSlotConflict(false);
    }
  }, [watchedfacility_id, watchedDate]);

  useEffect(() => {
    if (!watchedfacility_id) return;
    bookingsApi
      .getByFacility(watchedfacility_id)
      .then(setFacilityBookings)
      .catch(() => {});
  }, [watchedfacility_id]);

  // Check for slot conflicts in real time
  useEffect(() => {
    if (!watchedDate || !watchedstart_time || !watchedend_time) {
      setSlotConflict(false);
      return;
    }
    const startCheck = isSlotBooked(watchedstart_time, watchedDate, facilityBookings);
    const endSlotTime = timeSlots.find((t) => t > watchedstart_time && t < watchedend_time);
    const hasConflict =
      startCheck.booked ||
      (endSlotTime
        ? isSlotBooked(endSlotTime, watchedDate, facilityBookings).booked
        : false);
    setSlotConflict(hasConflict);
  }, [watchedDate, watchedstart_time, watchedend_time, facilityBookings]);

  const onSubmit = async (data: FormData) => {
    if (slotConflict) {
      toast('This time slot is already booked. Please choose another.', 'error');
      return;
    }
    setSubmitting(true);
    // Ensure facility_id is from existing facilities
    const selectedFacility = facilities.find(f => String(f.id) === data.facility_id);
    if (!selectedFacility) {
      toast('Selected facility does not exist.', 'error');
      setSubmitting(false);
      console.error('Facility ID not found in facilities list:', data.facility_id);
      return;
    }
    try {
      const payload = {
        facility_id: parseInt(data.facility_id, 10),
        date: data.date,
        start_time: data.start_time.length === 5 ? data.start_time + ':00' : data.start_time,
        end_time: data.end_time.length === 5 ? data.end_time + ':00' : data.end_time,
        notes: data.notes,
      };
      console.log('Submitting booking payload:', payload);
      await bookingsApi.create(payload as any);
      toast('Booking created successfully!', 'success');
      router.push('/bookings');
    } catch (e: any) {
      console.error('Booking creation error:', e);
      const status = e.response?.status;
      if (status === 409) {
        toast('Booking conflict: this slot is already taken.', 'error');
      } else if (status === 400) {
        toast('Invalid booking data. Please check your inputs.', 'error');
      } else {
        toast(e.userMessage || 'Failed to create booking', 'error');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const facilityOptions = [
    { value: '', label: 'Select a facility' },
    ...facilities.map((f) => ({
      value: f.id,
      label: `${f.name} — ${f.location} (Cap: ${f.capacity})`,
    })),
  ];

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-6 animate-fade-up">
      {/* Breadcrumb */}
      <div className="text-sm text-slate-500">
        <Link href="/" className="hover:text-slate-300">Home</Link> /{' '}
        <Link href="/bookings" className="hover:text-slate-300">Bookings</Link> /{' '}
        <span className="text-slate-300">New</span>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-white">Create Booking</h1>
        <p className="text-slate-400 text-sm mt-1">
          Reserve a campus facility for your event or activity.
        </p>
      </div>

      <Card>
        <CardBody className="space-y-5">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Facility */}
            <Select
              label="Facility *"
              options={facilityOptions}
              error={errors.facility_id?.message}
              disabled={loadingFacilities}
              {...register('facility_id')}
            />

            {/* Date */}
            <Input
              type="date"
              label="Date *"
              min={today}
              error={errors.date?.message}
              {...register('date')}
            />

            {/* Start / End time */}
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Start Time *"
                options={timeOptions}
                error={errors.start_time?.message}
                {...register('start_time')}
              />
              <Select
                label="End Time *"
                options={timeOptions}
                error={errors.end_time?.message}
                {...register('end_time')}
              />
            </div>

            {/* Conflict warning */}
            {slotConflict && (
              <div className="flex items-start gap-3 bg-red-900/30 border border-red-700/50 rounded-xl px-4 py-3 text-sm text-red-300">
                <span className="text-lg leading-none mt-0.5">⚠</span>
                <span>
                  This time slot conflicts with an existing booking. Please choose
                  a different time.
                </span>
              </div>
            )}

            {/* Notes */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-300">
                Notes (optional)
              </label>
              <textarea
                placeholder="Any additional notes…"
                rows={3}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all resize-none"
                {...register('notes')}
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <Button
                type="submit"
                loading={submitting}
                disabled={slotConflict}
                className="flex-1"
              >
                {submitting ? 'Creating…' : 'Create Booking'}
              </Button>
              <Link href="/bookings">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
