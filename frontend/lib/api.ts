import axios, { AxiosError, AxiosResponse } from 'axios';
import { Facility, CreateFacilityDto, UpdateFacilityDto } from '@/types/facility';
import { Booking, CreateBookingDto, UpdateBookingDto } from '@/types/booking';
import { LoginRequest, RegisterRequest, AuthResponse, User } from '@/types/auth';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// Add authorization header to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res: AxiosResponse) => res,
  (err: AxiosError) => {
    const message =
      (err.response?.data as any)?.message ||
      err.message ||
      'An unexpected error occurred';
    return Promise.reject({ ...err, userMessage: message });
  }
);


// ─── Facilities ───────────────────────────────────────────────────────────────

export const facilitiesApi = {
  getAll: () => api.get<Facility[]>('/api/facilities').then((r) => r.data),
  getById: (id: string) =>
    api.get<Facility>(`/api/facilities/${id}`).then((r) => r.data),
  create: (data: CreateFacilityDto) =>
    api.post<Facility>('/api/facilities', data).then((r) => r.data),
  update: (id: string, data: UpdateFacilityDto) =>
    api.put<Facility>(`/api/facilities/${id}`, data).then((r) => r.data),
  delete: (id: string) =>
    api.delete(`/api/facilities/${id}`).then((r) => r.data),
};

// ─── Bookings ─────────────────────────────────────────────────────────────────

export const bookingsApi = {
  getAll: () => api.get<Booking[]>('/api/bookings').then((r) => r.data),
  getById: (id: string) =>
    api.get<Booking>(`/api/bookings/${id}`).then((r) => r.data),
  getByFacility: (facility_id: string) =>
    api
      .get<Booking[]>(`/api/bookings/facility/${facility_id}`)
      .then((r) => r.data),
  create: (data: CreateBookingDto) =>
    api.post<Booking>('/api/bookings', data).then((r) => r.data),
  update: (id: string, data: UpdateBookingDto) =>
    api.put<Booking>(`/api/bookings/${id}`, data).then((r) => r.data),
  cancel: (id: string) =>
    api.patch<Booking>(`/api/bookings/${id}/cancel`).then((r) => r.data),
  delete: (id: string) =>
    api.delete(`/api/bookings/${id}`).then((r) => r.data),
  checkAvailability: (facility_id: string, date: string) =>
    api
      .get<{
        facility: Facility;
        date: string;
        time_slots: Array<{
          time: string;
          available: boolean;
          booking: Booking | null;
        }>;
        total_slots: number;
        available_slots: number;
      }>(`/api/availability?facility_id=${facility_id}&date=${date}`)
      .then((r) => r.data),
};

// ─── Authentication ───────────────────────────────────────────────────────────

export const authApi = {
  login: (data: LoginRequest) =>
    api.post<AuthResponse>('/api/auth/login', data).then((r) => r.data),
  register: (data: RegisterRequest) =>
    api.post<AuthResponse>('/api/auth/register', data).then((r) => r.data),
  getProfile: () =>
    api.get<{ message: string; user: User }>('/api/auth/profile').then((r) => r.data),
  getAllUsers: () =>
    api.get<{ message: string; users: User[] }>('/api/auth/users').then((r) => r.data.users),
  updateUserRole: (userId: string, role: 'user' | 'admin') =>
    api.put<{ message: string; user: User }>(`/api/auth/users/${userId}/role`, { role }).then((r) => r.data),
  deleteUser: (userId: string) =>
    api.delete<{ message: string }>(`/api/auth/users/${userId}`).then((r) => r.data),
};

export default api;
