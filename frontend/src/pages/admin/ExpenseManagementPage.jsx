import { useState } from 'react';
import { DataTable } from '../../components/shared/DataTable';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { useResource } from '../../hooks/useResource';
import { formatCurrency } from '../../lib/utils';
import { adminService } from '../../services/adminService';
import { adminFallback } from './adminPortalData';
import { AdminModuleHeader, adminStatusVariant, formatDate } from './adminUi';

const initialForm = { category: 'electricity', title: '', amount: '', expenseDate: '', billUrl: '', notes: '' };

export function ExpenseManagementPage() {
  const { data, setData } = useResource(adminService.expenses, { expenses: adminFallback.expenses });
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState('');

  async function submit(event) {
    event.preventDefault();
    try {
      const payload = await adminService.createExpense(form);
      setData((current) => ({ expenses: [payload.expense, ...(current.expenses || [])] }));
      setForm(initialForm);
      setMessage('Expense added for approval.');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Expense form ready. Connect backend to persist.');
    }
  }

  const rows = (data.expenses || []).map((expense) => ({
    id: expense._id,
    title: expense.title,
    category: expense.category?.replaceAll('_', ' '),
    amount: formatCurrency(expense.amount || 0),
    date: formatDate(expense.expenseDate),
    status: expense.status,
    variant: adminStatusVariant(expense.status)
  }));

  return (
    <>
      <AdminModuleHeader title="Expense Management" description="Add expenses, upload bills, approve expenses and generate expense reports." />
      <div className="grid gap-6 xl:grid-cols-[0.75fr_1.25fr]">
        <Card>
          <CardHeader><CardTitle>Add Expense</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <select className="h-11 w-full rounded-xl border bg-background px-4 text-sm" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {['electricity', 'water', 'internet', 'maintenance', 'staff_salary', 'food', 'miscellaneous'].map((item) => <option key={item} value={item}>{item.replaceAll('_', ' ')}</option>)}
              </select>
              <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <Input type="number" placeholder="Amount" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
              <Input type="date" value={form.expenseDate} onChange={(e) => setForm({ ...form, expenseDate: e.target.value })} />
              <Input placeholder="Bill URL" value={form.billUrl} onChange={(e) => setForm({ ...form, billUrl: e.target.value })} />
              <Textarea placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              {message ? <p className="rounded-xl bg-primary/10 p-3 text-sm text-primary">{message}</p> : null}
              <Button className="w-full">Add Expense</Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Expense Reports</CardTitle></CardHeader>
          <CardContent><DataTable columns={[{ key: 'title', label: 'Expense' }, { key: 'category', label: 'Category' }, { key: 'amount', label: 'Amount' }, { key: 'date', label: 'Date' }, { key: 'status', label: 'Status', badge: true }]} rows={rows} /></CardContent>
        </Card>
      </div>
    </>
  );
}
