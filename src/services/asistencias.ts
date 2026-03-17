import { createClient } from '@/lib/supabase/server';
import { Database } from '@/types/database.types';

type GrupoHoraEntradaDB = Database['public']['Views']['vista_empleados_hora_entrada']['Row'];

/**
 * Obtiene y agrupa a los empleados por su hora de entrada y estatus.
 * @param id_empresa - (Opcional) El ID de la empresa para filtrar.
 * @param id_estatus - (Opcional) El ID del estatus (Por defecto es 1: Activo).
 */
export async function getEmpleadosAgrupadosPorHoraEntrada(
  id_empresa?: number | null,
  id_estatus: number = 1 
): Promise<GrupoHoraEntradaDB[]> { 
  
  const supabase = await createClient();

  let query = supabase
    .from('vista_empleados_hora_entrada')
    .select('*')
    .eq('id_estatus', id_estatus); 

  if (id_empresa) {
    query = query.eq('id_empresa', id_empresa);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Error al consultar empleados: ${error.message}`);
  }

  return data || [];
}