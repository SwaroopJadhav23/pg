import { useMemo, useState } from 'react';
import { DataTable } from '../../components/shared/DataTable';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { emitToast } from '../../components/ui/toast';
import { TENANT_DEFAULT_PASSWORD } from '../../config/credentials';
import { useResource } from '../../hooks/useResource';
import { resolveImageUrl } from '../../pages/landing/utils/resolveImageUrl';
import { adminService } from '../../services/adminService';
import { AdminFormCard, AdminFormField, AdminModuleHeader, AdminPageLayout, AdminPageShell, AdminTableSection, adminStatusVariant } from './adminUi';
import { TenantPhotoField } from './components/TenantPhotoField';

const selectClass = 'h-11 w-full min-w-0 rounded-xl border bg-background px-4 text-sm';

const initialForm = {
  name: '',
  email: '',
  mobile: '',
  profile: {
    guardianName: '',
    emergencyContact: '',
    aadhaar: '',
    pan: '',
    photoUrl: '',
    floorNumber: '',
    roomNumber: '',
    bedNumber: ''
  }
};

function scrollToForm() {
  document.getElementById('admin-tenant-form')?.scrollIntoView({ behavior: 'smooth' });
}

function formatTenantBed(tenant) {
  const profile = tenant.profile || {};
  const floor = profile.floorNumber || '-';
  const room = profile.roomNumber || '-';
  const bed = profile.bedNumber || '-';
  return `F${floor} / R${room} / B${bed}`;
}

