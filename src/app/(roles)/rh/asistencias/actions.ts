'use server'
import { createServidorClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { Database } from '@/types/database.types';

import { getAsistenciaReporte } from '@/services/asistencias';
import { AsistenciaReporteRow } from '@/services/asistencias';

type confirmarInasistencia = Database['public']['Tables']['registro_inasistencias_confirmadas']['Insert'];

export async function confirmarInasistencia({ id_empleado, capturo, fecha, hora }: confirmarInasistencia) {
  const supabase = await createServidorClient();

  const { error: inasistenciaError } = await supabase.from('registro_inasistencias_confirmadas').insert({
    id_empleado: id_empleado,
    capturo: capturo,
    fecha: fecha,
    hora: hora,
  });
  if (inasistenciaError) {
    console.error("Error al registrar inasistencia:", inasistenciaError);
    return { error: `Error al registrar inasistencia ${inasistenciaError?.message}.` };
  }
  return { success: `Se ha registrado la inasistencia con éxito.` };
}


export async function fetchAsistenciaReporteAction(
  fechaInicio: string,
  fechaFin: string,
) {
  const supabase = await createServidorClient();

  const { data, error } = await supabase
    .from('asistencia_diaria')
    .select('*')
    .gte('fecha', fechaInicio)
    .lte('fecha', fechaFin);

  // ...
  if (error) {
    console.error("Server Action Error fetching attendance report:", error);
  }
  return data;
}

import { getVistaEmpleadosEmpresa } from "@/services/empleados";

export async function fetchEmpleadosReporteAction(empresaId: number | null) {
  // Pasamos 'undefined' en el id_estatus para que traiga TODOS (activos e inactivos)
  // Pasamos empresaId o undefined si queremos todas las empresas
  const empleados = await getVistaEmpleadosEmpresa(undefined, empresaId || undefined);
  return empleados;
}