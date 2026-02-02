'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';



export async function logout() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Error during sign out:', error.message);
  }

  redirect('/login');
}
