import { Download, Eye, FileText, Share2 } from 'lucide-react';
import { PageHeader } from '../../components/shared/PageHeader';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { useStudentResource } from '../../hooks/useStudentResource';
import { studentService } from '../../services/studentService';
import { documentsFallback } from './studentPortalData';
import { formatBytes, formatDate } from './studentUi';

export function DocumentsPage() {
  const { data } = useStudentResource(studentService.documents, documentsFallback);

  return (
    <>
      <PageHeader eyebrow="Document Locker" title="Documents" description="Access rent agreement, Aadhaar copy, PAN copy, payment receipts and uploaded documents." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {(data.documents || []).map((document) => (
          <Card key={document._id || document.title}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="rounded-2xl bg-primary/10 p-4 text-primary"><FileText className="h-6 w-6" /></div>
                <Badge variant="slate">{document.type?.replaceAll('_', ' ')}</Badge>
              </div>
              <h3 className="mt-5 text-lg font-bold">{document.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{document.mimeType || 'Document'} • {formatBytes(document.size)} • {formatDate(document.createdAt)}</p>
              <div className="mt-6 grid grid-cols-3 gap-2">
                <Button variant="outline" size="sm"><Eye className="h-4 w-4" /> Preview</Button>
                <Button variant="outline" size="sm"><Download className="h-4 w-4" /> Download</Button>
                <Button variant="outline" size="sm"><Share2 className="h-4 w-4" /> Share</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
