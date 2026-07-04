import { DataTable } from '../../components/shared/DataTable';
import { Button } from '../../components/ui/button';
import { emitToast } from '../../components/ui/toast';
import { useResource } from '../../hooks/useResource';
import { adminService } from '../../services/adminService';
import { AdminModuleHeader, AdminPageShell, AdminTableSection, adminStatusVariant, formatDate } from './adminUi';

export function VisitorManagementPage() {
  const { data, setData } = useResource(adminService.visitors, { visitors: [] });

  async function action(visitor, type) {
    try {
      const payload = type === 'in'
        ? await adminService.checkInVisitor(visitor._id)
        : await adminService.checkOutVisitor(visitor._id);
      setData((current) => ({
        visitors: (current.visitors || []).map((item) => (item._id === visitor._id ? payload.visitor : item))
      }));
      emitToast({
        title: type === 'in' ? 'Visitor checked in' : 'Visitor checked out',
        description: visitor.name
      });
    } catch (error) {
      emitToast({
        title: 'Action failed',
        description: error.response?.data?.message || 'Could not update visitor status.',
        variant: 'destructive'
      });
    }
  }

  function generatePass(visitor) {
    const passText = [
      'VISITOR PASS',
      `Name: ${visitor.name}`,
      `Mobile: ${visitor.mobile}`,
      `Visiting: ${visitor.tenant?.name || 'Tenant'}`,
      `Relation: ${visitor.relation || '-'}`,
      `Status: ${visitor.status}`
    ].join('\n');
    const blob = new Blob([passText], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `visitor-pass-${visitor.name || 'guest'}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    emitToast({ title: 'Visitor pass generated', description: visitor.name });
  }

  const rows = (data.visitors || []).map((visitor) => ({
    id: visitor._id,
    visitor: visitor.name,
    mobile: visitor.mobile,
    tenant: visitor.tenant?.name || '-',
    relation: visitor.relation,
    checkIn: visitor.checkIn ? formatDate(visitor.checkIn) : 'Not checked in',
    status: visitor.status,
    variant: adminStatusVariant(visitor.status),
    actions: (
      <div className="flex flex-wrap gap-2">
        <Button type="button" size="sm" variant="outline" onClick={() => action(visitor, 'in')}>Check-In</Button>
        <Button type="button" size="sm" variant="outline" onClick={() => action(visitor, 'out')}>Check-Out</Button>
        <Button type="button" size="sm" variant="outline" onClick={() => generatePass(visitor)}>Pass</Button>
      </div>
    )
  }));

  return (
    <AdminPageShell>
      <AdminModuleHeader
        title="Visitor Management"
        description="Record visitor entries, check-in/check-out visitors and generate visitor passes."
        actionLabel="Generate Pass"
        onAction={() => {
          const visitor = (data.visitors || [])[0];
          if (!visitor) {
            emitToast({ title: 'No visitors', description: 'Add a visitor request first.', variant: 'destructive' });
            return;
          }
          generatePass(visitor);
        }}
      />
      <AdminTableSection title="Visitor Entry Register">
        <DataTable
          embedded
          columns={[
            { key: 'visitor', label: 'Visitor', mobilePrimary: true },
            { key: 'mobile', label: 'Mobile' },
            { key: 'tenant', label: 'Tenant' },
            { key: 'relation', label: 'Relation' },
            { key: 'checkIn', label: 'Check-In' },
            { key: 'status', label: 'Status', badge: true },
            { key: 'actions', label: 'Actions' }
          ]}
          rows={rows}
        />
      </AdminTableSection>
    </AdminPageShell>
  );
}
