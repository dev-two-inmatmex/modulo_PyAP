'use server';

import { createServidorClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';



export async function logout() {
  const supabase = await createServidorClient();

  const { error } = await supabase.auth.signOut({ scope: 'local' });

  if (error) {
    console.error('Error during sign out:', error.message);
  }

  redirect('/login');
}
