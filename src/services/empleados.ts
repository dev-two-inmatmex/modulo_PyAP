import { createServidorClient } from "@/lib/supabase/server";
import { Database } from "@/types/database.types";
export type empleados = Database["public"]["Tables"]["empleados"]["Row"];
/**
 * 
 * @param id_empleado 
 * @param id_empresa 
 * @returns 
 */
export async function getEmpleadoDatos(
    id_empleado?: string | null,
    id_empresa?: number | null
): Promise<empleados[]> {
    const supabase = await createServidorClient();

    let query = supabase
        .from('empleados')
        .select('*')
        .order('nombres', { ascending: true });

    if (id_empleado) {
        query = query.eq('id', id_empleado);
    }
    if (id_empresa) {
        query = query.eq('id_empresa', id_empresa);
    }

    const { data, error } = await query;

    if (error) {
        throw new Error(`Error al consultar los empleados: ${error.message}`);
    }
    return data || [];
}

export type empleado_puesto = Database["public"]["Tables"]["empleado_puesto"]["Row"];

export async function getEmpleadoPuestos(): Promise<empleado_puesto[]> {
    const supabase = await createServidorClient();
    
    let query = supabase
        .from('empleado_puesto')
        .select('*');
    const { data, error } = await query;

    if (error) {
        throw new Error(`Error al consultar los empleados: ${error.message}`);
    }   
    return data || [];
}