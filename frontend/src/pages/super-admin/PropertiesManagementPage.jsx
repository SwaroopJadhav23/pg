import { useState } from 'react';
import { Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { emitToast } from '../../components/ui/toast';
import { useResource } from '../../hooks/useResource';
import { formatCurrency } from '../../lib/utils';
import { superAdminService } from '../../services/superAdminService';
import { SuperHeader, SuperStatus } from './superAdminUi';
import { PropertyPhotosField } from './components/PropertyPhotosField';
import { resolveImageUrl } from '../landing/utils/resolveImageUrl';

const initialForm = {
  name: '',
  address: '',
  city: '',
  capacity: '',
  floors: '',
  rooms: '',
  amenities: '',
  pricing: { minRent: '', maxRent: '' },
  adminLoginId: '',
  adminPassword: ''
};

function numberInputValue(value) {
  return value === 0 || value === '' || value == null ? '' : value;
}

function FormField({ label, hint, children, className = '' }) {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-sm font-semibold text-foreground">{label}</label>
      {children}
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

function toPhotos(property) {
  const urls = property.images?.length
    ? property.images
    : property.imageUrl
      ? [property.imageUrl]
      : [];

  return urls.map((url, index) => ({
    id: `existing-${index}-${url}`,
    preview: '',
    file: null,
    url
  }));
}

function toForm(property) {
  return {
    name: property.name || '',
    address: property.address || '',
    city: property.city || '',
    capacity: numberInputValue(property.capacity),
    floors: numberInputValue(property.floors),
    rooms: numberInputValue(property.rooms),
    amenities: (property.amenities || []).join(', '),
    pricing: {
      minRent: numberInputValue(property.pricing?.minRent),
      maxRent: numberInputValue(property.pricing?.maxRent)
    },
    adminLoginId: property.adminLoginId || property.name || '',
    adminPassword: ''
  };
}

export function PropertiesManagementPage() {
  const navigate = useNavigate();
  const { data, setData } = useResource(superAdminService.properties, { properties: [] });
  const [form, setForm] = useState(initialForm);
  const [photos, setPhotos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewingProperty, setViewingProperty] = useState(null);
  const [message, setMessage] = useState('');
  const isFormOpen = showForm || Boolean(editingId);

  function buildPayload() {
    const payload = {
      name: form.name,
      address: form.address,
      city: form.city,
      capacity: Number(form.capacity) || 0,
      floors: Number(form.floors) || 0,
      rooms: Number(form.rooms) || 0,
      amenities: String(form.amenities || '').split(',').map((item) => item.trim()).filter(Boolean),
      pricing: {
        minRent: Number(form.pricing?.minRent) || 0,
        maxRent: Number(form.pricing?.maxRent) || 0
      },
      adminLoginId: form.adminLoginId.trim() || form.name.trim()
    };

    if (form.adminPassword.trim()) {
      payload.adminPassword = form.adminPassword.trim();
    }

    return payload;
  }

  function resetPhotos(nextPhotos = []) {
    photos.forEach((photo) => {
      if (photo.preview?.startsWith('blob:')) URL.revokeObjectURL(photo.preview);
    });
    setPhotos(nextPhotos);
  }

  async function resolvePhotoUrls() {
    const existingUrls = photos.filter((photo) => photo.url).map((photo) => photo.url);
    const newFiles = photos.filter((photo) => photo.file).map((photo) => photo.file);
    if (!newFiles.length) return existingUrls;

    const upload = await superAdminService.uploadPropertyPhotos(newFiles);
    return [...existingUrls, ...(upload.photoUrls || [])];
  }

  async function submit(event) {
    event.preventDefault();
    try {
      const payload = buildPayload();
      const images = await resolvePhotoUrls();
      payload.images = images;
      payload.imageUrl = images[0] || '';

      if (editingId) {
        const result = await superAdminService.updateProperty(editingId, payload);
        setData((current) => ({
          properties: (current.properties || []).map((property) => (property._id === editingId ? { ...property, ...result.property } : property))
        }));
        setEditingId(null);
        setForm(initialForm);
        resetPhotos();
        setShowForm(false);
        const loginInfo = result.adminLogin;
        setMessage(loginInfo
          ? `Property updated. Admin login ID: "${loginInfo.adminLoginId}"${loginInfo.password ? ` / ${loginInfo.password}` : ''}`
          : 'Property updated.');
        emitToast({
          title: 'Property updated',
          description: loginInfo
            ? `Admin login ID is "${loginInfo.adminLoginId}"${loginInfo.password ? ` and password was updated.` : '.'}`
            : result.property?.name || 'Changes saved.'
        });
      } else {
        const result = await superAdminService.createProperty(payload);
        setData((current) => ({ properties: [result.property, ...(current.properties || [])] }));
        setForm(initialForm);
        resetPhotos();
        setShowForm(false);
        const loginInfo = result.adminLogin;
        setMessage(loginInfo
          ? `Property created. Admin login: "${loginInfo.adminLoginId}" / ${loginInfo.password || 'admin123'}`
          : 'Property created.');
        emitToast({
          title: 'Property created',
          description: loginInfo
            ? `Admin can log in with ID "${loginInfo.adminLoginId}" and password ${loginInfo.password || 'admin123'}.`
            : result.property?.name || 'New branch added.'
        });
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Could not save property. Check your inputs and try again.');
      emitToast({ title: 'Save failed', description: error.response?.data?.message || 'Could not save property.', variant: 'destructive' });
    }
  }

  function openCreateForm() {
    setEditingId(null);
    setForm(initialForm);
    resetPhotos();
    setViewingProperty(null);
    setMessage('');
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(initialForm);
    resetPhotos();
    setMessage('');
  }

  function startEdit(property) {
    setShowForm(true);
    setEditingId(property._id);
    setForm(toForm(property));
    resetPhotos(toPhotos(property));
    setViewingProperty(null);
    setMessage(`Editing ${property.name}.`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function startView(property) {
    setViewingProperty(property);
    setMessage('');
  }

  async function disableProperty(property) {
    if (!window.confirm(`Disable ${property.name}?`)) return;
    try {
      const result = await superAdminService.disableProperty(property._id);
      setData((current) => ({
        properties: (current.properties || []).map((item) => (item._id === property._id ? { ...item, ...result.property } : item))
      }));
      emitToast({ title: 'Property disabled', description: property.name });
    } catch (error) {
      emitToast({ title: 'Disable failed', description: error.response?.data?.message || 'Could not disable property.', variant: 'destructive' });
    }
  }

  async function deleteProperty(property) {
    if (!window.confirm(`Permanently delete ${property.name}? This cannot be undone.`)) return;
    try {
      await superAdminService.deleteProperty(property._id);
      setData((current) => ({
        properties: (current.properties || []).filter((item) => item._id !== property._id)
      }));
      if (editingId === property._id) cancelEdit();
      if (viewingProperty?._id === property._id) setViewingProperty(null);
      emitToast({ title: 'Property deleted', description: property.name });
    } catch (error) {
      emitToast({ title: 'Delete failed', description: error.response?.data?.message || 'Could not delete property.', variant: 'destructive' });
    }
  }

  function openAdmin(property) {
    emitToast({
      title: 'Property admin login',
      description: `Use login ID "${property.adminLoginId || property.name}" and password admin123 on the login page.`
    });
    navigate('/login');
  }

  function cancelEdit() {
    closeForm();
  }

  return (
    <>
      <SuperHeader
        title="Properties Management"
        description="Create, edit, disable and monitor every PG branch with occupancy and revenue performance."
        actionLabel={isFormOpen ? 'Back to Properties' : 'Add Property'}
        onAction={() => (isFormOpen ? closeForm() : openCreateForm())}
      />
      <div className="space-y-5">
        {isFormOpen ? (
        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-4 md:p-5">
            <h2 className="mb-4 text-lg font-bold">{editingId ? 'Edit Property' : 'Create New Property'}</h2>
            <form onSubmit={submit} className="space-y-5">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                <FormField label="Property Name">
                  <Input placeholder="e.g. Om Sai Residency" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </FormField>
                <FormField label="City">
                  <Input placeholder="e.g. Pune, Mumbai, Nashik" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                </FormField>
                <FormField label="Address" className="md:col-span-2 xl:col-span-1">
                  <Input placeholder="e.g. Baner Road, Nashik Road" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
                </FormField>
              </div>

              <PropertyPhotosField photos={photos} onChange={setPhotos} />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <FormField label="Number of Beds" hint="Total beds available in this property">
                  <Input type="number" min="0" placeholder="e.g. 100" value={numberInputValue(form.capacity)} onChange={(e) => setForm({ ...form, capacity: e.target.value })} />
                </FormField>
                <FormField label="Floors" hint="Number of floors">
                  <Input type="number" min="0" placeholder="e.g. 4" value={numberInputValue(form.floors)} onChange={(e) => setForm({ ...form, floors: e.target.value })} />
                </FormField>
                <FormField label="Rooms" hint="Total rooms in the property">
                  <Input type="number" min="0" placeholder="e.g. 50" value={numberInputValue(form.rooms)} onChange={(e) => setForm({ ...form, rooms: e.target.value })} />
                </FormField>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="Min Rent (₹)" hint="Lowest monthly rent">
                  <Input type="number" min="0" placeholder="e.g. 7000" value={numberInputValue(form.pricing?.minRent)} onChange={(e) => setForm({ ...form, pricing: { ...form.pricing, minRent: e.target.value } })} />
                </FormField>
                <FormField label="Max Rent (₹)" hint="Highest monthly rent">
                  <Input type="number" min="0" placeholder="e.g. 12000" value={numberInputValue(form.pricing?.maxRent)} onChange={(e) => setForm({ ...form, pricing: { ...form.pricing, maxRent: e.target.value } })} />
                </FormField>
              </div>

              <FormField label="Amenities" hint="Separate each amenity with a comma">
                <Input placeholder="WiFi, Food, Laundry, Security" value={form.amenities} onChange={(e) => setForm({ ...form, amenities: e.target.value })} />
              </FormField>

              <div className="space-y-4 rounded-2xl border bg-slate-50 p-4 dark:bg-slate-900/40">
                <p className="text-sm font-bold text-primary">Admin Login Credentials</p>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField label="Admin Login ID" hint="Property admin uses this ID on the login page">
                    <Input
                      placeholder="e.g. Jaddhav Residency"
                      value={form.adminLoginId}
                      onChange={(e) => setForm({ ...form, adminLoginId: e.target.value })}
                    />
                  </FormField>
                  <FormField
                    label="Admin Password"
                    hint={editingId ? 'Leave blank to keep the current password' : 'Default is admin123 if left blank'}
                  >
                    <Input
                      type="password"
                      placeholder={editingId ? 'Enter new password to change' : 'admin123'}
                      value={form.adminPassword}
                      onChange={(e) => setForm({ ...form, adminPassword: e.target.value })}
                      autoComplete="new-password"
                    />
                  </FormField>
                </div>
              </div>

              {message ? <p className="rounded-xl bg-primary/10 p-3 text-sm text-primary">{message}</p> : null}

              <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                <Button type="button" variant="outline" className="sm:min-w-32" onClick={cancelEdit}>Cancel</Button>
                <Button type="submit" className="sm:min-w-40">{editingId ? 'Update Property' : 'Create Property'}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
        ) : (
        <>
        {viewingProperty ? (
            <Card className="rounded-2xl shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold">{viewingProperty.name}</h3>
                    <p className="text-sm text-muted-foreground">{viewingProperty.city} • {viewingProperty.address}</p>
                  </div>
                  <Button type="button" variant="ghost" size="sm" onClick={() => setViewingProperty(null)}>Close</Button>
                </div>
                <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                  <p><span className="font-semibold">Number of Beds:</span> {viewingProperty.capacity || 0}</p>
                  <p><span className="font-semibold">Floors:</span> {viewingProperty.floors || 0}</p>
                  <p><span className="font-semibold">Rooms:</span> {viewingProperty.rooms || 0}</p>
                  <p><span className="font-semibold">Occupancy:</span> {viewingProperty.occupancyRate || 0}%</p>
                  <p><span className="font-semibold">Revenue:</span> {formatCurrency(viewingProperty.monthlyRevenue || 0)}</p>
                  <p><span className="font-semibold">Manager:</span> {viewingProperty.manager?.name || 'Not assigned'}</p>
                  <p><span className="font-semibold">Admin Login ID:</span> {viewingProperty.adminLoginId || viewingProperty.name}</p>
                  <p className="sm:col-span-2"><span className="font-semibold">Amenities:</span> {(viewingProperty.amenities || []).join(', ') || 'None listed'}</p>
                </div>
                {(viewingProperty.images?.length || viewingProperty.imageUrl) ? (
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {(viewingProperty.images?.length ? viewingProperty.images : [viewingProperty.imageUrl]).map((url) => (
                      <img key={url} src={resolveImageUrl(url)} alt={viewingProperty.name} className="h-24 w-full rounded-xl border object-cover" />
                    ))}
                  </div>
                ) : null}
              </CardContent>
            </Card>
          ) : null}

        {(data.properties || []).length ? (
          <div>
            <h2 className="mb-3 text-base font-bold">Your Properties</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {(data.properties || []).map((property) => (
              <Card key={property._id} className="rounded-2xl shadow-sm">
                <CardContent className="p-4">
                  {(property.images?.length || property.imageUrl) ? (
                    <img
                      src={resolveImageUrl(property.images?.[0] || property.imageUrl)}
                      alt={property.name}
                      className="mb-3 h-28 w-full rounded-xl border object-cover"
                    />
                  ) : (
                    <div className="mb-3 flex h-28 items-center justify-center rounded-xl border border-dashed bg-slate-50 text-muted-foreground dark:bg-slate-900/40">
                      <Building2 className="h-6 w-6" />
                    </div>
                  )}
                  <div className="flex items-start justify-end">
                    <SuperStatus status={property.status} />
                  </div>
                  <h3 className="mt-2 text-base font-bold">{property.name}</h3>
                  <p className="text-xs text-muted-foreground">{property.city} • {property.address}</p>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <Badge>{property.occupancyRate || 0}% occupancy</Badge>
                    <Badge variant="success">{formatCurrency(property.monthlyRevenue || 0)}</Badge>
                    <Badge variant="warning">{property.availableBeds || 0} beds available</Badge>
                    <Badge variant="slate">{property.manager?.name || 'No manager'}</Badge>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    <Button type="button" variant="outline" size="sm" onClick={() => startView(property)}>View</Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => startEdit(property)}>Edit</Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => openAdmin(property)}>Open Admin</Button>
                    {property.status !== 'disabled' ? (
                      <Button type="button" variant="destructive" size="sm" onClick={() => disableProperty(property)}>Disable</Button>
                    ) : null}
                    <Button type="button" variant="destructive" size="sm" onClick={() => deleteProperty(property)}>Delete Property</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            </div>
          </div>
        ) : (
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="flex flex-col items-center justify-center gap-3 p-10 text-center">
              <Building2 className="h-10 w-10 text-muted-foreground" />
              <div>
                <h2 className="text-lg font-bold">No properties yet</h2>
                <p className="mt-1 text-sm text-muted-foreground">Click Add Property to create your first PG branch.</p>
              </div>
              <Button type="button" onClick={openCreateForm}>Add Property</Button>
            </CardContent>
          </Card>
        )}
        </>
        )}
      </div>
    </>
  );
}
