"use server";
import { createServidorClient } from '@/lib/supabase/server';
import { Database } from '@/types/database.types';

type GrupoHoraEntradaDB = Database['public']['Views']['vista_empleados_hora_entrada']['Row'];

export type AsistenciaReporteRow = Database['public']['Tables']['asistencia_diaria']['Row']&{
  empleados?: {nombres: string; apellido_paterno: string; apellido_materno: string}| null;
};

/**
 * Obtiene y agrupa a los empleados por su hora de entrada y estatus.
 * @param id_empresa - (Opcional) El ID de la empresa para filtrar.
 * @param id_estatus - (Opcional) El ID del estatus (Por defecto es 1: Activo).
 */
export async function getEmpleadosAgrupadosPorHoraEntrada(
  id_empresa?: number | null,
  id_estatus: number = 1 
): Promise<GrupoHoraEntradaDB[]> { 
  
  const supabase = await createServidorClient();

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


/**
 * Obtiene el historial de asistencias (no incluye horas extra) desde la base de datos.
 * @returns {Promise<AsistenciaReporteRow[]>} Un arreglo de objetos que representan el historial de asistencias.
 */
export async function getAsistenciaReporte(
  fechaInicio: string, 
  fechaFin: string, 
  idEmpresa?: number | null | undefined
): Promise<AsistenciaReporteRow[]> {
  const supabase = await createServidorClient();
  let query = supabase
    .from('asistencia_diaria')
    .select(`*,
      empleados ( nombres, apellido_paterno )`)
      .gte('fecha', fechaInicio) 
      .lte('fecha', fechaFin)
      .order('empleados(nombres)', { ascending: true })
      .order('fecha', { ascending: true });
    
    if (idEmpresa) {
      query = query.eq('id_empresa', idEmpresa);
    }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Error al obtener el historial: ${error.message}`);
  }

  return data as [];
}