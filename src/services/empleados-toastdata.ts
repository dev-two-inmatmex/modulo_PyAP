import { createClient } from "@/lib/supabase/client";

import { Database } from "@/types/database.types";
type empleados = Database["public"]["Tables"]["empleados"]["Row"];
export type EmpleadosToast = Pick<empleados, "id" | "nombres" | "apellido_paterno" | "apellido_materno">;

export async function getEmpleadoDatosToast(): Promise<EmpleadosToast[]> {
    const supabase = createClient();

    let query = supabase
        .from('empleados')
        .select('id, nombres, apellido_paterno, apellido_materno');
    const { data, error } = await query;

    if (error) {
        throw new Error(`Error al consultar los empleados: ${error.message}`);
    }

    return data || [];
}