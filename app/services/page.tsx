import { Header } from '@/components/layout/header';
import { PageContainer } from '@/components/layout/page-container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Plus } from 'lucide-react';

export default function ServicesPage() {
  return (
    <>
      <Header title="Services" subtitle="Manage your offerings" />
      <PageContainer>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold">Service Catalog</h2>
            <p className="text-sm text-muted-foreground">
              View and manage all services
            </p>
          </div>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Service
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              No Services Yet
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Create services with pricing and duration to offer your clients.
            </p>
          </CardContent>
        </Card>
      </PageContainer>
    </>
  );
}
