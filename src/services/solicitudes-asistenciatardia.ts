"use server"
import { createServidorClient } from "@/lib/supabase/server";
import { Database } from "@/types/database.types";
type registro_solicitud_asistencia_30min_despues = Database["public"]["Tables"]["registro_solicitud_asistencia_30min_despues"]["Row"];
export type versolicitud_asistencia_30min_despues = Pick<registro_solicitud_asistencia_30min_despues,"fecha"|"hora"|"id_empleado"|"aceptar_asistencia_tardia">;

export async function getSolicitudesAsistencia30MinDespues(
    fecha?: string | null,
    id_empleado?: string | null,
): Promise<versolicitud_asistencia_30min_despues[]> {
const supabase = await createServidorClient();
let query = supabase
    .from('registro_solicitud_asistencia_30min_despues')
    .select('fecha, hora, id_empleado, aceptar_asistencia_tardia');
    if (fecha) {
        query = query.eq('fecha', fecha);
    }
    if (id_empleado) {
        query = query.eq('id_empleado', id_empleado)
        .limit(1);
    }
    const { data, error } = await query;
    if (error) {
        throw new Error(`Error al consultar la vista de solicitudes de asistencia: ${error.message}`);
    }
    return data || [];
}
