'use server'

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

type ChequeoAction = 'entrada' | 'salida_descanso' | 'regreso_descanso' | 'salida';

export async function registrarChequeo(action: ChequeoAction) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Usuario no autenticado.");
    }

    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    // Format to HH:MM:SS
    const timeNow = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

    // Check for existing records for today to validate the action
    const { data: todaysRecords, error: findError } = await supabase
        .from("registro_checador")
        .select("tipo")
        .eq("id_empleado", user.id)
        .eq("fecha", today);

    if (findError) {
        console.error("Error finding check-in records:", findError);
        return { error: "Error al buscar registros existentes." };
    }

    const existingActions = todaysRecords.map(r => r.tipo);

    // Business logic for checking order of actions
    if (action === 'entrada' && existingActions.includes('entrada')) {
        return { error: "Ya has registrado tu entrada hoy." };
    }
    if (action !== 'entrada' && !existingActions.includes('entrada')) {
        return { error: "Debes registrar tu entrada primero." };
    }
    if (action === 'salida_descanso' && existingActions.includes('salida_descanso')) {
        return { error: "Ya has registrado tu salida a descanso." };
    }
     if (action === 'regreso_descanso' && !existingActions.includes('salida_descanso')) {
        return { error: "Debes registrar tu salida a descanso primero." };
    }
    if (action === 'regreso_descanso' && existingActions.includes('regreso_descanso')) {
         return { error: "Ya has registrado tu regreso de descanso." };
    }
    if (action === 'salida' && !existingActions.includes('regreso_descanso')) {
        // This check assumes a break is mandatory before clocking out for the day.
        // If not, you might want to check for 'entrada' instead.
        return { error: "Debes registrar tu regreso de descanso primero." };
    }
    if (action === 'salida' && existingActions.includes('salida')) {
        return { error: "Ya has registrado tu salida." };
    }

    // Insert the new record assuming a `tipo` column exists
    const { error: insertError } = await supabase.from("registro_checador").insert({
        id_empleado: user.id,
        fecha: today,
        registro: timeNow, // This is the time of the event
        tipo: action      // This is the type of event
    });

    if (insertError) {
        console.error(`Error inserting ${action}:`, insertError);
        return { error: `Error al registrar ${action}.` };
    }

    revalidatePath('/checador');
    return { success: `Se ha registrado tu ${action} con éxito.` };
}
