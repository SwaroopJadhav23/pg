import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { emitToast } from '../../components/ui/toast';
import { useResource } from '../../hooks/useResource';
import { adminService } from '../../services/adminService';
import { AdminModuleHeader, AdminPageShell, AdminStatus, MiniTimeline } from './adminUi';

export function ComplaintManagementPage() {
  const { data, setData } = useResource(adminService.complaints, { complaints: [] });
  const [message, setMessage] = useState('');

  async function update(complaint, status) {
    try {
      const payload = await adminService.updateComplaint(complaint._id, { status, assignedTo: complaint.assignedTo || 'Staff', note: `Marked ${status}` });
      setData((current) => ({ complaints: (current.complaints || []).map((item) => item._id === complaint._id ? payload.complaint : item) }));
      emitToast({ title: 'Complaint updated', description: status.replaceAll('_', ' ') });
    } catch (error) {
      setMessage(error.response?.data?.message || 'Could not update complaint status.');
      emitToast({ title: 'Update failed', description: error.response?.data?.message || 'Could not update complaint.', variant: 'destructive' });
    }
  }

  return (
    <AdminPageShell>
      <AdminModuleHeader title="Complaint Management" description="Monitor open, assigned, in-progress and resolved complaints with assignment and timeline tracking." />
      {message ? <p className="break-words rounded-xl bg-primary/10 p-3 text-sm text-primary">{message}</p> : null}
      <div className="admin-page-grid grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-2">
        {(data.complaints || []).map((complaint) => (
          <Card key={complaint._id} className="min-w-0 max-w-full overflow-hidden">
            <CardHeader className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div className="min-w-0 flex-1">
                <CardTitle className="break-words capitalize">{complaint.category}</CardTitle>
                <p className="mt-1 break-words text-sm text-muted-foreground">{complaint.tenant?.name} • Room {complaint.tenant?.profile?.roomNumber || '-'}</p>
              </div>
              <AdminStatus status={complaint.status} />
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="break-words text-sm text-muted-foreground">{complaint.description}</p>
              <Input className="h-11" value={complaint.assignedTo || 'Staff'} readOnly />
              <div className="mobile-action-stack flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                {['assigned', 'in_progress', 'resolved'].map((status) => (
                  <Button key={status} type="button" variant="outline" size="sm" className="h-10 w-full sm:w-auto" onClick={() => update(complaint, status)}>{status.replaceAll('_', ' ')}</Button>
                ))}
              </div>
              <MiniTimeline items={complaint.timeline} />
            </CardContent>
          </Card>
        ))}
      </div>
    </AdminPageShell>
  );
}
