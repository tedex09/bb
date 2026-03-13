import { Header } from '@/components/layout/header';
import { PageContainer } from '@/components/layout/page-container';
import { ClientProfileHeader } from '@/components/clients/client-profile-header';
import { AppointmentHistory } from '@/components/clients/appointment-history';
import { getClient, getClientAppointments } from '@/app/actions/clients';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';
import { redirect, notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('sb-auth-token');

  if (!token) {
    return null;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser(token.value);

  return user;
}

export default async function ClientProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth/login');
  }

  const [clientResult, appointmentsResult] = await Promise.all([
    getClient(user.id, params.id),
    getClientAppointments(user.id, params.id),
  ]);

  if (clientResult.error || !clientResult.data) {
    notFound();
  }

  const client = clientResult.data;
  const appointments = appointmentsResult.data || [];

  return (
    <>
      <Header title={client.name} subtitle="Client Profile" />
      <PageContainer>
        <div className="space-y-6">
          <Link href="/clients">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Clients
            </Button>
          </Link>

          <ClientProfileHeader client={client} userId={user.id} />

          <AppointmentHistory appointments={appointments} />
        </div>
      </PageContainer>
    </>
  );
}
