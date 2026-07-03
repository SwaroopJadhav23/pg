import { DataTable } from '../../components/shared/DataTable';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { useResource } from '../../hooks/useResource';
import { adminService } from '../../services/adminService';
import { adminFallback } from './adminPortalData';
import { AdminModuleHeader, adminStatusVariant, formatDate } from './adminUi';

export function VisitorManagementPage() {
  const { data, setData } = useResource(adminService.visitors, { visitors: adminFallback.visitors });

  async function action(visitor, type) {
    const payload = type === 'in' ? await adminService.checkInVisitor(visitor._id) : await adminService.checkOutVisitor(visitor._id);
    setData((current) => ({ visitors: (current.visitors || []).map((item) => item._id === visitor._id ? payload.visitor : item) }));
  }

  const rows = (data.visitors || []).map((visitor) => ({
    id: visitor._id,
    visitor: visitor.name,
    mobile: visitor.mobile,
    tenant: visitor.tenant?.name || '-',
    relation: visitor.relation,
    checkIn: visitor.checkIn ? formatDate(visitor.checkIn) : 'Not checked in',
    status: visitor.status,
    variant: adminStatusVariant(visitor.status)
  }));

  return (
    <>
      <AdminModuleHeader title="Visitor Management" description="Record visitor entries, check-in/check-out visitors and generate visitor passes." actionLabel="Generate Pass" />
      <Card>
        <CardHeader><CardTitle>Visitor Entry Register</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <DataTable columns={[{ key: 'visitor', label: 'Visitor' }, { key: 'mobile', label: 'Mobile' }, { key: 'tenant', label: 'Tenant' }, { key: 'relation', label: 'Relation' }, { key: 'checkIn', label: 'Check-In' }, { key: 'status', label: 'Status', badge: true }]} rows={rows} />
          <div className="grid gap-3 md:grid-cols-2">
            {(data.visitors || []).slice(0, 2).map((visitor) => (
              <div key={visitor._id} className="rounded-2xl border p-4">
                <p className="font-bold">{visitor.name}</p>
                <p className="text-sm text-muted-foreground">Visiting {visitor.tenant?.name}</p>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => action(visitor, 'in')}>Check-In</Button>
                  <Button size="sm" variant="outline" onClick={() => action(visitor, 'out')}>Check-Out</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
