import { useState } from 'react';
import { LifeBuoy, MessageCircle } from 'lucide-react';
import { PageHeader } from '../../components/shared/PageHeader';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { useStudentResource } from '../../hooks/useStudentResource';
import { studentService } from '../../services/studentService';
import { formatDate, statusVariant } from './studentUi';

const initialForm = { subject: '', category: 'general', message: '', channel: 'portal' };

export function SupportPage() {
  const { data, setData } = useStudentResource(studentService.support, { tickets: [] });
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState('');

  async function submitTicket(event) {
    event.preventDefault();
    setMessage('');
    try {
      const payload = await studentService.createSupportTicket(form);
      setData((current) => ({ tickets: [payload.ticket, ...(current.tickets || [])] }));
      setForm(initialForm);
      setMessage('Support ticket created.');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Could not submit support ticket.');
    }
  }

  return (
    <>
      <PageHeader eyebrow="Support Center" title="Support" description="Raise support tickets, chat with caretaker and use WhatsApp support for quick help." />
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><LifeBuoy className="h-5 w-5" /> Raise Support Ticket</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={submitTicket} className="space-y-4">
              <Input placeholder="Subject" value={form.subject} onChange={(event) => setForm({ ...form, subject: event.target.value })} />
              <select className="h-11 w-full rounded-xl border bg-background px-4 text-sm" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>
                {['billing', 'room', 'complaint', 'document', 'visitor', 'general'].map((category) => <option key={category} value={category}>{category}</option>)}
              </select>
              <Textarea placeholder="How can the caretaker help?" value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} />
              {message ? <p className="rounded-xl bg-primary/10 p-3 text-sm text-primary">{message}</p> : null}
              <Button className="w-full"><MessageCircle className="h-4 w-4" /> Submit Ticket</Button>
            </form>
            <Button variant="outline" className="mt-4 w-full">WhatsApp Support</Button>
          </CardContent>
        </Card>
        <div className="space-y-4">
          {(data.tickets || []).map((ticket) => (
            <Card key={ticket._id || ticket.subject}>
              <CardContent className="p-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h3 className="text-lg font-bold">{ticket.subject}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{ticket.message}</p>
                  </div>
                  <Badge variant={statusVariant(ticket.status)}>{ticket.status}</Badge>
                </div>
                <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <Badge variant="slate">{ticket.category}</Badge>
                  <Badge variant="slate">{ticket.channel}</Badge>
                  <span className="py-1">{formatDate(ticket.createdAt)}</span>
                </div>
                {(ticket.replies || []).map((reply, index) => (
                  <div key={`${reply.senderRole}-${index}`} className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm dark:bg-slate-900">
                    <span className="font-bold capitalize">{reply.senderRole}:</span> {reply.message}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
