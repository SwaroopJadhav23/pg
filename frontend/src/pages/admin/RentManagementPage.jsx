import { useState } from 'react';
import { ReceiptIndianRupee, Send, WalletCards } from 'lucide-react';
import { DataTable } from '../../components/shared/DataTable';
import { StatCard } from '../../components/shared/StatCard';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { emitToast } from '../../components/ui/toast';
import { useResource } from '../../hooks/useResource';
import { formatCurrency } from '../../lib/utils';
import { adminService } from '../../services/adminService';
import { AdminFormCard, AdminFormField, AdminModuleHeader, AdminPageLayout, AdminPageShell, AdminTableSection, adminStatusVariant, formatDate } from './adminUi';

const initialForm = { tenantId: '', month: '', amount: '', dueDate: '', lateFees: 0 };

export function RentManagementPage() {
  const { data, setData } = useResource(adminService.rents, { rents: [] });
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState('');
  const rents = data.rents || [];
  const totalCollection = rents.filter((rent) => rent.status === 'paid').reduce((sum, rent) => sum + (rent.amount || 0), 0);
  const pendingCollection = rents.filter((rent) => ['pending', 'generated'].includes(rent.status)).reduce((sum, rent) => sum + (rent.amount || 0), 0);
  const overdue = rents.filter((rent) => rent.status === 'overdue').reduce((sum, rent) => sum + (rent.amount || 0), 0);

  async function submit(event) {
    event.preventDefault();
    try {
      const payload = await adminService.generateRent({
        ...form,
        amount: Number(form.amount) || 0,
        lateFees: Number(form.lateFees) || 0
      });
      setData((current) => ({ rents: [payload.rent, ...(current.rents || [])] }));
      setForm(initialForm);
      setMessage('Rent generated.');
      emitToast({ title: 'Rent generated', description: payload.rent?.month || 'Rent record created.' });
    } catch (error) {
      setMessage(error.response?.data?.message || 'Could not generate rent.');
      emitToast({ title: 'Generate failed', description: error.response?.data?.message || 'Could not generate rent.', variant: 'destructive' });
    }
  }

  async function markPaid(rent) {
    try {
      const payload = await adminService.markRentPaid(rent._id, { method: 'cash' });
      setData((current) => ({
        rents: (current.rents || []).map((item) => (item._id === rent._id ? payload.rent : item))
      }));
      emitToast({ title: 'Rent marked paid', description: rent.tenant?.name || rent.month });
    } catch (error) {
      emitToast({ title: 'Update failed', description: error.response?.data?.message || 'Could not mark rent as paid.', variant: 'destructive' });
    }
  }

  async function sendReminder(rent) {
    try {
      await adminService.sendRentReminder(rent._id);
      emitToast({ title: 'Reminder sent', description: rent.tenant?.name || rent.month });
    } catch (error) {
      emitToast({ title: 'Reminder failed', description: error.response?.data?.message || 'Could not send reminder.', variant: 'destructive' });
    }
  }

  const rows = rents.map((rent) => ({
    id: rent._id,
    tenant: rent.tenant?.name || 'Tenant',
    room: rent.tenant?.profile?.roomNumber || '-',
    month: rent.month,
    amount: formatCurrency(rent.amount || 0),
    dueDate: formatDate(rent.dueDate),
    status: rent.status,
    variant: adminStatusVariant(rent.status),
    actions: rent.status !== 'paid' ? (
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm" onClick={() => markPaid(rent)}>Mark Paid</Button>
        <Button type="button" variant="outline" size="sm" onClick={() => sendReminder(rent)}>Remind</Button>
      </div>
    ) : null
  }));

  return (
    <AdminPageShell>
      <AdminModuleHeader
        title="Rent Management"
        description="Generate rent, mark paid, generate receipts and send reminders."
        actionLabel="Generate Rent"
        onAction={() => document.getElementById('admin-rent-form')?.scrollIntoView({ behavior: 'smooth' })}
      />
      <div className="admin-page-grid grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        <StatCard label="Total Collection" value={formatCurrency(totalCollection)} icon={ReceiptIndianRupee} tone="success" />
        <StatCard label="Pending Collection" value={formatCurrency(pendingCollection)} icon={WalletCards} tone="warning" />
        <StatCard label="Overdue Rent" value={formatCurrency(overdue)} icon={Send} tone="danger" />
      </div>
      <AdminPageLayout className="mt-4 sm:mt-6">
        <AdminFormCard id="admin-rent-form" title="Generate Rent">
          <form onSubmit={submit}>
            <AdminFormField>
              <Input className="h-11" placeholder="Tenant ID" value={form.tenantId} onChange={(e) => setForm({ ...form, tenantId: e.target.value })} required />
              <Input className="h-11" placeholder="Month e.g. July 2026" value={form.month} onChange={(e) => setForm({ ...form, month: e.target.value })} required />
              <Input className="h-11" type="number" placeholder="Amount" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
              <Input className="h-11 w-full" type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
              {message ? <p className="break-words rounded-xl bg-primary/10 p-3 text-sm text-primary">{message}</p> : null}
              <Button type="submit" className="h-11 w-full">Generate Rent</Button>
            </AdminFormField>
          </form>
        </AdminFormCard>
        <AdminTableSection title="Rent Records">
          <DataTable
            embedded
            columns={[
              { key: 'tenant', label: 'Tenant', mobilePrimary: true },
              { key: 'room', label: 'Room' },
              { key: 'month', label: 'Month' },
              { key: 'amount', label: 'Amount' },
              { key: 'dueDate', label: 'Due Date' },
              { key: 'status', label: 'Status', badge: true },
              { key: 'actions', label: 'Actions' }
            ]}
            rows={rows}
          />
        </AdminTableSection>
      </AdminPageLayout>
    </AdminPageShell>
  );
}
