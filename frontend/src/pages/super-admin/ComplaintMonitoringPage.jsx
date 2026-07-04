import { useMemo } from 'react';
import { DataTable } from '../../components/shared/DataTable';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { useResource } from '../../hooks/useResource';
import { superAdminService } from '../../services/superAdminService';
import { SuperHeader, superStatusVariant } from './superAdminUi';

export function ComplaintMonitoringPage() {
  const { data } = useResource(superAdminService.complaints, { complaints: [] });
  const complaints = data.complaints || [];

  const filters = useMemo(() => {
    const statuses = [...new Set(complaints.map((item) => item.status).filter(Boolean))];
    const priorities = [...new Set(complaints.map((item) => item.priority).filter(Boolean))];
    const properties = [...new Set(complaints.map((item) => item.property?.name).filter(Boolean))];
    return [
      { key: 'status', label: 'Status', options: statuses },
      { key: 'priority', label: 'Priority', options: priorities },
      { key: 'property', label: 'Property', options: properties }
    ].filter((filter) => filter.options.length);
  }, [complaints]);

  const rows = complaints.map((complaint) => ({
    id: complaint._id,
    property: complaint.property?.name || '-',
    tenant: complaint.tenant?.name || '-',
    room: complaint.tenant?.profile?.roomNumber || '-',
    category: complaint.category,
    priority: complaint.priority,
    status: complaint.status,
    variant: superStatusVariant(complaint.status)
  }));

  return (
    <>
      <SuperHeader title="Complaint Monitoring" description="Monitor complaints across all properties with property, priority and status filters." />
      <Card>
        <CardHeader><CardTitle>All Property Complaints</CardTitle></CardHeader>
        <CardContent>
          <DataTable
            columns={[
              { key: 'property', label: 'Property' },
              { key: 'tenant', label: 'Tenant' },
              { key: 'room', label: 'Room' },
              { key: 'category', label: 'Category' },
              { key: 'priority', label: 'Priority' },
              { key: 'status', label: 'Status', badge: true }
            ]}
            rows={rows}
            filters={filters}
          />
        </CardContent>
      </Card>
    </>
  );
}
