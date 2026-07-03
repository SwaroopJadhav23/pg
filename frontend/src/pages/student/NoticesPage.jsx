import { AlertTriangle, Bell, Megaphone, Wrench } from 'lucide-react';
import { PageHeader } from '../../components/shared/PageHeader';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent } from '../../components/ui/card';
import { useStudentResource } from '../../hooks/useStudentResource';
import { studentService } from '../../services/studentService';
import { noticesFallback } from './studentPortalData';
import { formatDate } from './studentUi';

function noticeIcon(title = '') {
  const lower = title.toLowerCase();
  if (lower.includes('emergency')) return AlertTriangle;
  if (lower.includes('maintenance')) return Wrench;
  if (lower.includes('rent')) return Bell;
  return Megaphone;
}

export function NoticesPage() {
  const { data } = useStudentResource(studentService.notices, noticesFallback);

  return (
    <>
      <PageHeader eyebrow="Notice Center" title="Notices" description="Latest announcements, maintenance notices, emergency alerts and rent reminders." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {(data.notices || []).map((notice) => {
          const Icon = noticeIcon(notice.title);
          return (
            <Card key={notice._id || notice.title} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="rounded-2xl bg-primary/10 p-3 text-primary"><Icon className="h-5 w-5" /></div>
                  <Badge>{notice.audience?.replaceAll('_', ' ') || 'all tenants'}</Badge>
                </div>
                <h3 className="mt-5 text-lg font-bold">{notice.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{notice.body}</p>
                <p className="mt-5 text-xs font-semibold text-muted-foreground">{formatDate(notice.createdAt || notice.scheduledAt)}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
}
