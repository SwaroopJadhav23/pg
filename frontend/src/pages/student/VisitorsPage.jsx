import { useState } from 'react';
import { UserRoundCheck } from 'lucide-react';
import { DataTable } from '../../components/shared/DataTable';
import { PageHeader } from '../../components/shared/PageHeader';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { useStudentResource } from '../../hooks/useStudentResource';
import { studentService } from '../../services/studentService';
import { formatDate, statusVariant } from './studentUi';

const initialForm = { name: '', mobile: '', relation: '', visitDate: '', expectedTime: '', purpose: '' };

export function VisitorsPage() {
  const { data, setData } = useStudentResource(studentService.visitors, { visitors: [] });
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState('');

  async function submitVisitor(event) {
    event.preventDefault();
    setMessage('');
    try {
      const payload = await studentService.createVisitor(form);
      setData((current) => ({ visitors: [payload.visitor, ...(current.visitors || [])] }));
      setForm(initialForm);
      setMessage('Visitor request submitted for approval.');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Could not submit visitor request.');
    }
  }

  const rows = (data.visitors || []).map((visitor) => ({
    id: visitor._id || visitor.mobile,
    name: visitor.name,
    mobile: visitor.mobile,
    relation: visitor.relation,
    visitDate: formatDate(visitor.visitDate || visitor.expectedAt),
    expectedTime: visitor.expectedTime || 'Not set',
    status: visitor.status,
    variant: statusVariant(visitor.status)
  }));

  return (
    <>
      <PageHeader eyebrow="Visitor Management" title="Visitors" description="Request visitor entries and track check-in, check-out and approval history." />
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <CardHeader><CardTitle>Visitor Entry Request</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={submitVisitor} className="space-y-4">
              <Input placeholder="Visitor Name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
              <Input placeholder="Mobile Number" value={form.mobile} onChange={(event) => setForm({ ...form, mobile: event.target.value })} />
              <Input placeholder="Relation" value={form.relation} onChange={(event) => setForm({ ...form, relation: event.target.value })} />
              <div className="grid gap-3 sm:grid-cols-2">
                <Input type="date" value={form.visitDate} onChange={(event) => setForm({ ...form, visitDate: event.target.value })} />
                <Input type="time" value={form.expectedTime} onChange={(event) => setForm({ ...form, expectedTime: event.target.value })} />
              </div>
              <Textarea placeholder="Purpose of visit" value={form.purpose} onChange={(event) => setForm({ ...form, purpose: event.target.value })} />
              {message ? <p className="rounded-xl bg-primary/10 p-3 text-sm text-primary">{message}</p> : null}
              <Button className="w-full"><UserRoundCheck className="h-4 w-4" /> Request Visitor Pass</Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Visitor History</CardTitle></CardHeader>
          <CardContent>
            <DataTable columns={[{ key: 'name', label: 'Visitor' }, { key: 'mobile', label: 'Mobile' }, { key: 'relation', label: 'Relation' }, { key: 'visitDate', label: 'Visit Date' }, { key: 'expectedTime', label: 'Time' }, { key: 'status', label: 'Status', badge: true }]} rows={rows} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
