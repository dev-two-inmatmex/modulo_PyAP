"use server";
import { createServidorClient } from '@/lib/supabase/server';
import { Database } from '@/types/database.types';

type GrupoHoraEntradaDB = Database['public']['Views']['vista_empleados_hora_entrada']['Row'];
export type HistorialAsistenciaRow = Database['public']['Functions']['obtener_historial_asistencia']['Returns'][number];

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
 * Consulta el historial de asistencias, faltas, vacaciones e incapacidades
 * usando la función RPC de Supabase.
 */
export async function getHistorialReporte(
  fechaInicio: string, 
  fechaFin: string, 
  idEmpresa?: number | null | undefined
): Promise<HistorialAsistenciaRow[]> {

  const supabase = await createServidorClient();
  let query = supabase.rpc('obtener_historial_asistencia', {
    fecha_inicio_param: fechaInicio,
    fecha_fin_param: fechaFin,
    empresa_id_param: idEmpresa || undefined
  });
  const { data, error } = await query;
  
  if (error) {
    throw new Error(`Error al obtener el historial: ${error.message}`);
  }

  return data || [];
}