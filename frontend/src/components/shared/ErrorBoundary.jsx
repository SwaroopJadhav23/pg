import React from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <Card className="max-w-lg">
          <CardHeader><CardTitle>Something went wrong</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">The application recovered from a UI error. Please retry the action or refresh the page.</p>
            <pre className="max-h-32 overflow-auto rounded-xl bg-slate-100 p-3 text-xs dark:bg-slate-900">{this.state.error?.message}</pre>
            <Button onClick={() => window.location.reload()}>Reload Application</Button>
          </CardContent>
        </Card>
      </div>
    );
  }
}
