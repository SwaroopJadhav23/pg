import { Download, ReceiptIndianRupee, WalletCards } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from '../../components/shared/DataTable';
import { PageHeader } from '../../components/shared/PageHeader';
import { StatCard } from '../../components/shared/StatCard';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { emitToast } from '../../components/ui/toast';
import { useStudentResource } from '../../hooks/useStudentResource';
import { formatCurrency } from '../../lib/utils';
import { resolveImageUrl } from '../landing/utils/resolveImageUrl';
import { studentService } from '../../services/studentService';
import { formatDate, statusVariant } from './studentUi';

export function RentPaymentsPage() {
  const navigate = useNavigate();
  const { data } = useStudentResource(studentService.rentPayments, { currentRent: null, history: [] });
  const current = data.currentRent || {};

  function handlePayRent() {
    if (current.status === 'paid') {
      emitToast({ title: 'Rent paid', description: 'Your current month rent is already marked as paid.' });
      return;
    }
    navigate('/student/support');
    emitToast({ title: 'Need to pay rent?', description: 'Submit a support ticket or contact your property admin to complete payment.' });
  }

  function downloadLatestReceipt() {
    if (!current.receiptUrl) {
      emitToast({
        title: 'Receipt not ready',
        description: current.status === 'paid' ? 'Receipt is being prepared.' : 'Receipt is available after rent is marked paid.',
        variant: 'destructive'
      });
      return;
    }
    window.open(resolveImageUrl(current.receiptUrl), '_blank', 'noopener,noreferrer');
  }
  const rows = (data.history || []).map((rent) => ({
    id: rent._id || rent.month,
    month: rent.month,
    amount: formatCurrency(rent.amount || 0),
    paymentDate: rent.paidAt ? formatDate(rent.paidAt) : 'Not paid',
    dueDate: formatDate(rent.dueDate),
    status: rent.status,
    variant: statusVariant(rent.status)
  }));

  return (
    <>
      <PageHeader eyebrow="Rent Management" title="Rent & Payments" description="Track current rent, due dates, late fees, receipts and payment history." actionLabel="Pay Rent" onAction={handlePayRent} />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Current Month Rent" value={formatCurrency(current.amount || 0)} icon={ReceiptIndianRupee} />
        <StatCard label="Due Date" value={formatDate(current.dueDate)} icon={WalletCards} tone="warning" />
        <StatCard label="Payment Status" value={current.status || '-'} icon={ReceiptIndianRupee} tone={statusVariant(current.status)} />
        <StatCard label="Late Fees" value={formatCurrency(current.lateFees || 0)} icon={WalletCards} tone={current.lateFees ? 'danger' : 'success'} />
      </div>
      <Card>
        <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <CardTitle>Payment History</CardTitle>
          <Button type="button" variant="outline" onClick={downloadLatestReceipt}><Download className="h-4 w-4" /> Download Latest Receipt</Button>
        </CardHeader>
        <CardContent>
          <DataTable columns={[{ key: 'month', label: 'Month' }, { key: 'amount', label: 'Amount' }, { key: 'paymentDate', label: 'Payment Date' }, { key: 'dueDate', label: 'Due Date' }, { key: 'status', label: 'Status', badge: true }]} rows={rows} />
        </CardContent>
      </Card>
    </>
  );
}
