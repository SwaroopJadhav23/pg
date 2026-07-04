import { useState } from 'react';
import { DataTable } from '../../components/shared/DataTable';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { emitToast } from '../../components/ui/toast';
import { useResource } from '../../hooks/useResource';
import { formatCurrency } from '../../lib/utils';
import { adminService } from '../../services/adminService';
import { AdminFormCard, AdminFormField, AdminModuleHeader, AdminPageLayout, AdminTableSection, adminStatusVariant } from './adminUi';

const initialForm = { name: '', mobile: '', role: 'staff', salary: '' };

export function StaffManagementPage() {
  const { data, setData } = useResource(adminService.staff, { staff: [] });
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState('');

  async function submit(event) {
    event.preventDefault();
    try {
      const payload = await adminService.createStaff({
        ...form,
        salary: Number(form.salary) || 0
      });
      setData((current) => ({ staff: [payload.staff, ...(current.staff || [])] }));
      setForm(initialForm);
      setMessage('Staff member created.');
      emitToast({ title: 'Staff created', description: payload.staff?.name || 'Staff member added.' });
    } catch (error) {
      setMessage(error.response?.data?.message || 'Could not save staff.');
      emitToast({ title: 'Create failed', description: error.response?.data?.message || 'Could not save staff.', variant: 'destructive' });
    }
  }

  async function markPresent(staffMember) {
    try {
      const payload = await adminService.markAttendance(staffMember._id, { status: 'present' });
      setData((current) => ({
        staff: (current.staff || []).map((item) => (item._id === staffMember._id ? payload.staff : item))
      }));
      emitToast({ title: 'Attendance marked', description: `${staffMember.name} marked present.` });
    } catch (error) {
      emitToast({ title: 'Attendance failed', description: error.response?.data?.message || 'Could not mark attendance.', variant: 'destructive' });
    }
  }

  async function assignTask(staffMember) {
    const title = window.prompt('Enter task title:');
    if (!title?.trim()) return;
    try {
      const payload = await adminService.assignTask(staffMember._id, { title: title.trim(), status: 'todo' });
      setData((current) => ({
        staff: (current.staff || []).map((item) => (item._id === staffMember._id ? payload.staff : item))
      }));
      emitToast({ title: 'Task assigned', description: title.trim() });
    } catch (error) {
      emitToast({ title: 'Task failed', description: error.response?.data?.message || 'Could not assign task.', variant: 'destructive' });
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
    variant: adminStatusVariant(staff.status),
    actions: (
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm" onClick={() => markPresent(staff)}>Present</Button>
        <Button type="button" variant="outline" size="sm" onClick={() => assignTask(staff)}>Assign Task</Button>
      </div>
    )
  }));

  return (
    <>
      <AdminModuleHeader
        title="Staff Management"
        description="Manage caretakers, security, cleaners and cooks with attendance, salary and task assignment."
        actionLabel="Add Staff"
        onAction={() => document.getElementById('admin-staff-form')?.scrollIntoView({ behavior: 'smooth' })}
      />
      <AdminPageLayout>
        <AdminFormCard id="admin-staff-form" title="Add Staff">
          <form onSubmit={submit}>
            <AdminFormField>
              <Input className="h-11" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              <Input className="h-11" placeholder="Mobile" value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} />
              <select className="h-11 w-full rounded-xl border bg-background px-4 text-sm" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                {['caretaker', 'security', 'cleaner', 'cook', 'electrician', 'plumber', 'staff'].map((role) => <option key={role} value={role}>{role}</option>)}
              </select>
              <Input className="h-11" type="number" placeholder="Salary" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} />
              {message ? <p className="break-words rounded-xl bg-primary/10 p-3 text-sm text-primary">{message}</p> : null}
              <Button type="submit" className="h-11 w-full">Create Staff</Button>
            </AdminFormField>
          </form>
        </AdminFormCard>
        <AdminTableSection title="Attendance, Salary & Tasks">
          <DataTable
            embedded
            columns={[
              { key: 'name', label: 'Name', mobilePrimary: true },
              { key: 'mobile', label: 'Mobile' },
              { key: 'role', label: 'Role' },
              { key: 'salary', label: 'Salary' },
              { key: 'task', label: 'Task' },
              { key: 'status', label: 'Status', badge: true },
              { key: 'actions', label: 'Actions' }
            ]}
            rows={rows}
          />
        </AdminTableSection>
      </AdminPageLayout>
    </>
  );
}
