import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

export function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <Card className="max-w-md text-center">
        <CardHeader><CardTitle>Unauthorized</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">Your role does not have access to this area.</p>
          <Button asChild><Link to="/">Go to my dashboard</Link></Button>
        </CardContent>
      </Card>
    </div>
  );
}
