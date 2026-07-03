import { DataTable } from '../../components/shared/DataTable';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { useResource } from '../../hooks/useResource';
import { superAdminService } from '../../services/superAdminService';
import { superFallback } from './superAdminData';
import { SuperHeader, superStatusVariant } from './superAdminUi';

export function TenantMonitoringPage() {
  const { data } = useResource(superAdminService.tenants, { tenants: superFallback.tenants, rentStatus: [] });
  const rows = (data.tenants || []).map((tenant) => ({
    id: tenant._id,
    name: tenant.name,
    property: tenant.property?.name || '-',
    city: tenant.property?.city || '-',
    room: tenant.profile?.roomNumber || '-',
    mobile: tenant.mobile || '-',
    status: tenant.status,
    variant: superStatusVariant(tenant.status)
  }));

  return (
    <>
      <SuperHeader title="Tenant Monitoring" description="Global tenant database with property, rent status, history and active/inactive visibility." />
      <Card>
        <CardHeader><CardTitle>Global Tenant Database</CardTitle></CardHeader>
        <CardContent><DataTable columns={[{ key: 'name', label: 'Tenant' }, { key: 'property', label: 'Property' }, { key: 'city', label: 'City' }, { key: 'room', label: 'Room' }, { key: 'mobile', label: 'Mobile' }, { key: 'status', label: 'Status', badge: true }]} rows={rows} /></CardContent>
      </Card>
    </>
  );
}
