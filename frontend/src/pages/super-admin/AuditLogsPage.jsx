import { DataTable } from '../../components/shared/DataTable';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { useResource } from '../../hooks/useResource';
import { superAdminService } from '../../services/superAdminService';
import { formatDate, SuperHeader } from './superAdminUi';

export function AuditLogsPage() {
  const { data } = useResource(superAdminService.auditLogs, { logs: [] });
  const rows = (data.logs || []).map((log) => ({
    id: log._id,
    actor: log.actor?.name || 'System',
    role: log.actor?.role || '-',
    action: log.action,
    entity: log.entity,
    created: formatDate(log.createdAt)
  }));

  return (
    <>
      <SuperHeader title="Audit Logs" description="Track login history, manager actions, tenant activities, rent updates and property modifications." />
      <Card>
        <CardHeader><CardTitle>Enterprise Activity Log</CardTitle></CardHeader>
        <CardContent><DataTable columns={[{ key: 'actor', label: 'Actor' }, { key: 'role', label: 'Role' }, { key: 'action', label: 'Action' }, { key: 'entity', label: 'Entity' }, { key: 'created', label: 'Time' }]} rows={rows} /></CardContent>
      </Card>
    </>
  );
}
