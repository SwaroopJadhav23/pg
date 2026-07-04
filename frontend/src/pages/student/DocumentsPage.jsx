import { Download, Eye, FileText, Share2 } from 'lucide-react';
import { PageHeader } from '../../components/shared/PageHeader';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { useStudentResource } from '../../hooks/useStudentResource';
import { studentService } from '../../services/studentService';
import { downloadDocument, EmptyState, formatBytes, formatDate, openWhatsAppSupport, previewDocument, shareDocument } from './studentUi';

export function DocumentsPage() {
  const { data } = useStudentResource(studentService.documents, { documents: [] });
  const documents = data.documents || [];

  return (
    <>
      <PageHeader eyebrow="Document Locker" title="Documents" description="Access rent agreement, Aadhaar copy, PAN copy, payment receipts and uploaded documents." />
      {documents.length === 0 ? (
        <EmptyState title="No documents yet" description="Your property admin will upload agreements, KYC copies and receipts here." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {documents.map((document) => (
            <Card key={document._id || document.title}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="rounded-2xl bg-primary/10 p-4 text-primary"><FileText className="h-6 w-6" /></div>
                  <Badge variant="slate">{document.type?.replaceAll('_', ' ')}</Badge>
                </div>
                <h3 className="mt-5 text-lg font-bold">{document.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{document.mimeType || 'Document'} • {formatBytes(document.size)} • {formatDate(document.createdAt)}</p>
                <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-3">
                  <Button type="button" variant="outline" size="sm" className="h-10 w-full justify-center" onClick={() => previewDocument(document)}><Eye className="h-4 w-4" /> Preview</Button>
                  <Button type="button" variant="outline" size="sm" className="h-10 w-full justify-center" onClick={() => downloadDocument(document)}><Download className="h-4 w-4" /> Download</Button>
                  <Button type="button" variant="outline" size="sm" className="h-10 w-full justify-center" onClick={() => shareDocument(document)}><Share2 className="h-4 w-4" /> Share</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
