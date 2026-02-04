'use server'

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { TurnoUsuario } from "@/lib/types";

type ChequeoAction = 'entrada' | 'salida_descanso' | 'regreso_descanso' | 'salida';

export async function registrarChequeo(action: ChequeoAction) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Usuario no autenticado.");
    }

    const today = new Date().toISOString().split('T')[0];
    const now = new Date().toISOString();

    const { data: latestTurno, error: findError } = await supabase
        .from("registro_checador")
        .select("*")
        .eq("id_empleado", user.id)
        .eq("fecha", today)
        .order("entrada", { ascending: false })
        .limit(1)
        .maybeSingle<TurnoUsuario>();

    if (findError) {
        console.error("Error finding turno:", findError);
        return { error: "Error al buscar el turno." };
    }

    if (action === 'entrada') {
        if (latestTurno) {
            return { error: "Ya has registrado tu entrada hoy." };
        }

        const { error } = await supabase.from("usuarios_turnos").insert({
            id_usuario: user.id,
            fecha: today,
            entrada: now,
        });

        if (error) {
            console.error("Error inserting entrada:", error);
            return { error: "Error al registrar la entrada." };
        }
    } else {
        if (!latestTurno) {
            return { error: "Debes registrar tu entrada primero." };
        }

        const { error } = await supabase
            .from("usuarios_turnos")
            .update({ [action]: now })
            .eq("id", latestTurno.id);
        
        if (error) {
            console.error(`Error updating ${action}:`, error);
            return { error: `Error al registrar ${action}.` };
        }
    }

    revalidatePath('/checador');
    return { success: `Se ha registrado tu ${action} con éxito.` };
}
