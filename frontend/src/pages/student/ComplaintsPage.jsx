import { useState } from 'react';
import { ClipboardList, Plus } from 'lucide-react';
import { PageHeader } from '../../components/shared/PageHeader';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { useStudentResource } from '../../hooks/useStudentResource';
import { studentService } from '../../services/studentService';
import { formatDate, statusVariant, Timeline } from './studentUi';

const initialForm = { category: 'maintenance', priority: 'medium', description: '', photoUrl: '' };

export function ComplaintsPage() {
  const { data, setData } = useStudentResource(studentService.complaints, { complaints: [] });
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState('');

  async function submitComplaint(event) {
    event.preventDefault();
    setMessage('');
    try {
      const payload = await studentService.createComplaint(form);
      setData((current) => ({ complaints: [payload.complaint, ...(current.complaints || [])] }));
      setForm(initialForm);
      setMessage('Complaint raised successfully.');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to submit complaint.');
    }
  }

  return (
    <>
      <PageHeader eyebrow="Complaint Module" title="Complaints" description="Raise new complaints, track status and view timeline updates visually." />
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Plus className="h-5 w-5" /> Raise New Complaint</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={submitComplaint} className="space-y-4">
              <select className="h-11 w-full rounded-xl border bg-background px-4 text-sm" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>
                {['electricity', 'plumbing', 'cleaning', 'internet', 'food', 'security', 'maintenance', 'other'].map((category) => <option key={category} value={category}>{category}</option>)}
              </select>
              <select className="h-11 w-full rounded-xl border bg-background px-4 text-sm" value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value })}>
                {['low', 'medium', 'high', 'urgent'].map((priority) => <option key={priority} value={priority}>{priority}</option>)}
              </select>
              <Textarea placeholder="Describe the issue clearly (min 10 characters)" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} required minLength={10} />
              <Input placeholder="Photo URL (optional)" value={form.photoUrl} onChange={(event) => setForm({ ...form, photoUrl: event.target.value })} />
              {message ? <p className="rounded-xl bg-primary/10 p-3 text-sm text-primary">{message}</p> : null}
              <Button type="submit" className="w-full"><ClipboardList className="h-4 w-4" /> Submit Complaint</Button>
            </form>
          </CardContent>
        </Card>
        <div className="space-y-4">
          {(data.complaints || []).map((complaint) => (
            <Card key={complaint._id || complaint.description}>
              <CardHeader className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <CardTitle className="capitalize">{complaint.category}</CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">{complaint.description}</p>
                </div>
                <div className="flex gap-2">
                  <Badge variant={statusVariant(complaint.priority)}>{complaint.priority}</Badge>
                  <Badge variant={statusVariant(complaint.status)}>{complaint.status?.replaceAll('_', ' ')}</Badge>
                </div>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-[0.7fr_1fr]">
                <div className="rounded-2xl bg-slate-50 p-4 text-sm dark:bg-slate-900">
                  <p><span className="font-semibold">Assigned to:</span> {complaint.assignedTo || 'Not assigned yet'}</p>
                  <p className="mt-2"><span className="font-semibold">Created:</span> {formatDate(complaint.createdAt)}</p>
                </div>
                <Timeline items={complaint.timeline || []} />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
