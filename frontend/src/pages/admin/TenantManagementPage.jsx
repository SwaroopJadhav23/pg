import { useState } from 'react';
import { DataTable } from '../../components/shared/DataTable';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { emitToast } from '../../components/ui/toast';
import { useResource } from '../../hooks/useResource';
import { resolveImageUrl } from '../../pages/landing/utils/resolveImageUrl';
import { adminService } from '../../services/adminService';
import { AdminModuleHeader, adminStatusVariant } from './adminUi';
import { TenantPhotoField } from './components/TenantPhotoField';

const initialForm = { name: '', email: '', mobile: '', profile: { guardianName: '', emergencyContact: '', aadhaar: '', pan: '', photoUrl: '' } };

function scrollToForm() {
  document.getElementById('admin-tenant-form')?.scrollIntoView({ behavior: 'smooth' });
}

export function TenantManagementPage() {
  const { data, setData } = useResource(adminService.tenants, { tenants: [] });
  const [form, setForm] = useState(initialForm);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

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
        profile: { ...form.profile, photoUrl }
      });
      setData((current) => ({ tenants: [payload.tenant, ...(current.tenants || [])] }));
      setForm(initialForm);
      resetPhoto();
      setMessage('Tenant created successfully.');
      emitToast({ title: 'Tenant created', description: payload.tenant?.name || 'New tenant added.' });
    } catch (error) {
      setMessage(error.response?.data?.message || 'Could not create tenant.');
      emitToast({ title: 'Create failed', description: error.response?.data?.message || 'Could not create tenant.', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  }

  function copyTenantId(tenant) {
    navigator.clipboard.writeText(tenant._id);
    emitToast({ title: 'Tenant ID copied', description: tenant.name });
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
    room: `${tenant.profile?.roomNumber || '-'} / ${tenant.profile?.bedNumber || '-'}`,
    guardian: tenant.profile?.guardianName || 'Not set',
    status: tenant.status,
    variant: adminStatusVariant(tenant.status),
    actions: (
      <Button type="button" variant="outline" size="sm" onClick={() => copyTenantId(tenant)}>Copy ID</Button>
    )
  }));

  return (
    <>
      <AdminModuleHeader
        title="Tenant Management"
        description="Add, edit, delete and view tenant profiles with guardian, emergency and KYC details."
        actionLabel="Add Tenant"
        onAction={scrollToForm}
      />
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Card id="admin-tenant-form">
          <CardHeader><CardTitle>Add Tenant</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <TenantPhotoField
                previewUrl={photoPreview}
                onPhotoChange={handlePhotoChange}
                onClear={resetPhoto}
              />
              <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              <Input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              <Input placeholder="Mobile" value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} />
              <Input placeholder="Guardian Name" value={form.profile.guardianName} onChange={(e) => setForm({ ...form, profile: { ...form.profile, guardianName: e.target.value } })} />
              <Input placeholder="Emergency Contact" value={form.profile.emergencyContact} onChange={(e) => setForm({ ...form, profile: { ...form.profile, emergencyContact: e.target.value } })} />
              <div className="grid gap-3 sm:grid-cols-2">
                <Input placeholder="Aadhaar" value={form.profile.aadhaar} onChange={(e) => setForm({ ...form, profile: { ...form.profile, aadhaar: e.target.value } })} />
                <Input placeholder="PAN" value={form.profile.pan} onChange={(e) => setForm({ ...form, profile: { ...form.profile, pan: e.target.value } })} />
              </div>
              {message ? <p className="rounded-xl bg-primary/10 p-3 text-sm text-primary">{message}</p> : null}
              <Button type="submit" className="w-full" disabled={submitting}>{submitting ? 'Saving...' : 'Add Tenant'}</Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Tenant Table</CardTitle></CardHeader>
          <CardContent>
            <DataTable
              columns={[
                { key: 'photo', label: 'Photo' },
                { key: 'name', label: 'Tenant' },
                { key: 'email', label: 'Email' },
                { key: 'mobile', label: 'Mobile' },
                { key: 'room', label: 'Room/Bed' },
                { key: 'guardian', label: 'Guardian' },
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
