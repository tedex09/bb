import { Header } from '@/components/layout/header';
import { PageContainer } from '@/components/layout/page-container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

export default function AgendaPage() {
  return (
    <>
      <Header title="Agenda" subtitle="Manage your appointments" />
      <PageContainer>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Calendar View
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Your appointment calendar will be displayed here.
            </p>
          </CardContent>
        </Card>
      </PageContainer>
    </>
  );
}
