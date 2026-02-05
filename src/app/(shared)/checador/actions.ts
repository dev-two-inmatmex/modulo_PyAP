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
        .select("id")
        .eq("id_empleado", user.id)
        .eq("fecha", today);

    if (findError) {
        console.error("Error finding check-in records:", findError);
        return { error: "Error al buscar registros existentes." };
    }

    const numRecords = todaysRecords?.length || 0;

    // Business logic for checking order of actions based on record count
    if (action === 'entrada' && numRecords > 0) {
        return { error: "Ya has registrado tu entrada hoy." };
    }
     if (action !== 'entrada' && numRecords === 0) {
        return { error: "Debes registrar tu entrada primero." };
    }
    if (action === 'salida_descanso' && numRecords !== 1) {
        return { error: "Debes registrar tu entrada para poder salir a descanso." };
    }
    if (action === 'regreso_descanso' && numRecords !== 2) {
        return { error: "Debes registrar tu salida a descanso para poder regresar." };
    }
    if (action === 'salida' && numRecords !== 3) {
        return { error: "Debes registrar tu regreso de descanso para poder registrar tu salida." };
    }
    if (numRecords >= 4) {
        return { error: "Ya has completado todos tus registros del día." };
    }

    // Insert the new record
    const { error: insertError } = await supabase.from("registro_checador").insert({
        id_empleado: user.id,
        fecha: today,
        registro: timeNow // This is the time of the event
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