import { createClient } from '@/lib/supabase/server';

export async function getEmpresas(){
    const supabase = await createClient();
}