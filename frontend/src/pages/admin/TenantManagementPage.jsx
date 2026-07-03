import { useState } from 'react';
import { DataTable } from '../../components/shared/DataTable';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { useResource } from '../../hooks/useResource';
import { adminService } from '../../services/adminService';
import { adminFallback } from './adminPortalData';
import { AdminModuleHeader, adminStatusVariant } from './adminUi';

const initialForm = { name: '', email: '', mobile: '', profile: { guardianName: '', emergencyContact: '', aadhaar: '', pan: '' } };

export function TenantManagementPage() {
  const { data, setData } = useResource(adminService.tenants, { tenants: adminFallback.tenants });
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState('');

  async function submit(event) {
    event.preventDefault();
    try {
      const payload = await adminService.createTenant(form);
      setData((current) => ({ tenants: [payload.tenant, ...(current.tenants || [])] }));
      setForm(initialForm);
      setMessage('Tenant created with default password Password@123.');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Tenant form ready. Connect backend to persist.');
    }
  }

  const rows = (data.tenants || []).map((tenant) => ({
    id: tenant._id,
    name: tenant.name,
    email: tenant.email,
    mobile: tenant.mobile || 'Not set',
    room: `${tenant.profile?.roomNumber || '-'} / ${tenant.profile?.bedNumber || '-'}`,
    guardian: tenant.profile?.guardianName || 'Not set',
    status: tenant.status,
    variant: adminStatusVariant(tenant.status)
  }));

  return (
    <>
      <AdminModuleHeader title="Tenant Management" description="Add, edit, delete and view tenant profiles with guardian, emergency and KYC details." actionLabel="Bulk Actions" />
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <CardHeader><CardTitle>Add Tenant</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <Input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <Input placeholder="Mobile" value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} />
              <Input placeholder="Guardian Name" value={form.profile.guardianName} onChange={(e) => setForm({ ...form, profile: { ...form.profile, guardianName: e.target.value } })} />
              <Input placeholder="Emergency Contact" value={form.profile.emergencyContact} onChange={(e) => setForm({ ...form, profile: { ...form.profile, emergencyContact: e.target.value } })} />
              <div className="grid gap-3 sm:grid-cols-2">
                <Input placeholder="Aadhaar" value={form.profile.aadhaar} onChange={(e) => setForm({ ...form, profile: { ...form.profile, aadhaar: e.target.value } })} />
                <Input placeholder="PAN" value={form.profile.pan} onChange={(e) => setForm({ ...form, profile: { ...form.profile, pan: e.target.value } })} />
              </div>
              {message ? <p className="rounded-xl bg-primary/10 p-3 text-sm text-primary">{message}</p> : null}
              <Button className="w-full">Add Tenant</Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Tenant Table</CardTitle></CardHeader>
          <CardContent><DataTable columns={[{ key: 'name', label: 'Tenant' }, { key: 'email', label: 'Email' }, { key: 'mobile', label: 'Mobile' }, { key: 'room', label: 'Room/Bed' }, { key: 'guardian', label: 'Guardian' }, { key: 'status', label: 'Status', badge: true }]} rows={rows} /></CardContent>
        </Card>
      </div>
    </>
  );
}
