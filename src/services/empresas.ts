import { createServidorClient } from '@/lib/supabase/server';
import { Database } from '@/types/database.types';
export type Empresa = Database['public']['Tables']['empresas']['Row'];

/**
 * Obtiene todas las empresas.
 * @returns Un arreglo de empresas.
 */
export async function getEmpresas(): Promise<Empresa[]> {
  const supabase = await createServidorClient();
  let query = supabase
    .from('empresas')
    .select('*');
  const { data, error } = await query;

  if (error) {
    throw new Error(`Error al consultar empresas: ${error.message}`);
  }
  return data || [];
}

