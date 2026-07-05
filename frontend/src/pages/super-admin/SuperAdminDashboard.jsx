import { BedDouble, Building2, ClipboardList, ReceiptIndianRupee, TrendingUp, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ChartCard } from '../../components/shared/ChartCard';
import { DataTable } from '../../components/shared/DataTable';
import { PageHeader } from '../../components/shared/PageHeader';
import { StatCard } from '../../components/shared/StatCard';
import { Button } from '../../components/ui/button';
import { useResource } from '../../hooks/useResource';
import { formatCurrency } from '../../lib/utils';
import { emptySuperDashboard } from '../../config/emptyStates';
import { superAdminService } from '../../services/superAdminService';
import { superStatusVariant } from './superAdminUi';

export function SuperAdminDashboard() {
  const navigate = useNavigate();
  const { data } = useResource(superAdminService.dashboard, emptySuperDashboard);
  const stats = data.stats || emptySuperDashboard.stats;
  const properties = data.propertyPerformance || [];
  const propertyRows = properties.map((property) => ({
    id: property._id,
    name: property.name,
    city: property.city,
    revenue: formatCurrency(property.monthlyRevenue || 0),
    occupancy: `${property.occupancyRate || 0}%`,
    status: property.status,
    variant: superStatusVariant(property.status),
    actions: (
      <Button type="button" variant="outline" size="sm" onClick={() => navigate('/super-admin/properties')}>
        Manage
      </Button>
    )
  }));

  return (
    <div className="portal-page flex w-full min-w-0 max-w-full flex-col gap-4 overflow-visible sm:gap-5 md:gap-6">
      <PageHeader
        eyebrow="Super Admin Portal"
        title="Enterprise Multi-PG Control Tower"
        description="Own and monitor every branch, property manager, revenue stream, complaint queue and audit trail from one executive dashboard."
        actionLabel="Create Property"
        onAction={() => navigate('/super-admin/properties')}
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Properties" value={stats.totalProperties} icon={Building2} delta="Multi-city portfolio" />
        <StatCard label="Total Beds" value={stats.totalBeds} icon={BedDouble} tone="success" delta={`${stats.occupiedBeds} occupied`} />
        <StatCard label="Active Tenants" value={stats.activeTenants} icon={Users} />
        <StatCard label="Monthly Revenue" value={formatCurrency(stats.monthlyRevenue || 0)} icon={ReceiptIndianRupee} tone="success" />
        <StatCard label="Pending Rent" value={formatCurrency(stats.pendingRent || 0)} icon={TrendingUp} tone="warning" />
        <StatCard label="Open Complaints" value={stats.openComplaints} icon={ClipboardList} tone="warning" />
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <ChartCard title="Monthly Growth" description="Portfolio revenue growth" data={data.monthlyGrowth || []} />
        <ChartCard title="Occupancy by Property" description="Branch level occupancy rate" data={properties.map((property) => ({ name: property.name, value: property.occupancyRate || 0 }))} type="bar" />
      </div>
      <DataTable
        columns={[
          { key: 'name', label: 'Property' },
          { key: 'city', label: 'City' },
          { key: 'revenue', label: 'Revenue' },
          { key: 'occupancy', label: 'Occupancy' },
          { key: 'status', label: 'Status', badge: true },
          { key: 'actions', label: 'Actions' }
        ]}
        rows={propertyRows}
      />
    </div>
  );
}
