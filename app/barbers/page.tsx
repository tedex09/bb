import { Header } from '@/components/layout/header';
import { PageContainer } from '@/components/layout/page-container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Scissors, Plus } from 'lucide-react';

export default function BarbersPage() {
  return (
    <>
      <Header title="Barbers" subtitle="Manage your team" />
      <PageContainer>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold">Staff Members</h2>
            <p className="text-sm text-muted-foreground">
              View and manage your team
            </p>
          </div>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Barber
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scissors className="h-5 w-5" />
              No Team Members Yet
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Add barbers and staff members to manage schedules and
              appointments.
            </p>
          </CardContent>
        </Card>
      </PageContainer>
    </>
  );
}
