import { createServidorClient } from "@/lib/supabase/server";
import { Database } from "@/types/database.types";
export type empleados = Database["public"]["Tables"]["empleados"]["Row"];
/**
 * Obtiene los empleados de la base de datos
 * @returns {Promise<empleados[]>} Un arreglo de empleados
 */
export async function getEmpleados(
): Promise<empleados[]> {
    const supabase = await createServidorClient();

    let query = supabase
        .from('empleados')
        .select('*')
        .order('nombres', { ascending: true });

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

export type vista_empleados_empresa = Database["public"]["Views"]["vista_empleados_empresa"]["Row"];
/**
 * Obtiene los empleados activos y el id_empresa de cada uno respecto a su puesto principal
 * (id_empleado, id_empresa)
 * @returns 
 */
export async function getVistaEmpleadosEmpresa(
    id_estatus?: number,
    id_empresa?: number,
): Promise<vista_empleados_empresa[]> {
    const supabase = await createServidorClient();
    let query = supabase
        .from('vista_empleados_empresa')
        .select('*');
    if (id_estatus) {
        query = query.eq('id_estatus', id_estatus);
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

