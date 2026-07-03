import { useState } from 'react';
import { DataTable } from '../../components/shared/DataTable';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { useResource } from '../../hooks/useResource';
import { adminService } from '../../services/adminService';
import { adminFallback } from './adminPortalData';
import { AdminModuleHeader, formatDate } from './adminUi';

const initialForm = { title: '', body: '', audience: 'all_tenants', floor: '', roomNumber: '', scheduledAt: '' };

export function NoticeManagementPage() {
  const { data, setData } = useResource(adminService.notices, { notices: adminFallback.notices });
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState('');

  async function submit(event) {
    event.preventDefault();
    try {
      const payload = await adminService.createNotice(form);
      setData((current) => ({ notices: [payload.notice, ...(current.notices || [])] }));
      setForm(initialForm);
      setMessage('Notice created.');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Notice form ready. Connect backend to persist.');
    }
  }

  const rows = (data.notices || []).map((notice) => ({
    id: notice._id,
    title: notice.title,
    audience: notice.audience?.replaceAll('_', ' '),
    schedule: notice.scheduledAt ? formatDate(notice.scheduledAt) : 'Immediate',
    created: formatDate(notice.createdAt)
  }));

  return (
    <>
      <AdminModuleHeader title="Notice Management" description="Create, schedule and send notices to all tenants, specific floors or specific rooms." />
      <div className="grid gap-6 xl:grid-cols-[0.75fr_1.25fr]">
        <Card>
          <CardHeader><CardTitle>Create Notice</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <Textarea placeholder="Notice content" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
              <select className="h-11 w-full rounded-xl border bg-background px-4 text-sm" value={form.audience} onChange={(e) => setForm({ ...form, audience: e.target.value })}>
                {['all_tenants', 'floor', 'room'].map((audience) => <option key={audience} value={audience}>{audience.replaceAll('_', ' ')}</option>)}
              </select>
              <div className="grid gap-3 sm:grid-cols-2">
                <Input placeholder="Floor" value={form.floor} onChange={(e) => setForm({ ...form, floor: e.target.value })} />
                <Input placeholder="Room" value={form.roomNumber} onChange={(e) => setForm({ ...form, roomNumber: e.target.value })} />
              </div>
              <Input type="datetime-local" value={form.scheduledAt} onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })} />
              {message ? <p className="rounded-xl bg-primary/10 p-3 text-sm text-primary">{message}</p> : null}
              <Button className="w-full">Create Notice</Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Notice History</CardTitle></CardHeader>
          <CardContent><DataTable columns={[{ key: 'title', label: 'Title' }, { key: 'audience', label: 'Audience' }, { key: 'schedule', label: 'Schedule' }, { key: 'created', label: 'Created' }]} rows={rows} /></CardContent>
        </Card>
      </div>
    </>
  );
}
