"use server";
import { createServidorClient } from '@/lib/supabase/server';
import { Database } from '@/types/database.types';

export type AsistenciaReporteRow = Database['public']['Tables']['asistencia_diaria']['Row'] & {
  empleados?: { nombres: string; apellido_paterno: string; apellido_materno: string } | null;
};

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
/**
 * Obtiene el historial de asistencias (no incluye horas extra) desde la base de datos.
 * @returns {Promise<AsistenciaReporteRow[]>} Un arreglo de objetos que representan el historial de asistencias.
 */
export async function getAsistencias(
  fecha: string
): Promise<AsistenciaReporteRow[]> {
  const supabase = await createServidorClient();
  let query = supabase
    .from('asistencia_diaria')
    .select(`*`);

  if (fecha) query = query.eq('fecha', fecha)

  const { data, error } = await query;

  if (error) {
    throw new Error(`Error al obtener las asistencias: ${error.message}`);
  }

  return data as [];
}

export type Inasistencias = Database['public']['Tables']['registro_inasistencias_confirmadas']['Row'];
export async function getInasistencias(
  fecha?: string | null,
  id_empleado?: string | null,
): Promise<Inasistencias[]> {
  const supabase = await createServidorClient();
  let query = supabase
    .from('registro_inasistencias_confirmadas')
    .select('*');

  if (fecha) {
    query = query.eq('fecha', fecha);
  }

  if (id_empleado) {
    query = query.eq('id_empleado', id_empleado);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Error al obtener el historial: ${error.message}`);
  }

  return data as [];
}
export async function getInasistenciaUser(
  fecha?: string | null
): Promise<Inasistencias[]> {
  const supabase = await createServidorClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Usuario no autenticado.");
  }

  let query = supabase
    .from('registro_inasistencias_confirmadas')
    .select('*')
    .eq("id_empleado", user.id);

  if (fecha) {
    query = query.eq('fecha', fecha);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Error al obtener el historial: ${error.message}`);
  }

  return data as [];
}

export type RegistroChequeo = Database['public']['Tables']['registro_checador']['Row'];
export async function getRegistrosChecadorHoyUser(
  fecha?: string | null,
): Promise<RegistroChequeo[]> {
  const supabase = await createServidorClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Usuario no autenticado.");
  }
  let query = supabase
    .from('registro_checador')
    .select('*')
    .eq('id_empleado', user.id);
  if (fecha) {
    query = query.eq('fecha', fecha);
  }
  const { data, error } = await query;
  if (error) {
    throw new Error(`Error al obtener el historial: ${error.message}`);
  }

  return data as [];
}