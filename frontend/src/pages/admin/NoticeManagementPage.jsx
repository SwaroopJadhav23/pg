import { useState } from 'react';
import { DataTable } from '../../components/shared/DataTable';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { emitToast } from '../../components/ui/toast';
import { useResource } from '../../hooks/useResource';
import { adminService } from '../../services/adminService';
import { AdminModuleHeader, formatDate } from './adminUi';

const initialForm = { title: '', body: '', audience: 'all_tenants', floor: '', roomNumber: '', scheduledAt: '' };

export function NoticeManagementPage() {
  const { data, setData } = useResource(adminService.notices, { notices: [] });
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState('');

  async function submit(event) {
    event.preventDefault();
    try {
      const payload = await adminService.createNotice(form);
      setData((current) => ({ notices: [payload.notice, ...(current.notices || [])] }));
      setForm(initialForm);
      setMessage('Notice created.');
      emitToast({ title: 'Notice sent', description: form.title });
    } catch (error) {
      setMessage(error.response?.data?.message || 'Could not send notice.');
      emitToast({ title: 'Send failed', description: error.response?.data?.message || 'Could not send notice.', variant: 'destructive' });
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
      <AdminModuleHeader
        title="Notice Management"
        description="Create, schedule and send notices to all tenants, specific floors or specific rooms."
        actionLabel="Create Notice"
        onAction={() => document.getElementById('admin-notice-form')?.scrollIntoView({ behavior: 'smooth' })}
      />
      <div className="grid gap-6 xl:grid-cols-[0.75fr_1.25fr]">
        <Card id="admin-notice-form">
          <CardHeader><CardTitle>Create Notice</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              <Textarea placeholder="Notice content" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} required />
              <select className="h-11 w-full rounded-xl border bg-background px-4 text-sm" value={form.audience} onChange={(e) => setForm({ ...form, audience: e.target.value })}>
                {['all_tenants', 'floor', 'room'].map((audience) => <option key={audience} value={audience}>{audience.replaceAll('_', ' ')}</option>)}
              </select>
              <div className="grid gap-3 sm:grid-cols-2">
                <Input placeholder="Floor" value={form.floor} onChange={(e) => setForm({ ...form, floor: e.target.value })} />
                <Input placeholder="Room" value={form.roomNumber} onChange={(e) => setForm({ ...form, roomNumber: e.target.value })} />
              </div>
              <Input type="datetime-local" value={form.scheduledAt} onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })} />
              {message ? <p className="rounded-xl bg-primary/10 p-3 text-sm text-primary">{message}</p> : null}
              <Button type="submit" className="w-full">Create Notice</Button>
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
