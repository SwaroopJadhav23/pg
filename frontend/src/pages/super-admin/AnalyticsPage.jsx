import { ChartCard } from '../../components/shared/ChartCard';
import { StatCard } from '../../components/shared/StatCard';
import { useResource } from '../../hooks/useResource';
import { superAdminService } from '../../services/superAdminService';
import { superFallback } from './superAdminData';
import { SuperHeader } from './superAdminUi';

export function AnalyticsPage() {
  const { data } = useResource(superAdminService.analytics, {
    propertyPerformance: superFallback.properties,
    complaints: [{ _id: 'assigned', count: 8 }, { _id: 'in_progress', count: 12 }, { _id: 'resolved', count: 40 }],
    revenueTrends: [{ _id: 'May 2026', total: 5900000 }, { _id: 'June 2026', total: 7840000 }],
    tenantRetention: [{ _id: 'active', count: 421 }, { _id: 'inactive', count: 18 }],
    operational: { staffCount: 24, visitorCount: 286 },
    insights: ['Revenue forecast is positive.', 'High occupancy properties need expansion planning.']
  });

  return (
    <>
      <SuperHeader title="Analytics" description="Advanced reports for occupancy trends, revenue trends, property performance, tenant retention and complaint resolution." actionLabel="Export CSV" />
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