export function TenantManagementPage() {
  const { data, setData } = useResource(adminService.tenants, { tenants: [] });
  const { data: roomData } = useResource(adminService.rooms, { rooms: [] });
  const [form, setForm] = useState(initialForm);
  const [roomId, setRoomId] = useState('');
  const [pickFloor, setPickFloor] = useState('');
  const [pickRoom, setPickRoom] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [removingId, setRemovingId] = useState('');

  const vacantRooms = useMemo(
    () => (roomData.rooms || []).filter((room) => room.status !== 'occupied' && !room.tenant),
    [roomData.rooms]
  );

  const floors = useMemo(
    () => [...new Set(vacantRooms.map((room) => room.floor).filter(Boolean))].sort((a, b) => String(a).localeCompare(String(b), undefined, { numeric: true })),
    [vacantRooms]
  );

  const roomsForFloor = useMemo(() => {
    if (!pickFloor) return [];
    return [...new Set(vacantRooms.filter((room) => room.floor === pickFloor).map((room) => room.roomNumber).filter(Boolean))].sort((a, b) => String(a).localeCompare(String(b), undefined, { numeric: true }));
  }, [vacantRooms, pickFloor]);

  const bedsForRoom = useMemo(() => {
    if (!pickFloor || !pickRoom) return [];
    return vacantRooms.filter((room) => room.floor === pickFloor && room.roomNumber === pickRoom);
  }, [vacantRooms, pickFloor, pickRoom]);

  function resetBedSelection() {
    setRoomId('');
    setPickFloor('');
    setPickRoom('');
  }

  function resetPhoto() {
    if (photoPreview.startsWith('blob:')) URL.revokeObjectURL(photoPreview);
    setPhotoFile(null);
    setPhotoPreview('');
    setForm((current) => ({ ...current, profile: { ...current.profile, photoUrl: '' } }));
  }

  function handlePhotoChange(file, preview) {
    if (photoPreview.startsWith('blob:')) URL.revokeObjectURL(photoPreview);
    setPhotoFile(file);
    setPhotoPreview(preview);
  }

  function handlePickFloor(value) {
    setPickFloor(value);
    setPickRoom('');
    setRoomId('');
    setForm((current) => ({
      ...current,
      profile: { ...current.profile, floorNumber: value, roomNumber: '', bedNumber: '' }
    }));
  }

  function handlePickRoom(value) {
    setPickRoom(value);
    setRoomId('');
    setForm((current) => ({
      ...current,
      profile: { ...current.profile, roomNumber: value, bedNumber: '' }
    }));
  }

  function handlePickBed(value) {
    setRoomId(value);
    const bed = vacantRooms.find((room) => room._id === value);
    if (!bed) return;
    setPickFloor(bed.floor || '');
    setPickRoom(bed.roomNumber || '');
    setForm((current) => ({
      ...current,
      profile: {
        ...current.profile,
        floorNumber: bed.floor || '',
        roomNumber: bed.roomNumber || '',
        bedNumber: bed.bedNumber || ''
      }
    }));
  }

  function updateProfileField(field, value) {
    resetBedSelection();
    setForm((current) => ({
      ...current,
      profile: { ...current.profile, [field]: value }
    }));
  }

  async function submit(event) {
    event.preventDefault();
    setSubmitting(true);
    try {
      let photoUrl = form.profile.photoUrl || '';
      if (photoFile) {
        const upload = await adminService.uploadTenantPhoto(photoFile);
        photoUrl = upload.photoUrl;
      }

      const payload = await adminService.createTenant({
        ...form,
        roomId: roomId || undefined,
        profile: { ...form.profile, photoUrl }
      });
      setData((current) => ({ tenants: [payload.tenant, ...(current.tenants || [])] }));
      setForm(initialForm);
      resetBedSelection();
      resetPhoto();
      const bedLabel = formatTenantBed(payload.tenant);
      setMessage(`Tenant created. Login: ${payload.tenant?.email} / ${TENANT_DEFAULT_PASSWORD}. Bed: ${bedLabel}`);
      emitToast({
        title: 'Tenant created',
        description: `${payload.tenant?.email} assigned to ${bedLabel}`
      });
    } catch (error) {
      setMessage(error.response?.data?.message || 'Could not create tenant.');
      emitToast({ title: 'Create failed', description: error.response?.data?.message || 'Could not create tenant.', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  }

  function copyTenantLogin(tenant) {
    const text = `Login ID: ${tenant.email}\nPassword: ${TENANT_DEFAULT_PASSWORD}\nBed: ${formatTenantBed(tenant)}`;
    navigator.clipboard.writeText(text);
    emitToast({ title: 'Login copied', description: `${tenant.email} / ${TENANT_DEFAULT_PASSWORD}` });
  }

  async function removeTenant(tenant) {
    const confirmed = window.confirm(
      `Delete ${tenant.name}?\n\nTheir bed will be vacated and they will no longer be able to log in.`
    );
    if (!confirmed) return;

    setRemovingId(tenant._id);
    try {
      await adminService.deleteTenant(tenant._id);
      setData((current) => ({
        tenants: (current.tenants || []).filter((item) => item._id !== tenant._id)
      }));
      emitToast({ title: 'Tenant deleted', description: `${tenant.name} was deactivated.` });
    } catch (error) {
      emitToast({
        title: 'Delete failed',
        description: error.response?.data?.message || 'Could not remove tenant.',
        variant: 'destructive'
      });
    } finally {
      setRemovingId('');
    }
  }

  const rows = (data.tenants || []).map((tenant) => ({
    id: tenant._id,
    photo: tenant.profile?.photoUrl ? (
      <img src={resolveImageUrl(tenant.profile.photoUrl)} alt={tenant.name} className="h-10 w-10 rounded-xl border object-cover" />
    ) : (
      <span className="text-xs text-muted-foreground">No photo</span>
    ),
    name: tenant.name,
    email: tenant.email,
    mobile: tenant.mobile || 'Not set',
    room: formatTenantBed(tenant),
    guardian: tenant.profile?.guardianName || 'Not set',
    status: tenant.status,
    variant: adminStatusVariant(tenant.status),
    actions: (
      <div className="contents">
        <Button type="button" variant="outline" size="sm" className="h-10 w-full" onClick={() => copyTenantLogin(tenant)}>Copy Login</Button>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          className="h-10 w-full"
          disabled={removingId === tenant._id}
          onClick={() => removeTenant(tenant)}
        >
          {removingId === tenant._id ? 'Deleting...' : 'Delete'}
        </Button>
      </div>
    )
  }));

  return (
    <AdminPageShell>
      <AdminModuleHeader
        title="Tenant Management"
        description="Add tenants with floor, room and bed assignment, guardian details and KYC information."
        actionLabel="Add Tenant"
        onAction={scrollToForm}
      />
      <AdminPageLayout>
        <AdminFormCard id="admin-tenant-form" title="Add Tenant">
          <form onSubmit={submit}>
            <AdminFormField>
              <TenantPhotoField
                previewUrl={photoPreview}
                onPhotoChange={handlePhotoChange}
                onClear={resetPhoto}
              />
              <Input className="h-11" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              <Input className="h-11" placeholder="Email (tenant login ID)" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              <p className="text-xs text-muted-foreground">Tenant signs in with this email and default password <span className="font-semibold">{TENANT_DEFAULT_PASSWORD}</span>.</p>
              <Input className="h-11" placeholder="Mobile" value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} />

              <div className="space-y-3 rounded-2xl border bg-slate-50/80 p-4 dark:bg-slate-900/40">
                <p className="text-sm font-semibold">Floor, Room & Bed</p>
                {vacantRooms.length > 0 ? (
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    <select className={selectClass} value={pickFloor} onChange={(e) => handlePickFloor(e.target.value)}>
                      <option value="">Select floor</option>
                      {floors.map((floor) => <option key={floor} value={floor}>Floor {floor}</option>)}
                    </select>
                    <select className={selectClass} value={pickRoom} onChange={(e) => handlePickRoom(e.target.value)} disabled={!pickFloor}>
                      <option value="">Select room</option>
                      {roomsForFloor.map((room) => <option key={room} value={room}>Room {room}</option>)}
                    </select>
                    <select className={selectClass} value={roomId} onChange={(e) => handlePickBed(e.target.value)} disabled={!pickRoom}>
                      <option value="">Select bed</option>
                      {bedsForRoom.map((bed) => (
                        <option key={bed._id} value={bed._id}>Bed {bed.bedNumber}{bed.roomType ? ` (${bed.roomType})` : ''}</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">No vacant beds found. Create beds in Room Management or enter details manually below.</p>
                )}
                <p className="text-xs text-muted-foreground">Or enter floor, room and bed manually:</p>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  <Input className="h-11" placeholder="Floor" value={form.profile.floorNumber} onChange={(e) => updateProfileField('floorNumber', e.target.value)} />
                  <Input className="h-11" placeholder="Room" value={form.profile.roomNumber} onChange={(e) => updateProfileField('roomNumber', e.target.value)} />
                  <Input className="h-11" placeholder="Bed" value={form.profile.bedNumber} onChange={(e) => updateProfileField('bedNumber', e.target.value)} />
                </div>
              </div>

              <Input className="h-11" placeholder="Guardian Name" value={form.profile.guardianName} onChange={(e) => setForm({ ...form, profile: { ...form.profile, guardianName: e.target.value } })} />
              <Input className="h-11" placeholder="Emergency Contact" value={form.profile.emergencyContact} onChange={(e) => setForm({ ...form, profile: { ...form.profile, emergencyContact: e.target.value } })} />
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <Input className="h-11" placeholder="Aadhaar" value={form.profile.aadhaar} onChange={(e) => setForm({ ...form, profile: { ...form.profile, aadhaar: e.target.value } })} />
                <Input className="h-11" placeholder="PAN" value={form.profile.pan} onChange={(e) => setForm({ ...form, profile: { ...form.profile, pan: e.target.value } })} />
              </div>
              {message ? <p className="break-words rounded-xl bg-primary/10 p-3 text-sm text-primary">{message}</p> : null}
              <Button type="submit" className="h-11 w-full" disabled={submitting}>{submitting ? 'Saving...' : 'Add Tenant'}</Button>
            </AdminFormField>
          </form>
        </AdminFormCard>
        <AdminTableSection title="Tenant List">
          <DataTable
            embedded
            layout="cards"
            columns={[
              { key: 'photo', label: 'Photo' },
              { key: 'name', label: 'Tenant', mobilePrimary: true },
              { key: 'email', label: 'Email' },
              { key: 'mobile', label: 'Mobile' },
              { key: 'room', label: 'Floor/Room/Bed' },
              { key: 'guardian', label: 'Guardian' },
              { key: 'status', label: 'Status', badge: true },
              { key: 'actions', label: 'Actions' }
            ]}
            rows={rows}
          />
        </AdminTableSection>
      </AdminPageLayout>
    </AdminPageShell>
  );
}
