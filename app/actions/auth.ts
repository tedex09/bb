'use server';

import { supabase } from '@/lib/supabase';

export async function signUpAction(
  email: string,
  password: string,
  name: string,
  barbershopName: string
) {
  try {
    // Create barbershop
    const { data: barbershopData, error: barbershopError } = await supabase
      .from('barbershops')
      .insert([
        {
          name: barbershopName,
          email: email,
        },
      ])
      .select()
      .single();

    if (barbershopError) {
      return { error: 'Barbershop name already exists' };
    }

    // Sign up user
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/callback`,
      },
    });

    if (signUpError || !authData.user) {
      return { error: signUpError?.message || 'Failed to create account' };
    }

    // Create profile
    const { error: profileError } = await supabase.from('profiles').insert([
      {
        id: authData.user.id,
        email: email,
        name: name,
        barbershop_id: barbershopData.id,
        role: 'owner',
      },
    ]);

    if (profileError) {
      return { error: profileError.message };
    }

    return { success: true };
  } catch (error) {
    return { error: 'An error occurred' };
  }
}

export async function signInAction(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error: error.message };
    }

    return { success: true };
  } catch (error) {
    return { error: 'An error occurred' };
  }
}

export async function signOutAction() {
  try {
    await supabase.auth.signOut();
    return { success: true };
  } catch (error) {
    return { error: 'An error occurred' };
  }
}
