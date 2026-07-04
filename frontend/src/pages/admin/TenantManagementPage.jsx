import { useState } from 'react';
import { DataTable } from '../../components/shared/DataTable';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { emitToast } from '../../components/ui/toast';
import { useResource } from '../../hooks/useResource';
import { resolveImageUrl } from '../../pages/landing/utils/resolveImageUrl';
import { adminService } from '../../services/adminService';
import { AdminFormCard, AdminFormField, AdminModuleHeader, AdminPageLayout, AdminTableSection, adminStatusVariant } from './adminUi';
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
              <Input className="h-11" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              <Input className="h-11" placeholder="Mobile" value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} />
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
            columns={[
              { key: 'photo', label: 'Photo', hideOnMobile: true },
              { key: 'name', label: 'Tenant', mobilePrimary: true },
              { key: 'email', label: 'Email' },
              { key: 'mobile', label: 'Mobile' },
              { key: 'room', label: 'Room/Bed' },
              { key: 'guardian', label: 'Guardian' },
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
