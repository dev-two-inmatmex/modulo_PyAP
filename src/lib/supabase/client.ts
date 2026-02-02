import { createBrowserClient } from '@supabase/ssr'

export async function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    console.error("Error: Variables de entorno de Supabase no encontradas en el cliente.");
  }

  return createBrowserClient(url!, anonKey!);
}