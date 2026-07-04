import { useState } from 'react';
import { BedDouble } from 'lucide-react';
import { DataTable } from '../../components/shared/DataTable';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { emitToast } from '../../components/ui/toast';
import { useResource } from '../../hooks/useResource';
import { formatCurrency } from '../../lib/utils';
import { adminService } from '../../services/adminService';
import { AdminFormCard, AdminFormField, AdminModuleHeader, AdminPageLayout, AdminTableSection, adminStatusVariant } from './adminUi';

const initialForm = { floor: '', roomNumber: '', bedNumber: '', roomType: '', sharingDetails: '', rent: '', status: 'vacant', amenities: '' };

export function RoomManagementPage() {
  const { data, setData } = useResource(adminService.rooms, { rooms: [] });
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState('');

  async function submit(event) {
    event.preventDefault();
    try {
      const payload = await adminService.createRoom({
        ...form,
        rent: Number(form.rent) || 0,
        amenities: String(form.amenities || '').split(',').map((item) => item.trim()).filter(Boolean)
      });
      setData((current) => ({ rooms: [payload.room, ...(current.rooms || [])] }));
      setForm(initialForm);
      setMessage('Room/bed created.');
      emitToast({ title: 'Room created', description: `${payload.room?.roomNumber || 'Room'} added.` });
    } catch (error) {
      setMessage(error.response?.data?.message || 'Could not save room.');
      emitToast({ title: 'Create failed', description: error.response?.data?.message || 'Could not save room.', variant: 'destructive' });
    }
  }

  async function assignTenant(room) {
    const tenantId = window.prompt('Enter tenant ID to assign to this bed:');
    if (!tenantId?.trim()) return;
    try {
      const payload = await adminService.assignTenant(room._id, tenantId.trim());
      setData((current) => ({
        rooms: (current.rooms || []).map((item) => (item._id === room._id ? payload.room : item))
      }));
      emitToast({ title: 'Tenant assigned', description: room.roomNumber });
    } catch (error) {
      emitToast({ title: 'Assign failed', description: error.response?.data?.message || 'Could not assign tenant.', variant: 'destructive' });
    }
  }

  async function vacateRoom(room) {
    if (!window.confirm(`Vacate bed ${room.roomNumber}-${room.bedNumber}?`)) return;
    try {
      const payload = await adminService.vacateRoom(room._id);
      setData((current) => ({
        rooms: (current.rooms || []).map((item) => (item._id === room._id ? payload.room : item))
      }));
      emitToast({ title: 'Bed vacated', description: room.roomNumber });
    } catch (error) {
      emitToast({ title: 'Vacate failed', description: error.response?.data?.message || 'Could not vacate room.', variant: 'destructive' });
    }
  }

  const rows = (data.rooms || []).map((room) => ({
    id: room._id,
    hierarchy: `Floor ${room.floor} → Room ${room.roomNumber} → Bed ${room.bedNumber}`,
    tenant: room.tenant?.name || 'Vacant',
    roomType: room.roomType || 'Standard',
    rent: formatCurrency(room.rent || 0),
    status: room.status,
    variant: adminStatusVariant(room.status),
    actions: (
      <div className="flex flex-wrap gap-2">
        {room.status !== 'occupied' ? (
          <Button type="button" variant="outline" size="sm" onClick={() => assignTenant(room)}>Assign</Button>
        ) : (
          <Button type="button" variant="outline" size="sm" onClick={() => vacateRoom(room)}>Vacate</Button>
        )}
      </div>
    )
  }));

  return (
    <>
      <AdminModuleHeader
        title="Room Management"
        description="Create floors, rooms and beds, assign tenants, transfer tenants and vacate beds."
        actionLabel="Create Bed"
        onAction={() => document.getElementById('admin-room-form')?.scrollIntoView({ behavior: 'smooth' })}
      />
      <AdminPageLayout>
        <AdminFormCard id="admin-room-form" title="Create Bed" icon={BedDouble}>
          <form onSubmit={submit}>
            <AdminFormField>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <Input className="h-11 w-full" placeholder="Floor" value={form.floor} onChange={(e) => setForm({ ...form, floor: e.target.value })} required />
                <Input className="h-11 w-full" placeholder="Room" value={form.roomNumber} onChange={(e) => setForm({ ...form, roomNumber: e.target.value })} required />
                <Input className="h-11 w-full" placeholder="Bed" value={form.bedNumber} onChange={(e) => setForm({ ...form, bedNumber: e.target.value })} required />
              </div>
              <Input className="h-11" placeholder="Room Type" value={form.roomType} onChange={(e) => setForm({ ...form, roomType: e.target.value })} />
              <Input className="h-11" placeholder="Sharing Details" value={form.sharingDetails} onChange={(e) => setForm({ ...form, sharingDetails: e.target.value })} />
              <Input className="h-11" type="number" placeholder="Rent" value={form.rent} onChange={(e) => setForm({ ...form, rent: e.target.value })} />
              <Input className="h-11" placeholder="Amenities comma separated" value={form.amenities} onChange={(e) => setForm({ ...form, amenities: e.target.value })} />
              {message ? <p className="break-words rounded-xl bg-primary/10 p-3 text-sm text-primary">{message}</p> : null}
              <Button type="submit" className="h-11 w-full">Create Room / Bed</Button>
            </AdminFormField>
          </form>
        </AdminFormCard>
        <AdminTableSection title="Property → Floor → Room → Bed">
          <DataTable
            embedded
            columns={[
              { key: 'hierarchy', label: 'Hierarchy', mobilePrimary: true },
              { key: 'tenant', label: 'Tenant' },
              { key: 'roomType', label: 'Type' },
              { key: 'rent', label: 'Rent' },
              { key: 'status', label: 'Status', badge: true },
              { key: 'actions', label: 'Actions' }
            ]}
            rows={rows}
          />
        </AdminTableSection>
      </AdminPageLayout>
    </>
  );
}
