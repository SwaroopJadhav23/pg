import { BedDouble, ClipboardList, ReceiptIndianRupee, UserRoundCheck, Users, WalletCards } from 'lucide-react';
import { ChartCard } from '../../components/shared/ChartCard';
import { DataTable } from '../../components/shared/DataTable';
import { PageHeader } from '../../components/shared/PageHeader';
import { StatCard } from '../../components/shared/StatCard';
import { useResource } from '../../hooks/useResource';
import { formatCurrency } from '../../lib/utils';
import { adminService } from '../../services/adminService';
import { adminFallback } from './adminPortalData';
import { adminStatusVariant } from './adminUi';

export function AdminDashboard() {
  const { data } = useResource(adminService.dashboard, {
    stats: adminFallback.stats,
    recentRents: adminFallback.rents,
    complaintsByStatus: [{ _id: 'assigned', count: 6 }, { _id: 'in_progress', count: 4 }, { _id: 'resolved', count: 18 }],
    expensesByCategory: [{ _id: 'electricity', total: 42000 }, { _id: 'internet', total: 8500 }, { _id: 'food', total: 64000 }]
  });
  const stats = data.stats || adminFallback.stats;
  const rentRows = (data.recentRents || []).map((rent) => ({
    id: rent._id || rent.month,
    tenant: rent.tenant?.name || 'Tenant',
    room: rent.tenant?.profile?.roomNumber || 'Not assigned',
    amount: formatCurrency(rent.amount || 0),
    status: rent.status,
    variant: adminStatusVariant(rent.status)
  }));
  const occupancyChart = [
    { name: 'Occupied', value: stats.occupiedBeds || 0 },
    { name: 'Vacant', value: stats.vacantBeds || 0 },
    { name: 'Complaints', value: stats.openComplaints || 0 }
  ];
  const expenseChart = (data.expensesByCategory || []).map((item) => ({ name: item._id?.replaceAll('_', ' ') || 'Expense', value: item.total || 0 }));

  return (
    <>
      <PageHeader eyebrow="Admin Portal" title="Single Property Command Center" description="Manage tenants, rooms, rent collection, expenses, complaints, visitors, staff and notices for Om Sai Residency." actionLabel="Add Tenant" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Tenants" value={stats.totalTenants} icon={Users} delta="Single property" />
        <StatCard label="Occupied Beds" value={stats.occupiedBeds} icon={BedDouble} tone="success" delta={`${stats.vacantBeds} vacant`} />
        <StatCard label="Monthly Revenue" value={formatCurrency(stats.monthlyRevenue || 0)} icon={ReceiptIndianRupee} tone="success" />
        <StatCard label="Pending Rent" value={formatCurrency(stats.pendingRent || 0)} icon={WalletCards} tone="warning" delta={`${formatCurrency(stats.overdueRent || 0)} overdue`} />
        <StatCard label="Open Complaints" value={stats.openComplaints} icon={ClipboardList} tone="warning" />
        <StatCard label="Total Visitors" value={stats.totalVisitors} icon={UserRoundCheck} />
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <ChartCard title="Expense Breakdown" description="Category wise operating cost" data={expenseChart} />
        <ChartCard title="Occupancy Overview" description="Occupied, vacant and operational workload" data={occupancyChart} type="bar" />
      </div>
      <DataTable columns={[{ key: 'tenant', label: 'Tenant' }, { key: 'room', label: 'Room' }, { key: 'amount', label: 'Rent' }, { key: 'status', label: 'Status', badge: true }]} rows={rentRows} />
    </>
  );
}
