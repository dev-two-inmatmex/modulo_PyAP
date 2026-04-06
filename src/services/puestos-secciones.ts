import { createServidorClient } from "@/lib/supabase/server";
import { Database } from "@/types/database.types";

export type puestos = Database["public"]["Tables"]["puestos"]["Row"];
export type secciones = Database["public"]["Tables"]["jerarquia"]["Row"];


export async function getPuestos(): Promise<puestos[]> {
    const supabase = await createServidorClient();
    let query = supabase
    .from('puestos')
    .select('*');
    const { data, error } = await query;

    if (error) {
        throw new Error(`Error al consultar los puestos ${error.message}`);
    }
    return data || [];
}

export async function getSecciones(): Promise<secciones[]> {
    const supabase = await createServidorClient();
    let query = supabase
    .from('jerarquia')
    .select('*');;
    const { data, error } = await query;

    if (error) {
        throw new Error(`Error al consultar las secciones ${error.message}`);
    }
    return data || [];
}