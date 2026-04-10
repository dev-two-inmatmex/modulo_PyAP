'use server'
import { createServidorClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { Database } from '@/types/database.types';

import { getAsistenciaReporte } from '@/services/asistencias';
import { AsistenciaReporteRow } from '@/services/asistencias';

type confirmarInasistencia = Database['public']['Tables']['registro_inasistencias_confirmadas']['Insert'];

export async function confirmarInasistencia({ id_empleado, capturo, fecha, hora }: confirmarInasistencia) {
    const supabase = await createServidorClient();
    
    const {error: inasistenciaError} = await supabase.from('registro_inasistencias_confirmadas').insert({
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
    idEmpresa?: number | null
  ): Promise<AsistenciaReporteRow[]> {
    try {
      const data = await getAsistenciaReporte(fechaInicio, fechaFin, idEmpresa);
      return data;
    } catch (error) {
      console.error("Server Action Error fetching attendance report:", error);
      return [];
    }
  }