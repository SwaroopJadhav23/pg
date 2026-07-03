import { useState } from 'react';
import { DataTable } from '../../components/shared/DataTable';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { useResource } from '../../hooks/useResource';
import { superAdminService } from '../../services/superAdminService';
import { superFallback } from './superAdminData';
import { SuperHeader, superStatusVariant } from './superAdminUi';

const initialForm = { name: '', email: '', mobile: '', property: '' };

export function ManagerAdministrationPage() {
  const { data, setData } = useResource(superAdminService.managers, { managers: superFallback.managers });
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState('');

  async function submit(event) {
    event.preventDefault();
    try {
      const payload = await superAdminService.createManager(form);
      setData((current) => ({ managers: [payload.manager, ...(current.managers || [])] }));
      setForm(initialForm);
      setMessage('Manager created with default password Password@123.');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Manager form ready. Connect backend to persist.');
    }
  }

  const rows = (data.managers || []).map((manager) => ({
    id: manager._id,
    name: manager.name,
    email: manager.email,
    mobile: manager.mobile || '-',
    property: manager.property?.name || 'Unassigned',
    status: manager.status,
    variant: superStatusVariant(manager.status)
  }));

  return (
    <>
      <SuperHeader title="Manager Administration" description="Create property managers, assign properties, edit access and disable manager accounts." />
      <div className="grid gap-6 xl:grid-cols-[0.75fr_1.25fr]">
        <Card>
          <CardHeader><CardTitle>Create Manager</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <Input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <Input placeholder="Mobile" value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} />
              <Input placeholder="Property ID optional" value={form.property} onChange={(e) => setForm({ ...form, property: e.target.value })} />
              {message ? <p className="rounded-xl bg-primary/10 p-3 text-sm text-primary">{message}</p> : null}
              <Button className="w-full">Create Manager</Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Property Managers</CardTitle></CardHeader>
          <CardContent><DataTable columns={[{ key: 'name', label: 'Manager' }, { key: 'email', label: 'Email' }, { key: 'mobile', label: 'Mobile' }, { key: 'property', label: 'Property' }, { key: 'status', label: 'Status', badge: true }]} rows={rows} /></CardContent>
        </Card>
      </div>
    </>
  );
}
