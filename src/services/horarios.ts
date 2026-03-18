import { createClient } from "@/lib/supabase/server";
import { Database } from "@/types/database.types";
type turno = Database["public"]["Views"]["vista_horarios_empleados"]["Row"];
type turnos = Database["public"]["Views"]["vista_horarios_empleados_semanal"]["Row"];


/**
 * Obtiene todos los horarios de los empleados.
 * @returns Un arreglo de horarios de todos los empleados.
 */
export async function getHorariosEmpleado(
    id_empleado?: string | null,
): Promise<turnos[]> {
    const supabase = await createClient();
    let query = supabase
        .from('vista_horarios_empleados_semanal')
        .select('*');
    if (id_empleado) {
        query = query.eq('id_empleado', id_empleado);
    }
    const { data, error } = await query;
    if (error) {
        throw new Error(`Error al consultar la vista de horarios de empleados: ${error.message}`);
    }
    return data || [];
}

/**
 * Obtiene el horario de los empleados por día de la semana.
 * @param id_empleado - (Opcional) El ID del estatus (Por defecto es 1: Activo).
 * @returns Un arreglo de horarios(del dia de la semana) de todos los empleados.
 */
export async function getHorarioEmpleadoDelDia(
    id_empleado?: string | null
): Promise<turno[]> {

    const supabase = await createClient();

    let query = supabase
        .from('vista_horarios_empleados')
        .select('*');

    if (id_empleado) {
        query = query.eq('id', id_empleado);
    }

    const { data, error } = await query;

    if (error) {
        throw new Error(`Error al consultar la vista de horarios de empleados: ${error.message}`);
    }
    return data || [];
}