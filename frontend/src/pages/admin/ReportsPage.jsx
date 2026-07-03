import { Download } from 'lucide-react';
import { DataTable } from '../../components/shared/DataTable';
import { StatCard } from '../../components/shared/StatCard';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { useResource } from '../../hooks/useResource';
import { formatCurrency } from '../../lib/utils';
import { adminService } from '../../services/adminService';
import { adminFallback } from './adminPortalData';
import { AdminModuleHeader, adminStatusVariant } from './adminUi';

export function ReportsPage() {
  const { data } = useResource(adminService.reports, {
    occupancy: [{ _id: 'occupied', count: adminFallback.stats.occupiedBeds }, { _id: 'vacant', count: adminFallback.stats.vacantBeds }],
    revenue: [{ _id: 'paid', total: adminFallback.stats.monthlyRevenue }, { _id: 'pending', total: adminFallback.stats.pendingRent }],
    expenseReport: [{ _id: 'electricity', total: 42000 }, { _id: 'internet', total: 8500 }],
    tenantReport: adminFallback.tenants,
    exports: ['pdf', 'excel']
  });

  const tenantRows = (data.tenantReport || []).map((tenant) => ({
    id: tenant._id,
    name: tenant.name,
    email: tenant.email,
    room: tenant.profile?.roomNumber || '-',
    status: tenant.status,
    variant: adminStatusVariant(tenant.status)
  }));

  return (
    <>
      <AdminModuleHeader title="Reports" description="Generate occupancy, revenue, rent collection, expense and tenant reports with PDF/Excel export." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {(data.occupancy || []).map((item) => <StatCard key={item._id} label={`${item._id} Beds`} value={item.count} />)}
        {(data.revenue || []).slice(0, 2).map((item) => <StatCard key={item._id} label={`${item._id} Rent`} value={formatCurrency(item.total || 0)} />)}
      </div>
      <Card>
        <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <CardTitle>Tenant Report</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline"><Download className="h-4 w-4" /> PDF</Button>
            <Button variant="outline"><Download className="h-4 w-4" /> Excel</Button>
          </div>
        </CardHeader>
        <CardContent><DataTable columns={[{ key: 'name', label: 'Tenant' }, { key: 'email', label: 'Email' }, { key: 'room', label: 'Room' }, { key: 'status', label: 'Status', badge: true }]} rows={tenantRows} /></CardContent>
      </Card>
    </>
  );
}
