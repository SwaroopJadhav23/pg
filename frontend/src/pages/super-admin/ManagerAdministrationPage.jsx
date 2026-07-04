import { useState } from 'react';
import { DataTable } from '../../components/shared/DataTable';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { emitToast } from '../../components/ui/toast';
import { useResource } from '../../hooks/useResource';
import { superAdminService } from '../../services/superAdminService';
import { SuperHeader, superStatusVariant } from './superAdminUi';

const initialForm = { name: '', email: '', mobile: '', property: '' };

export function ManagerAdministrationPage() {
  const { data, setData } = useResource(superAdminService.managers, { managers: [] });
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState('');

  async function submit(event) {
    event.preventDefault();
    try {
      const payload = await superAdminService.createManager(form);
      setData((current) => ({ managers: [payload.manager, ...(current.managers || [])] }));
      setForm(initialForm);
      setMessage('Manager created successfully.');
      emitToast({ title: 'Manager created', description: `${payload.manager?.email} was added.` });
    } catch (error) {
      setMessage(error.response?.data?.message || 'Could not create manager. Check your inputs.');
      emitToast({ title: 'Create failed', description: error.response?.data?.message || 'Could not create manager.', variant: 'destructive' });
    }
  }

  async function disableManager(manager) {
    if (!window.confirm(`Disable ${manager.name}?`)) return;
    try {
      const payload = await superAdminService.disableManager(manager._id);
      setData((current) => ({
        managers: (current.managers || []).map((item) => (item._id === manager._id ? { ...item, ...payload.manager } : item))
      }));
      emitToast({ title: 'Manager disabled', description: manager.name });
    } catch (error) {
      emitToast({ title: 'Disable failed', description: error.response?.data?.message || 'Could not disable manager.', variant: 'destructive' });
    }
  }

  async function assignProperty(manager) {
    const propertyId = window.prompt('Enter property ID to assign to this manager:');
    if (!propertyId?.trim()) return;
    try {
      const payload = await superAdminService.assignManager(manager._id, propertyId.trim());
      setData((current) => ({
        managers: (current.managers || []).map((item) => (item._id === manager._id ? { ...item, ...payload.manager } : item))
      }));
      emitToast({ title: 'Manager assigned', description: payload.manager?.property?.name || 'Property linked.' });
    } catch (error) {
      emitToast({ title: 'Assign failed', description: error.response?.data?.message || 'Could not assign property.', variant: 'destructive' });
    }
  }

  const rows = (data.managers || []).map((manager) => ({
    id: manager._id,
    name: manager.name,
    email: manager.email,
    mobile: manager.mobile || '-',
    property: manager.property?.name || 'Unassigned',
    status: manager.status,
    variant: superStatusVariant(manager.status),
    actions: (
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm" onClick={() => assignProperty(manager)}>Assign</Button>
        {manager.status !== 'inactive' ? (
          <Button type="button" variant="destructive" size="sm" onClick={() => disableManager(manager)}>Disable</Button>
        ) : null}
      </div>
    )
  }));

  return (
    <>
      <SuperHeader
        title="Manager Administration"
        description="Create property managers, assign properties, edit access and disable manager accounts."
        actionLabel="Create Manager"
        onAction={() => document.getElementById('manager-create-form')?.scrollIntoView({ behavior: 'smooth' })}
      />
      <div className="grid gap-6 xl:grid-cols-[0.75fr_1.25fr]">
        <Card id="manager-create-form">
          <CardHeader><CardTitle>Create Manager</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              <Input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              <Input placeholder="Mobile" value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} />
              <Input placeholder="Property ID optional" value={form.property} onChange={(e) => setForm({ ...form, property: e.target.value })} />
              {message ? <p className="rounded-xl bg-primary/10 p-3 text-sm text-primary">{message}</p> : null}
              <Button type="submit" className="w-full">Create Manager</Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Property Managers</CardTitle></CardHeader>
          <CardContent>
            <DataTable
              columns={[
                { key: 'name', label: 'Manager' },
                { key: 'email', label: 'Email' },
                { key: 'mobile', label: 'Mobile' },
                { key: 'property', label: 'Property' },
                { key: 'status', label: 'Status', badge: true },
                { key: 'actions', label: 'Actions' }
              ]}
              rows={rows}
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
