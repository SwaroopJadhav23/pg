import { CircleDollarSign, TrendingUp, WalletCards } from 'lucide-react';
import { ChartCard } from '../../components/shared/ChartCard';
import { StatCard } from '../../components/shared/StatCard';
import { useResource } from '../../hooks/useResource';
import { formatCurrency } from '../../lib/utils';
import { superAdminService } from '../../services/superAdminService';
import { superFallback } from './superAdminData';
import { SuperHeader } from './superAdminUi';

export function RevenueCenterPage() {
  const { data } = useResource(superAdminService.revenueCenter, {
    metrics: { totalRevenue: superFallback.stats.monthlyRevenue, collectionRate: 91, outstandingAmount: superFallback.stats.pendingRent, profitEstimate: 6120000 },
    propertyRevenue: superFallback.properties.map((property) => ({ _id: property.name, total: property.monthlyRevenue, paid: property.monthlyRevenue }))
  });
  const metrics = data.metrics;

  return (
    <>
      <SuperHeader title="Revenue Center" description="Financial overview, collection rate, outstanding amount, profit estimate and property-wise revenue comparison." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Revenue" value={formatCurrency(metrics.totalRevenue || 0)} icon={CircleDollarSign} tone="success" />
        <StatCard label="Collection Rate" value={`${metrics.collectionRate || 0}%`} icon={TrendingUp} tone="success" />
        <StatCard label="Outstanding Amount" value={formatCurrency(metrics.outstandingAmount || 0)} icon={WalletCards} tone="warning" />
        <StatCard label="Profit Estimate" value={formatCurrency(metrics.profitEstimate || 0)} icon={CircleDollarSign} />
      </div>
      <ChartCard title="Property-wise Revenue Comparison" description="Paid and generated revenue across properties" data={(data.propertyRevenue || []).map((item, index) => ({ name: superFallback.properties[index]?.name || item._id || 'Property', value: item.paid || item.total || 0 }))} type="bar" />
    </>
  );
}
