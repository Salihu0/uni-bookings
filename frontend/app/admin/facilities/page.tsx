'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { facilitiesApi } from '@/lib/api';
import { Facility } from '@/types/facility';
import { useToast } from '@/lib/toast';
import ProtectedRoute from '@/components/ProtectedRoute';
import {
  Card,
  CardBody,
  Button,
  Modal,
  Input,
  Textarea,
  ConfirmDialog,
  PageLoader,
  ErrorMessage,
  EmptyState,
  Skeleton,
} from '@/components/ui';

// ─── Schema ────────────────────────────────────────────────────────────────────

const facilitySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  location: z.string().min(2, 'Location is required'),
  capacity: z.coerce.number().min(1, 'Capacity must be at least 1'),
  description: z.string().optional(),
  amenities: z.string().optional(), // comma-separated string → split on save
});

type FacilityFormData = z.infer<typeof facilitySchema>;

// ─── Form modal ────────────────────────────────────────────────────────────────

function FacilityFormModal({
  open,
  onClose,
  onSave,
  initial,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (data: FacilityFormData) => Promise<void>;
  initial?: Facility | null;
}) {
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FacilityFormData>({
    resolver: zodResolver(facilitySchema),
  });

  useEffect(() => {
    if (open) {
      reset(
        initial
          ? {
              name: initial.name,
              location: initial.location,
              capacity: initial.capacity,
              description: initial.description || '',
              amenities: initial.amenities?.join(', ') || '',
            }
          : { name: '', location: '', capacity: 1, description: '', amenities: '' }
      );
    }
  }, [open, initial]);

  const onSubmit = async (data: FacilityFormData) => {
    setSaving(true);
    try {
      await onSave(data);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? 'Edit Facility' : 'Create Facility'}
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Name *"
          placeholder="e.g. Science Lab A"
          error={errors.name?.message}
          {...register('name')}
        />
        <Input
          label="Location *"
          placeholder="e.g. Block B, Floor 2"
          error={errors.location?.message}
          {...register('location')}
        />
        <Input
          type="number"
          label="Capacity *"
          placeholder="e.g. 40"
          min={1}
          error={errors.capacity?.message}
          {...register('capacity')}
        />
        <Textarea
          label="Description"
          placeholder="Brief description of the facility…"
          error={errors.description?.message}
          {...register('description')}
        />
        <Input
          label="Amenities (comma-separated)"
          placeholder="Projector, Whiteboard, AC"
          error={errors.amenities?.message}
          {...register('amenities')}
        />
        <div className="flex gap-3 pt-2">
          <Button type="submit" loading={saving} className="flex-1">
            {initial ? 'Save Changes' : 'Create Facility'}
          </Button>
          <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────

export default function AdminFacilitiesPage() {
  const { toast } = useToast();
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Facility | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Facility | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      setFacilities(await facilitiesApi.getAll());
    } catch (e: any) {
      setError(e.userMessage || 'Failed to load facilities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditTarget(null); setFormOpen(true); };
  const openEdit = (f: Facility) => { setEditTarget(f); setFormOpen(true); };

  const handleSave = async (data: FacilityFormData) => {
    const payload = {
      ...data,
      amenities: data.amenities
        ? data.amenities.split(',').map((a) => a.trim()).filter(Boolean)
        : [],
    };

    if (editTarget) {
      // Optimistic update
      setFacilities((prev) =>
        prev.map((f) => (f.id === editTarget.id ? { ...f, ...payload } : f))
      );
      try {
        const updated = await facilitiesApi.update(editTarget.id, payload);
        setFacilities((prev) =>
          prev.map((f) => (f.id === editTarget.id ? updated : f))
        );
        toast('Facility updated', 'success');
      } catch (e: any) {
        load();
        toast(e.userMessage || 'Update failed', 'error');
        throw e;
      }
    } else {
      try {
        const created = await facilitiesApi.create(payload);
        setFacilities((prev) => [created, ...prev]);
        toast('Facility created', 'success');
      } catch (e: any) {
        toast(e.userMessage || 'Create failed', 'error');
        throw e;
      }
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const id = deleteTarget.id;
    setFacilities((prev) => prev.filter((f) => f.id !== id));
    setDeleteTarget(null);
    try {
      await facilitiesApi.delete(id);
      toast('Facility deleted', 'success');
    } catch (e: any) {
      load();
      toast(e.userMessage || 'Delete failed', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-6xl mx-auto px-4 py-10 space-y-8 animate-fade-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-widest text-violet-400 bg-violet-900/30 border border-violet-800/40 px-2 py-0.5 rounded-md">
              Admin
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white">Manage Facilities</h1>
          <p className="text-slate-400 text-sm mt-1">
            Create, edit and delete campus facilities.
          </p>
        </div>
        <Button onClick={openCreate}>+ Add Facility</Button>
      </div>

      {error && <ErrorMessage message={error} onRetry={load} />}

      {/* Facilities table */}
      <Card>
        {loading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : facilities.length === 0 ? (
          <EmptyState
            icon="🏢"
            title="No facilities yet"
            description="Add your first campus facility to get started."
            action={<Button size="sm" onClick={openCreate}>Add Facility</Button>}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-slate-500 border-b border-slate-800">
                  <th className="px-5 py-3.5 text-left font-semibold uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-5 py-3.5 text-left font-semibold uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-5 py-3.5 text-left font-semibold uppercase tracking-wider">
                    Capacity
                  </th>
                  <th className="px-5 py-3.5 text-left font-semibold uppercase tracking-wider">
                    Amenities
                  </th>
                  <th className="px-5 py-3.5 text-right font-semibold uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {facilities.map((f) => (
                  <tr
                    key={f.id}
                    className="border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors group"
                  >
                    <td className="px-5 py-4">
                      <div className="font-semibold text-white">{f.name}</div>
                      {f.description && (
                        <div className="text-xs text-slate-500 mt-0.5 max-w-xs truncate">
                          {f.description}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4 text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-500">📍</span>
                        {f.location}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <span className="text-slate-500">👥</span>
                        {f.capacity}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1">
                        {f.amenities?.slice(0, 3).map((a) => (
                          <span
                            key={a}
                            className="text-xs px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-slate-400"
                          >
                            {a}
                          </span>
                        ))}
                        {(f.amenities?.length ?? 0) > 3 && (
                          <span className="text-xs px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-slate-500">
                            +{(f.amenities?.length ?? 0) - 3}
                          </span>
                        )}
                        {(!f.amenities || f.amenities.length === 0) && (
                          <span className="text-xs text-slate-600">—</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEdit(f)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => setDeleteTarget(f)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Stats bar */}
      <div className="flex items-center gap-6 text-sm text-slate-500 px-1">
        <span>
          <strong className="text-slate-300">{facilities.length}</strong> facilities
        </span>
        <span>
          <strong className="text-slate-300">
            {facilities.reduce((s, f) => s + f.capacity, 0)}
          </strong>{' '}
          total capacity
        </span>
      </div>

      {/* Modals */}
      <FacilityFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
        initial={editTarget}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Facility"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? All associated bookings may be affected. This cannot be undone.`}
        confirmLabel="Delete"
        confirmVariant="danger"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
      </div>
    </ProtectedRoute>
  );
}
