'use server';

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export interface Client {
  id: string;
  barbershop_id: string;
  name: string;
  email?: string;
  phone?: string;
  notes?: string;
  visit_count: number;
  last_visit?: string;
  total_spent: number;
  created_at: string;
  updated_at: string;
}

export interface CreateClientInput {
  name: string;
  email?: string;
  phone?: string;
  notes?: string;
}

export interface UpdateClientInput extends CreateClientInput {
  id: string;
}

async function getBarbershopId(userId: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('barbershop_id')
    .eq('id', userId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data.barbershop_id;
}

export async function createClient(userId: string, input: CreateClientInput) {
  try {
    const barbershopId = await getBarbershopId(userId);

    if (!barbershopId) {
      return { error: 'User profile not found' };
    }

    const { data, error } = await supabase
      .from('clients')
      .insert([
        {
          barbershop_id: barbershopId,
          name: input.name,
          email: input.email || null,
          phone: input.phone || null,
          notes: input.notes || null,
          visit_count: 0,
          total_spent: 0,
        },
      ])
      .select()
      .single();

    if (error) {
      return { error: error.message };
    }

    revalidatePath('/clients');
    return { success: true, data };
  } catch (error) {
    return { error: 'An error occurred while creating the client' };
  }
}

export async function updateClient(userId: string, input: UpdateClientInput) {
  try {
    const barbershopId = await getBarbershopId(userId);

    if (!barbershopId) {
      return { error: 'User profile not found' };
    }

    const { data, error } = await supabase
      .from('clients')
      .update({
        name: input.name,
        email: input.email || null,
        phone: input.phone || null,
        notes: input.notes || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', input.id)
      .eq('barbershop_id', barbershopId)
      .select()
      .single();

    if (error) {
      return { error: error.message };
    }

    revalidatePath('/clients');
    revalidatePath(`/clients/${input.id}`);
    return { success: true, data };
  } catch (error) {
    return { error: 'An error occurred while updating the client' };
  }
}

export async function deleteClient(userId: string, clientId: string) {
  try {
    const barbershopId = await getBarbershopId(userId);

    if (!barbershopId) {
      return { error: 'User profile not found' };
    }

    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', clientId)
      .eq('barbershop_id', barbershopId);

    if (error) {
      return { error: error.message };
    }

    revalidatePath('/clients');
    return { success: true };
  } catch (error) {
    return { error: 'An error occurred while deleting the client' };
  }
}

export async function getClients(userId: string, searchQuery?: string) {
  try {
    const barbershopId = await getBarbershopId(userId);

    if (!barbershopId) {
      return { error: 'User profile not found' };
    }

    let query = supabase
      .from('clients')
      .select('*')
      .eq('barbershop_id', barbershopId)
      .order('name', { ascending: true });

    if (searchQuery && searchQuery.trim()) {
      query = query.or(`name.ilike.%${searchQuery}%,phone.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`);
    }

    const { data, error } = await query;

    if (error) {
      return { error: error.message };
    }

    return { success: true, data: data as Client[] };
  } catch (error) {
    return { error: 'An error occurred while fetching clients' };
  }
}

export async function getClient(userId: string, clientId: string) {
  try {
    const barbershopId = await getBarbershopId(userId);

    if (!barbershopId) {
      return { error: 'User profile not found' };
    }

    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', clientId)
      .eq('barbershop_id', barbershopId)
      .maybeSingle();

    if (error) {
      return { error: error.message };
    }

    if (!data) {
      return { error: 'Client not found' };
    }

    return { success: true, data: data as Client };
  } catch (error) {
    return { error: 'An error occurred while fetching the client' };
  }
}

export async function getClientAppointments(userId: string, clientId: string) {
  try {
    const barbershopId = await getBarbershopId(userId);

    if (!barbershopId) {
      return { error: 'User profile not found' };
    }

    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        service:services(name, price),
        barber:barbers(name),
        payment:payments(amount, status, method)
      `)
      .eq('client_id', clientId)
      .eq('barbershop_id', barbershopId)
      .order('start_time', { ascending: false });

    if (error) {
      return { error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    return { error: 'An error occurred while fetching appointments' };
  }
}
