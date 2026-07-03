import { Plus, Search } from 'lucide-react';
import { PageHeader } from '../../components/shared/PageHeader';
import { DataTable } from '../../components/shared/DataTable';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { complaintRows, tableRows } from '../../data/mockData';

const copy = {
  'my-room': ['My Room', 'Property, floor, room, bed, sharing details and amenities.'],
  'rent-payments': ['Rent & Payments', 'Payment status, receipts, reminders and history.'],
  complaints: ['Complaints', 'Raise, assign, track and resolve complaints with timeline visibility.'],
  notices: ['Notices', 'Announcements, rent reminders, maintenance updates and emergency alerts.'],
  documents: ['Documents', 'Rent agreements, Aadhaar, PAN and receipts with preview/download actions.'],
  visitors: ['Visitors', 'Visitor requests, check-in, check-out and visitor pass history.'],
  profile: ['Profile', 'Personal details, guardian contacts, emergency contacts and preferences.'],
  support: ['Support', 'Support tickets, caretaker chat and WhatsApp support actions.'],
  tenants: ['Tenants', 'Tenant profiles, guardian details, KYC, agreements, search and bulk actions.'],
  rooms: ['Rooms', 'Property floor room bed hierarchy, assignment, transfer and vacancy workflows.'],
  'rent-management': ['Rent Management', 'Generate rent, mark paid, receipts, reminders and collection dashboards.'],
  expenses: ['Expenses', 'Electricity, water, internet, maintenance, salary, food and bill approvals.'],
  staff: ['Staff', 'Caretaker, security, cleaner and cook attendance, salary and tasks.'],
  reports: ['Reports', 'Occupancy, revenue, rent collection, expense and tenant reports.'],
  settings: ['Settings', 'Property, rent, notification, WhatsApp, email and security settings.'],
  properties: ['Properties', 'Create, edit, disable and monitor all PG properties.'],
  'revenue-center': ['Revenue Center', 'Portfolio revenue, collection rate, outstanding amount and profit estimates.'],
  managers: ['Managers', 'Create managers, assign properties, edit access and disable accounts.'],
  analytics: ['Analytics', 'Occupancy trends, revenue trends, retention, complaint resolution and AI insights.'],
  'audit-logs': ['Audit Logs', 'Track login history, manager actions, tenant activity and property changes.']
};

export function ModulePage({ module }) {
  const [title, description] = copy[module] || ['Module', 'Enterprise workflow module.'];
  const rows = module === 'complaints' ? complaintRows : tableRows;
  const columns = module === 'complaints'
    ? [{ key: 'ticket', label: 'Ticket' }, { key: 'category', label: 'Category' }, { key: 'owner', label: 'Owner' }, { key: 'status', label: 'Status', badge: true }]
    : [{ key: 'name', label: 'Name' }, { key: 'room', label: 'Reference' }, { key: 'amount', label: 'Value' }, { key: 'status', label: 'Status', badge: true }];

  return (
    <>
      <PageHeader eyebrow="Workspace Module" title={title} description={description} actionLabel={`Create ${title.split(' ')[0]}`} />
      <Card>
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <CardTitle>Operations</CardTitle>
          <div className="flex gap-2">
            <div className="relative"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input className="pl-9" placeholder="Search records" /></div>
            <Button><Plus className="h-4 w-4" /> New</Button>
          </div>
        </CardHeader>
        <CardContent><DataTable columns={columns} rows={rows} /></CardContent>
      </Card>
    </>
  );
}
