import { Header } from '@/components/layout/header';
import { PageContainer } from '@/components/layout/page-container';
import { ClientList } from '@/components/clients/client-list';
import { ClientSearch } from '@/components/clients/client-search';
import { ClientFormDialog } from '@/components/clients/client-form-dialog';
import { getClients } from '@/app/actions/clients';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

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

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: { search?: string };
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth/login');
  }

  const result = await getClients(user.id, searchParams.search);

  if (result.error) {
    return (
      <>
        <Header title="Clients" subtitle="Manage your client base" />
        <PageContainer>
          <div className="text-center py-8">
            <p className="text-destructive">{result.error}</p>
          </div>
        </PageContainer>
      </>
    );
  }

  const clients = result.data || [];

  return (
    <>
      <Header title="Clients" subtitle="Manage your client base" />
      <PageContainer>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="w-full sm:w-auto sm:flex-1 sm:max-w-sm">
              <ClientSearch />
            </div>
            <ClientFormDialog userId={user.id} />
          </div>

          <ClientList clients={clients} />
        </div>
      </PageContainer>
    </>
  );
}
