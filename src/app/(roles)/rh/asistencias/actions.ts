'use server'
import { createServidorClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { Database } from '@/types/database.types';

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