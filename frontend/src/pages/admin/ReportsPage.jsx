import { Download } from 'lucide-react';
import { DataTable } from '../../components/shared/DataTable';
import { StatCard } from '../../components/shared/StatCard';
import { Button } from '../../components/ui/button';
import { emitToast } from '../../components/ui/toast';
import { useResource } from '../../hooks/useResource';
import { formatCurrency } from '../../lib/utils';
import { adminService } from '../../services/adminService';
import { AdminModuleHeader, AdminPageShell, AdminTableSection, adminStatusVariant } from './adminUi';

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

export function ReportsPage() {
  const { data } = useResource(adminService.reports, {
    occupancy: [],
    revenue: [],
    expenseReport: [],
    tenantReport: [],
    exports: []
  });

  const tenantRows = (data.tenantReport || []).map((tenant) => ({
    id: tenant._id,
    name: tenant.name,
    email: tenant.email,
    room: tenant.profile?.roomNumber || '-',
    status: tenant.status,
    variant: adminStatusVariant(tenant.status)
  }));

  function exportReport(format) {
    const rows = [
      ['Tenant', 'Email', 'Room', 'Status'],
      ...(data.tenantReport || []).map((tenant) => [
        tenant.name,
        tenant.email,
        tenant.profile?.roomNumber || '-',
        tenant.status
      ])
    ];
    if (format === 'excel') {
      downloadCsv('tenant-report.csv', rows);
      emitToast({ title: 'Export complete', description: 'Tenant report downloaded as CSV.' });
      return;
    }
    const text = rows.map((row) => row.join(' | ')).join('\n');
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'tenant-report.txt';
    link.click();
    URL.revokeObjectURL(url);
    emitToast({ title: 'Export complete', description: 'Tenant report downloaded.' });
  }

  return (
    <AdminPageShell>
      <AdminModuleHeader
        title="Reports"
        description="Generate occupancy, revenue, rent collection, expense and tenant reports with PDF/Excel export."
        actionLabel="Export Report"
        onAction={() => exportReport('excel')}
      />
      <div className="admin-page-grid grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {(data.occupancy || []).map((item) => <StatCard key={item._id} label={`${item._id} Beds`} value={item.count} />)}
        {(data.revenue || []).slice(0, 2).map((item) => <StatCard key={item._id} label={`${item._id} Rent`} value={formatCurrency(item.total || 0)} />)}
      </div>
      <AdminTableSection title="Tenant Report">
        <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <p className="text-sm text-muted-foreground">Download tenant report exports</p>
          <div className="grid w-full grid-cols-1 gap-2 sm:flex sm:w-auto">
            <Button type="button" variant="outline" className="h-10 w-full sm:w-auto" onClick={() => exportReport('pdf')}><Download className="h-4 w-4" /> PDF</Button>
            <Button type="button" variant="outline" className="h-10 w-full sm:w-auto" onClick={() => exportReport('excel')}><Download className="h-4 w-4" /> Excel</Button>
          </div>
        </div>
        <DataTable
          embedded
          columns={[
            { key: 'name', label: 'Tenant', mobilePrimary: true },
            { key: 'email', label: 'Email' },
            { key: 'room', label: 'Room' },
            { key: 'status', label: 'Status', badge: true }
          ]}
          rows={tenantRows}
        />
      </AdminTableSection>
    </AdminPageShell>
  );
}
