import { Bell, CalendarDays, ClipboardList, CreditCard, FileText, Home, Users } from 'lucide-react';
import { ChartCard } from '../../components/shared/ChartCard';
import { DataTable } from '../../components/shared/DataTable';
import { PageHeader } from '../../components/shared/PageHeader';
import { StatCard } from '../../components/shared/StatCard';
import { Badge } from '../../components/ui/badge';
import { useStudentResource } from '../../hooks/useStudentResource';
import { formatCurrency } from '../../lib/utils';
import { studentService } from '../../services/studentService';
import { rentFallback, studentFallback } from './studentPortalData';
import { formatDate, statusVariant } from './studentUi';

export function StudentDashboard() {
  const { data } = useStudentResource(studentService.dashboard, {
    ...studentFallback,
    currentRent: rentFallback.currentRent,
    rentHistory: rentFallback.history,
    activeComplaints: []
  });

  const profile = data.student?.profile || {};
  const chartData = (data.rentHistory || rentFallback.history).slice().reverse().map((rent) => ({
    name: rent.month?.split(' ')[0] || 'Rent',
    value: rent.amount || 0
  }));
  const rows = (data.rentHistory || rentFallback.history).slice(0, 4).map((rent) => ({
    id: rent._id || rent.month,
    month: rent.month,
    amount: formatCurrency(rent.amount || 0),
    dueDate: formatDate(rent.dueDate),
    status: rent.status,
    variant: statusVariant(rent.status)
  }));

  return (
    <>
      <PageHeader
        eyebrow="Student Portal"
        title={`Welcome back, ${data.student?.name || 'Student'}`}
        description={`Room ${profile.roomNumber || data.room?.roomNumber}, Bed ${profile.bedNumber || data.room?.bedNumber} at ${data.property?.name || 'your PG'}. Joining date: ${formatDate(profile.joiningDate)}.`}
        actionLabel="Raise Complaint"
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Current Rent Status" value={data.stats?.currentRentStatus?.replaceAll('_', ' ') || 'Pending'} icon={CreditCard} tone={statusVariant(data.stats?.currentRentStatus)} delta={data.currentRent?.month || 'Current month'} />
        <StatCard label="Pending Amount" value={formatCurrency(data.stats?.pendingAmount || 0)} icon={CalendarDays} tone={data.stats?.pendingAmount ? 'warning' : 'success'} delta={`Next due ${formatDate(data.stats?.nextDueDate)}`} />
        <StatCard label="Active Complaints" value={data.stats?.activeComplaints || 0} icon={ClipboardList} tone="warning" delta="Track live timeline" />
        <StatCard label="Visitors This Month" value={data.stats?.visitorsThisMonth || 0} icon={Users} />
        <StatCard label="Notices Received" value={data.stats?.noticesReceived || 0} icon={Bell} />
        <StatCard label="Room & Bed" value={`${profile.roomNumber || data.room?.roomNumber} / ${profile.bedNumber || data.room?.bedNumber}`} icon={Home} />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <ChartCard title="Payment History" description="Last six months rent payment trend" data={chartData} />
        <DataTable columns={[{ key: 'month', label: 'Month' }, { key: 'amount', label: 'Amount' }, { key: 'dueDate', label: 'Due Date' }, { key: 'status', label: 'Status', badge: true }]} rows={rows} />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        {(data.notices || []).slice(0, 3).map((notice) => (
          <div key={notice._id || notice.title} className="rounded-3xl border bg-card p-5 shadow-soft">
            <div className="mb-4 flex items-center justify-between">
              <Badge><FileText className="mr-1 h-3 w-3" /> Notice</Badge>
              <span className="text-xs text-muted-foreground">{formatDate(notice.createdAt)}</span>
            </div>
            <h3 className="font-bold">{notice.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{notice.body}</p>
          </div>
        ))}
      </div>
    </>
  );
}
