import { useState } from 'react';
import { DataTable } from '../../components/shared/DataTable';
import { StatCard } from '../../components/shared/StatCard';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { useResource } from '../../hooks/useResource';
import { formatCurrency } from '../../lib/utils';
import { adminService } from '../../services/adminService';
import { adminFallback } from './adminPortalData';
import { AdminModuleHeader, adminStatusVariant, formatDate } from './adminUi';
import { ReceiptIndianRupee, Send, WalletCards } from 'lucide-react';

const initialForm = { tenantId: '', month: '', amount: '', dueDate: '', lateFees: 0 };

export function RentManagementPage() {
  const { data, setData } = useResource(adminService.rents, { rents: adminFallback.rents });
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState('');
  const rents = data.rents || [];
  const totalCollection = rents.filter((rent) => rent.status === 'paid').reduce((sum, rent) => sum + (rent.amount || 0), 0);
  const pendingCollection = rents.filter((rent) => ['pending', 'generated'].includes(rent.status)).reduce((sum, rent) => sum + (rent.amount || 0), 0);
  const overdue = rents.filter((rent) => rent.status === 'overdue').reduce((sum, rent) => sum + (rent.amount || 0), 0);

  async function submit(event) {
    event.preventDefault();
    try {
      const payload = await adminService.generateRent(form);
      setData((current) => ({ rents: [payload.rent, ...(current.rents || [])] }));
      setMessage('Rent generated.');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Use a real tenant ID after backend seed/login.');
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
    variant: adminStatusVariant(rent.status)
  }));

  return (
    <>
      <AdminModuleHeader title="Rent Management" description="Generate rent, mark paid, generate receipts and send reminders." />
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Total Collection" value={formatCurrency(totalCollection)} icon={ReceiptIndianRupee} tone="success" />
        <StatCard label="Pending Collection" value={formatCurrency(pendingCollection)} icon={WalletCards} tone="warning" />
        <StatCard label="Overdue Rent" value={formatCurrency(overdue)} icon={Send} tone="danger" />
      </div>
      <div className="grid gap-6 xl:grid-cols-[0.75fr_1.25fr]">
        <Card>
          <CardHeader><CardTitle>Generate Rent</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <Input placeholder="Tenant ID" value={form.tenantId} onChange={(e) => setForm({ ...form, tenantId: e.target.value })} />
              <Input placeholder="Month e.g. July 2026" value={form.month} onChange={(e) => setForm({ ...form, month: e.target.value })} />
              <Input type="number" placeholder="Amount" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
              <Input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
              {message ? <p className="rounded-xl bg-primary/10 p-3 text-sm text-primary">{message}</p> : null}
              <Button className="w-full">Generate Rent</Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Rent Records</CardTitle></CardHeader>
          <CardContent><DataTable columns={[{ key: 'tenant', label: 'Tenant' }, { key: 'room', label: 'Room' }, { key: 'month', label: 'Month' }, { key: 'amount', label: 'Amount' }, { key: 'dueDate', label: 'Due Date' }, { key: 'status', label: 'Status', badge: true }]} rows={rows} /></CardContent>
        </Card>
      </div>
    </>
  );
}
