import { ChartCard } from '../../components/shared/ChartCard';
import { StatCard } from '../../components/shared/StatCard';
import { emitToast } from '../../components/ui/toast';
import { useResource } from '../../hooks/useResource';
import { emptyAnalytics } from '../../config/emptyStates';
import { superAdminService } from '../../services/superAdminService';
import { SuperHeader } from './superAdminUi';

function downloadCsv(filename, rows) {
  const csv = rows.map((row) => row.map((cell) => `"${String(cell ?? '').replaceAll('"', '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function AnalyticsPage() {
  const { data } = useResource(superAdminService.analytics, emptyAnalytics);

  function exportCsv() {
    const propertyRows = (data.propertyPerformance || []).map((property) => [
      property.name,
      property.city,
      property.occupancyRate || 0,
      property.monthlyRevenue || 0,
      property.status
    ]);
    const revenueRows = (data.revenueTrends || []).map((item) => [item._id, item.total]);
    const complaintRows = (data.complaints || []).map((item) => [item._id, item.count]);
    const rows = [
      ['Property', 'City', 'Occupancy %', 'Monthly Revenue', 'Status'],
      ...propertyRows,
      [],
      ['Revenue Month', 'Total'],
      ...revenueRows,
      [],
      ['Complaint Status', 'Count'],
      ...complaintRows
    ];
    downloadCsv('om-sai-analytics.csv', rows);
    emitToast({ title: 'Export complete', description: 'Analytics CSV downloaded.' });
  }

  return (
    <>
      <SuperHeader
        title="Analytics"
        description="Advanced reports for occupancy trends, revenue trends, property performance, tenant retention and complaint resolution."
        actionLabel="Export CSV"
        onAction={exportCsv}
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Properties Analyzed" value={(data.propertyPerformance || []).length} />
        <StatCard label="Staff Count" value={data.operational?.staffCount || 0} />
        <StatCard label="Visitor Volume" value={data.operational?.visitorCount || 0} />
        <StatCard label="AI Insights" value={(data.insights || []).length} />
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <ChartCard title="Revenue Trends" description="Monthly revenue trend" data={(data.revenueTrends || []).map((item) => ({ name: item._id, value: item.total }))} />
        <ChartCard title="Complaint Analytics" description="Complaint status distribution" data={(data.complaints || []).map((item) => ({ name: item._id, value: item.count }))} type="bar" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {(data.insights || []).map((insight) => <div key={insight} className="rounded-3xl border bg-card p-5 text-sm text-muted-foreground shadow-soft">{insight}</div>)}
      </div>
    </>
  );
}
