import { useState } from 'react';
import { DataTable } from '../../components/shared/DataTable';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { useResource } from '../../hooks/useResource';
import { formatCurrency } from '../../lib/utils';
import { adminService } from '../../services/adminService';
import { adminFallback } from './adminPortalData';
import { AdminModuleHeader, adminStatusVariant } from './adminUi';

const initialForm = { name: '', mobile: '', role: 'staff', salary: 0 };

export function StaffManagementPage() {
  const { data, setData } = useResource(adminService.staff, { staff: adminFallback.staff });
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState('');

  async function submit(event) {
    event.preventDefault();
    try {
      const payload = await adminService.createStaff(form);
      setData((current) => ({ staff: [payload.staff, ...(current.staff || [])] }));
      setForm(initialForm);
      setMessage('Staff member created.');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Staff form ready. Connect backend to persist.');
    }
  }

  const rows = (data.staff || []).map((staff) => ({
    id: staff._id,
    name: staff.name,
    mobile: staff.mobile,
    role: staff.role,
    salary: formatCurrency(staff.salary || 0),
    task: staff.tasks?.[0]?.title || 'No task',
    status: staff.status,
    variant: adminStatusVariant(staff.status)
  }));

  return (
    <>
      <AdminModuleHeader title="Staff Management" description="Manage caretakers, security, cleaners and cooks with attendance, salary and task assignment." />
      <div className="grid gap-6 xl:grid-cols-[0.75fr_1.25fr]">
        <Card>
          <CardHeader><CardTitle>Add Staff</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <Input placeholder="Mobile" value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} />
              <select className="h-11 w-full rounded-xl border bg-background px-4 text-sm" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                {['caretaker', 'security', 'cleaner', 'cook', 'electrician', 'plumber', 'staff'].map((role) => <option key={role} value={role}>{role}</option>)}
              </select>
              <Input type="number" placeholder="Salary" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} />
              {message ? <p className="rounded-xl bg-primary/10 p-3 text-sm text-primary">{message}</p> : null}
              <Button className="w-full">Create Staff</Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Attendance, Salary & Tasks</CardTitle></CardHeader>
          <CardContent><DataTable columns={[{ key: 'name', label: 'Name' }, { key: 'mobile', label: 'Mobile' }, { key: 'role', label: 'Role' }, { key: 'salary', label: 'Salary' }, { key: 'task', label: 'Task' }, { key: 'status', label: 'Status', badge: true }]} rows={rows} /></CardContent>
        </Card>
      </div>
    </>
  );
}
