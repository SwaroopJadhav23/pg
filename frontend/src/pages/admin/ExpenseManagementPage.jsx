import { useState } from 'react';
import { DataTable } from '../../components/shared/DataTable';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { emitToast } from '../../components/ui/toast';
import { useResource } from '../../hooks/useResource';
import { formatCurrency } from '../../lib/utils';
import { adminService } from '../../services/adminService';
import { AdminFormCard, AdminFormField, AdminModuleHeader, AdminPageLayout, AdminPageShell, AdminTableSection, adminStatusVariant, formatDate } from './adminUi';

const initialForm = { category: 'electricity', title: '', amount: '', expenseDate: '', billUrl: '', notes: '' };

export function ExpenseManagementPage() {
  const { data, setData } = useResource(adminService.expenses, { expenses: [] });
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState('');

  async function submit(event) {
    event.preventDefault();
    try {
      const payload = await adminService.createExpense({
        ...form,
        amount: Number(form.amount) || 0
      });
      setData((current) => ({ expenses: [payload.expense, ...(current.expenses || [])] }));
      setForm(initialForm);
      setMessage('Expense added for approval.');
      emitToast({ title: 'Expense added', description: payload.expense?.title || 'Expense submitted.' });
    } catch (error) {
      setMessage(error.response?.data?.message || 'Could not save expense.');
      emitToast({ title: 'Save failed', description: error.response?.data?.message || 'Could not save expense.', variant: 'destructive' });
    }
  }

  async function approveExpense(expense) {
    try {
      const payload = await adminService.approveExpense(expense._id);
      setData((current) => ({
        expenses: (current.expenses || []).map((item) => (item._id === expense._id ? payload.expense : item))
      }));
      emitToast({ title: 'Expense approved', description: expense.title });
    } catch (error) {
      emitToast({ title: 'Approve failed', description: error.response?.data?.message || 'Could not approve expense.', variant: 'destructive' });
    }
  }

  const rows = (data.expenses || []).map((expense) => ({
    id: expense._id,
    title: expense.title,
    category: expense.category?.replaceAll('_', ' '),
    amount: formatCurrency(expense.amount || 0),
    date: formatDate(expense.expenseDate),
    status: expense.status,
    variant: adminStatusVariant(expense.status),
    actions: expense.status !== 'approved' ? (
      <Button type="button" variant="outline" size="sm" onClick={() => approveExpense(expense)}>Approve</Button>
    ) : null
  }));

  return (
    <AdminPageShell>
      <AdminModuleHeader
        title="Expense Management"
        description="Add expenses, upload bills, approve expenses and generate expense reports."
        actionLabel="Add Expense"
        onAction={() => document.getElementById('admin-expense-form')?.scrollIntoView({ behavior: 'smooth' })}
      />
      <AdminPageLayout>
        <AdminFormCard id="admin-expense-form" title="Add Expense">
          <form onSubmit={submit}>
            <AdminFormField>
              <select className="h-11 w-full rounded-xl border bg-background px-4 text-sm" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {['electricity', 'water', 'internet', 'maintenance', 'staff_salary', 'food', 'miscellaneous'].map((item) => <option key={item} value={item}>{item.replaceAll('_', ' ')}</option>)}
              </select>
              <Input className="h-11" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              <Input className="h-11" type="number" placeholder="Amount" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
              <Input className="h-11 w-full" type="date" value={form.expenseDate} onChange={(e) => setForm({ ...form, expenseDate: e.target.value })} />
              <Input className="h-11" placeholder="Bill URL" value={form.billUrl} onChange={(e) => setForm({ ...form, billUrl: e.target.value })} />
              <Textarea className="min-h-[6rem] w-full" placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              {message ? <p className="break-words rounded-xl bg-primary/10 p-3 text-sm text-primary">{message}</p> : null}
              <Button type="submit" className="h-11 w-full">Add Expense</Button>
            </AdminFormField>
          </form>
        </AdminFormCard>
        <AdminTableSection title="Expense Reports">
          <DataTable
            embedded
            columns={[
              { key: 'title', label: 'Expense', mobilePrimary: true },
              { key: 'category', label: 'Category' },
              { key: 'amount', label: 'Amount' },
              { key: 'date', label: 'Date' },
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
