'use server'

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

type ChequeoAction = 'entrada' | 'salida_descanso' | 'regreso_descanso' | 'salida';

export async function registrarChequeo(action: ChequeoAction, dateWithTimezone: string, timeWithoutTimezone: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Usuario no autenticado.");
    }

    const today = dateWithTimezone;

    // Find latest record for today to validate the action
    const { data: latestRecord, error: findError } = await supabase
        .from("registro_checador")
        .select("tipo_registro")
        .eq("id_empleado", user.id)
        .eq("fecha", today)
        .order("registro", { ascending: false })
        .limit(1)
        .maybeSingle();

    if (findError) {
        console.error("Error finding latest check-in record:", findError);
        return { error: "Error al buscar registros existentes." };
    }

    const lastAction = latestRecord?.tipo_registro;

    // Business logic for checking order of actions
    if (action === 'entrada' && lastAction) {
        return { error: "Ya has registrado tu entrada hoy." };
    }
    if (action === 'salida_descanso' && lastAction !== 'entrada') {
        return { error: "Debes registrar tu entrada para poder salir a descanso." };
    }
    if (action === 'regreso_descanso' && lastAction !== 'salida_descanso') {
        return { error: "Debes registrar tu salida a descanso para poder regresar." };
    }
    if (action === 'salida' && lastAction !== 'regreso_descanso') {
        return { error: "Debes registrar tu regreso de descanso para poder registrar tu salida." };
    }
    if (lastAction === 'salida') {
        return { error: "Ya has completado todos tus registros del día." };
    }

    // Insert the new record
    const { error: insertError } = await supabase.from("registro_checador").insert({
        id_empleado: user.id,
        fecha: today,
        registro: timeWithoutTimezone,
        tipo_registro: action
    });

    if (insertError) {
        console.error(`Error inserting ${action}:`, insertError);
        const friendlyAction = action.replace(/_/g, ' ');
        return { error: `Error al registrar ${friendlyAction}.` };
    }

    const friendlyAction = action.replace(/_/g, ' ');
    revalidatePath('/checador');
    return { success: `Se ha registrado tu ${friendlyAction} con éxito.` };
}