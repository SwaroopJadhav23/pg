import { useState } from 'react';
import { Building2 } from 'lucide-react';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { useResource } from '../../hooks/useResource';
import { formatCurrency } from '../../lib/utils';
import { superAdminService } from '../../services/superAdminService';
import { superFallback } from './superAdminData';
import { SuperHeader, SuperStatus } from './superAdminUi';

const initialForm = { name: '', address: '', city: '', capacity: 0, floors: 0, rooms: 0, amenities: [], pricing: { minRent: 0, maxRent: 0 } };

export function PropertiesManagementPage() {
  const { data, setData } = useResource(superAdminService.properties, { properties: superFallback.properties });
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState('');

  async function submit(event) {
    event.preventDefault();
    try {
      const payload = await superAdminService.createProperty({ ...form, amenities: String(form.amenities || '').split(',').map((item) => item.trim()).filter(Boolean) });
      setData((current) => ({ properties: [payload.property, ...(current.properties || [])] }));
      setForm(initialForm);
      setMessage('Property created.');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Property form ready. Connect backend to persist.');
    }
  }

  return (
    <>
      <SuperHeader title="Properties Management" description="Create, edit, disable and monitor every PG branch with occupancy and revenue performance." />
      <div className="grid gap-6 xl:grid-cols-[0.75fr_1.25fr]">
        <Card>
          <CardContent className="p-6">
            <h2 className="mb-4 text-xl font-bold">Create New Property</h2>
            <form onSubmit={submit} className="space-y-4">
              <Input placeholder="Property Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <Input placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              <Input placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
              <div className="grid gap-3 sm:grid-cols-3">
                <Input type="number" placeholder="Capacity" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} />
                <Input type="number" placeholder="Floors" value={form.floors} onChange={(e) => setForm({ ...form, floors: e.target.value })} />
                <Input type="number" placeholder="Rooms" value={form.rooms} onChange={(e) => setForm({ ...form, rooms: e.target.value })} />
              </div>
              <Input placeholder="Amenities comma separated" value={form.amenities} onChange={(e) => setForm({ ...form, amenities: e.target.value })} />
              {message ? <p className="rounded-xl bg-primary/10 p-3 text-sm text-primary">{message}</p> : null}
              <Button className="w-full">Create Property</Button>
            </form>
          </CardContent>
        </Card>
        <div className="grid gap-4 md:grid-cols-2">
          {(data.properties || []).map((property) => (
            <Card key={property._id}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="rounded-2xl bg-primary/10 p-3 text-primary"><Building2 className="h-5 w-5" /></div>
                  <SuperStatus status={property.status} />
                </div>
                <h3 className="mt-4 text-lg font-bold">{property.name}</h3>
                <p className="text-sm text-muted-foreground">{property.city} • {property.address}</p>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <Badge>{property.occupancyRate || 0}% occupancy</Badge>
                  <Badge variant="success">{formatCurrency(property.monthlyRevenue || 0)}</Badge>
                  <Badge variant="warning">{property.availableBeds || 0} beds available</Badge>
                  <Badge variant="slate">{property.manager?.name || 'No manager'}</Badge>
                </div>
                <div className="mt-5 flex gap-2">
                  <Button variant="outline" size="sm">View</Button>
                  <Button variant="outline" size="sm">Edit</Button>
                  <Button variant="outline" size="sm">Open Admin</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
