import { useState } from 'react';
import { BedDouble } from 'lucide-react';
import { DataTable } from '../../components/shared/DataTable';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { useResource } from '../../hooks/useResource';
import { formatCurrency } from '../../lib/utils';
import { adminService } from '../../services/adminService';
import { adminFallback } from './adminPortalData';
import { AdminModuleHeader, adminStatusVariant } from './adminUi';

const initialForm = { floor: '', roomNumber: '', bedNumber: '', roomType: '', sharingDetails: '', rent: 0, status: 'vacant', amenities: [] };

export function RoomManagementPage() {
  const { data, setData } = useResource(adminService.rooms, { rooms: adminFallback.rooms });
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState('');

  async function submit(event) {
    event.preventDefault();
    try {
      const payload = await adminService.createRoom({ ...form, amenities: String(form.amenities || '').split(',').map((item) => item.trim()).filter(Boolean) });
      setData((current) => ({ rooms: [payload.room, ...(current.rooms || [])] }));
      setForm(initialForm);
      setMessage('Room/bed created.');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Room form ready. Connect backend to persist.');
    }
  }

  const rows = (data.rooms || []).map((room) => ({
    id: room._id,
    hierarchy: `Floor ${room.floor} → Room ${room.roomNumber} → Bed ${room.bedNumber}`,
    tenant: room.tenant?.name || 'Vacant',
    roomType: room.roomType || 'Standard',
    rent: formatCurrency(room.rent || 0),
    status: room.status,
    variant: adminStatusVariant(room.status)
  }));

  return (
    <>
      <AdminModuleHeader title="Room Management" description="Create floors, rooms and beds, assign tenants, transfer tenants and vacate beds." />
      <div className="grid gap-6 xl:grid-cols-[0.75fr_1.25fr]">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><BedDouble className="h-5 w-5" /> Create Bed</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-3">
                <Input placeholder="Floor" value={form.floor} onChange={(e) => setForm({ ...form, floor: e.target.value })} />
                <Input placeholder="Room" value={form.roomNumber} onChange={(e) => setForm({ ...form, roomNumber: e.target.value })} />
                <Input placeholder="Bed" value={form.bedNumber} onChange={(e) => setForm({ ...form, bedNumber: e.target.value })} />
              </div>
              <Input placeholder="Room Type" value={form.roomType} onChange={(e) => setForm({ ...form, roomType: e.target.value })} />
              <Input placeholder="Sharing Details" value={form.sharingDetails} onChange={(e) => setForm({ ...form, sharingDetails: e.target.value })} />
              <Input type="number" placeholder="Rent" value={form.rent} onChange={(e) => setForm({ ...form, rent: e.target.value })} />
              <Input placeholder="Amenities comma separated" value={form.amenities} onChange={(e) => setForm({ ...form, amenities: e.target.value })} />
              {message ? <p className="rounded-xl bg-primary/10 p-3 text-sm text-primary">{message}</p> : null}
              <Button className="w-full">Create Room / Bed</Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Property → Floor → Room → Bed</CardTitle></CardHeader>
          <CardContent><DataTable columns={[{ key: 'hierarchy', label: 'Hierarchy' }, { key: 'tenant', label: 'Tenant' }, { key: 'roomType', label: 'Type' }, { key: 'rent', label: 'Rent' }, { key: 'status', label: 'Status', badge: true }]} rows={rows} /></CardContent>
        </Card>
      </div>
    </>
  );
}
