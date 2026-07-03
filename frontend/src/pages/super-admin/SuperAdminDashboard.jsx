import { BedDouble, Building2, ClipboardList, ReceiptIndianRupee, TrendingUp, Users } from 'lucide-react';
import { ChartCard } from '../../components/shared/ChartCard';
import { DataTable } from '../../components/shared/DataTable';
import { PageHeader } from '../../components/shared/PageHeader';
import { StatCard } from '../../components/shared/StatCard';
import { useResource } from '../../hooks/useResource';
import { formatCurrency } from '../../lib/utils';
import { superAdminService } from '../../services/superAdminService';
import { superFallback } from './superAdminData';
import { superStatusVariant } from './superAdminUi';

export function SuperAdminDashboard() {
  const { data } = useResource(superAdminService.dashboard, {
    stats: superFallback.stats,
    propertyPerformance: superFallback.properties,
    monthlyGrowth: [{ name: 'Jan', value: 4200000 }, { name: 'Feb', value: 4700000 }, { name: 'Mar', value: 5100000 }, { name: 'Apr', value: 5450000 }, { name: 'May', value: 5900000 }, { name: 'Jun', value: 7840000 }]
  });
  const stats = data.stats || superFallback.stats;
  const properties = data.propertyPerformance || superFallback.properties;
  const propertyRows = properties.map((property) => ({
    id: property._id,
    name: property.name,
    city: property.city,
    revenue: formatCurrency(property.monthlyRevenue || 0),
    occupancy: `${property.occupancyRate || 0}%`,
    status: property.status,
    variant: superStatusVariant(property.status)
  }));

  return (
    <>
      <PageHeader eyebrow="Super Admin Portal" title="Enterprise Multi-PG Control Tower" description="Own and monitor every branch, property manager, revenue stream, complaint queue and audit trail from one executive dashboard." actionLabel="Create Property" />
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
      <DataTable columns={[{ key: 'name', label: 'Property' }, { key: 'city', label: 'City' }, { key: 'revenue', label: 'Revenue' }, { key: 'occupancy', label: 'Occupancy' }, { key: 'status', label: 'Status', badge: true }]} rows={propertyRows} />
    </>
  );
}
