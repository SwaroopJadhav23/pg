import { useState } from 'react';
import { DataTable } from '../../components/shared/DataTable';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { useResource } from '../../hooks/useResource';
import { superAdminService } from '../../services/superAdminService';
import { superFallback } from './superAdminData';
import { formatDate, SuperHeader } from './superAdminUi';

const initialForm = { title: '', body: '', audience: 'all_tenants', propertyIds: [], scheduledAt: '' };

export function NoticeCenterPage() {
  const { data, setData } = useResource(superAdminService.notices, { notices: superFallback.notices });
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState('');

  async function submit(event) {
    event.preventDefault();
    try {
      const payload = await superAdminService.createNotice({ ...form, propertyIds: String(form.propertyIds || '').split(',').map((item) => item.trim()).filter(Boolean) });
      setData((current) => ({ notices: [...payload.notices, ...(current.notices || [])] }));
      setForm(initialForm);
      setMessage('Global notice created.');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Notice form ready. Connect backend to persist.');
    }
  }

  const rows = (data.notices || []).map((notice) => ({
    id: notice._id,
    title: notice.title,
    audience: notice.audience?.replaceAll('_', ' '),
    property: notice.property?.name || 'All Properties',
    created: formatDate(notice.createdAt)
  }));

  return (
    <>
      <SuperHeader title="Notice Center" description="Send notices to all properties, selected properties, managers and tenants with scheduling." />
      <div className="grid gap-6 xl:grid-cols-[0.75fr_1.25fr]">
        <Card>
          <CardHeader><CardTitle>Send Notice</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <Textarea placeholder="Message" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
              <select className="h-11 w-full rounded-xl border bg-background px-4 text-sm" value={form.audience} onChange={(e) => setForm({ ...form, audience: e.target.value })}>
                {['all_tenants', 'property', 'managers'].map((item) => <option key={item} value={item}>{item.replaceAll('_', ' ')}</option>)}
              </select>
              <Input placeholder="Selected property IDs comma separated" value={form.propertyIds} onChange={(e) => setForm({ ...form, propertyIds: e.target.value })} />
              <Input type="datetime-local" value={form.scheduledAt} onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })} />
              {message ? <p className="rounded-xl bg-primary/10 p-3 text-sm text-primary">{message}</p> : null}
              <Button className="w-full">Send Notice</Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Global Notices</CardTitle></CardHeader>
          <CardContent><DataTable columns={[{ key: 'title', label: 'Title' }, { key: 'audience', label: 'Audience' }, { key: 'property', label: 'Property' }, { key: 'created', label: 'Created' }]} rows={rows} /></CardContent>
        </Card>
      </div>
    </>
  );
}
