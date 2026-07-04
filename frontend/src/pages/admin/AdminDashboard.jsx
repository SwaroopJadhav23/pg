import { BedDouble, ClipboardList, ReceiptIndianRupee, UserRoundCheck, Users, WalletCards } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ChartCard } from '../../components/shared/ChartCard';
import { DataTable } from '../../components/shared/DataTable';
import { PageHeader } from '../../components/shared/PageHeader';
import { StatCard } from '../../components/shared/StatCard';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../auth/AuthContext';
import { emptyAdminDashboard } from '../../config/emptyStates';
import { useResource } from '../../hooks/useResource';
import { formatCurrency } from '../../lib/utils';
import { adminService } from '../../services/adminService';
import { adminStatusVariant } from './adminUi';

export function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data } = useResource(adminService.dashboard, emptyAdminDashboard);
  const stats = data.stats || emptyAdminDashboard.stats;
  const rentRows = (data.recentRents || []).map((rent) => ({
    id: rent._id || rent.month,
    tenant: rent.tenant?.name || 'Tenant',
    room: rent.tenant?.profile?.roomNumber || 'Not assigned',
    amount: formatCurrency(rent.amount || 0),
    status: rent.status,
    variant: adminStatusVariant(rent.status),
    actions: rent.status !== 'paid' ? (
      <Button type="button" variant="outline" size="sm" onClick={() => navigate('/admin/rent-management')}>
        Collect
      </Button>
    ) : null
  }));
  const occupancyChart = [
    { name: 'Occupied', value: stats.occupiedBeds || 0 },
    { name: 'Vacant', value: stats.vacantBeds || 0 },
    { name: 'Complaints', value: stats.openComplaints || 0 }
  ];
  const expenseChart = (data.expensesByCategory || []).map((item) => ({ name: item._id?.replaceAll('_', ' ') || 'Expense', value: item.total || 0 }));

  return (
    <>
      <PageHeader
        eyebrow="Admin Portal"
        title="Single Property Command Center"
        description={`Manage tenants, rooms, rent collection, expenses, complaints, visitors, staff and notices${user?.name ? ` for ${user.name}` : ''}.`}
        actionLabel="Add Tenant"
        onAction={() => navigate('/admin/tenants')}
      />
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
      <DataTable
        columns={[
          { key: 'tenant', label: 'Tenant' },
          { key: 'room', label: 'Room' },
          { key: 'amount', label: 'Rent' },
          { key: 'status', label: 'Status', badge: true },
          { key: 'actions', label: 'Actions' }
        ]}
        rows={rentRows}
      />
    </>
  );
}
