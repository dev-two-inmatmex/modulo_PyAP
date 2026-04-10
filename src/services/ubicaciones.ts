"use server"
import { createServidorClient } from "@/lib/supabase/server";
import { Database } from "@/types/database.types";
export type config_ubicaciones = Database["public"]["Tables"]["config_ubicaciones"]["Row"];

export async function getUbicacionesPermitidas(): Promise<config_ubicaciones[]> {
    const supabase = await createServidorClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        console.error("Usuario no autenticado");
        return [];
    }
    const isAdmin = user.user_metadata?.is_admin === true;

    let query = supabase
        .from('config_ubicaciones')
        .select('*')

    if (!isAdmin) {
        query = query.eq("tipo", 'produccion');
    }

    const { data, error } = await query;
    if (error) {
        throw new Error(`Error al consultar las ubicaciones: ${error.message}`);
    }
    return data || [];
}


export type vista_empleado_ubicacion = Database["public"]["Views"]["vista_empleado_ubicacion_chequeo"]["Row"];

export async function getVistaEmpleadoUbicacion(): Promise<vista_empleado_ubicacion[]> {
    const supabase = await createServidorClient();
    let query = supabase
        .from('vista_empleado_ubicacion_chequeo')
        .select('*');

    const { data, error } = await query;
    if (error) {
        throw new Error(`Error al consultar las ubicaciones: ${error.message}`);
    }
    return data || [];
}




