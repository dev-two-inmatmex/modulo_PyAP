'use server'

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { calcularDistanciaMetros } from '@/utils/geo';

type ChequeoAction = 'entrada' | 'salida_descanso' | 'regreso_descanso' | 'salida';

export async function registrarChequeo(
    action: ChequeoAction,
    dateWithTimezone: string,
    timeWithoutTimezone: string,
    latitude: number,
    longitude: number,
    accuracy: number,
    faceDescriptor?: number[],
    turnoEntrada?: string | null,
    turnoRegresoDescanso?: string | null,
    turnoSalida?: string | null
) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Usuario no autenticado.");
    }

    // Biometric Validation via RPC
    if (!faceDescriptor) {
        return { error: "No se proporcionó información biométrica." };
    }
    const { data: biometricResult, error: rpcError } = await supabase.rpc('verificar_identidad_biometrica', {
        id_empleado_param: user.id,
        descriptor_param: faceDescriptor
    });
    if (rpcError || biometricResult === null) {
        console.error('Biometric RPC Error:', rpcError);
        return { error: "Error en el servidor de biometría." };
    }

    console.log('distancia biometrica:', biometricResult);
    const score = biometricResult as number;
    if (biometricResult > 0.38) { // Umbral para distancia de Coseno
        return { error: `Identidad no verificada. (Score: ${score.toFixed(4)})` };
    }

    const { data: ubicacion, error: ubicacionError } = await supabase
        .from('vista_empleado_ubicacion_chequeo')
        .select('latitud, longitud, radio_permitido')
        .eq('id', user.id)
        .single();

    if (ubicacionError) {
        console.error("Error fetching location:", ubicacionError);
        return { error: "No se pudo verificar la ubicación del empleado." };
    }

    if (!ubicacion) {
        return { error: "No tienes una ubicación de chequeo asignada." };
    }

    const distancia = calcularDistanciaMetros(latitude, longitude, ubicacion.latitud, ubicacion.longitud);

    if (distancia > ubicacion.radio_permitido) {
        return { error: `Estás a ${distancia.toFixed(0)} metros de tu ubicación de chequeo. No puedes registrar.` };
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
        revalidatePath('/checador');
        return { error: "Ya has registrado tu entrada hoy." };
    }
    if (action === 'salida_descanso' && lastAction !== 'entrada') {
        revalidatePath('/checador');
        return { error: "Debes registrar tu entrada para poder salir a descanso." };
    }
    if (action === 'regreso_descanso' && lastAction !== 'salida_descanso') {
        revalidatePath('/checador');
        return { error: "Debes registrar tu salida a descanso para poder regresar." };
    }

    if (action === 'salida') {
        if (!lastAction) {
            return { error: "Debes registrar tu entrada antes de registrar tu salida." };}
        if (lastAction === 'salida') {
            return { error: "Ya has completado todos tus registros del día." };
        }
        revalidatePath('/checador');
    }

    let estatus_puntualidad = null;

    const calcularDiffMinutos = (horaRegistro: string, horaEsperada: string) => {
        const [regH, regM] = horaRegistro.split(':').map(Number);
        const [espH, espM] = horaEsperada.split(':').map(Number);
        let diffMinutes = (regH * 60 + regM) - (espH * 60 + espM);

        if (diffMinutes > 12 * 60) diffMinutes -= 24 * 60;
        if (diffMinutes < -12 * 60) diffMinutes += 24 * 60;
        return diffMinutes;
    };

    if (action === 'entrada' && turnoEntrada) {
        const diff = calcularDiffMinutos(timeWithoutTimezone, turnoEntrada);
        if (diff <= 0) estatus_puntualidad = "Puntual";
        else if (diff <= 10) estatus_puntualidad = "Retraso Leve";
        else estatus_puntualidad = "Retraso Grave";

    } else if (action === 'regreso_descanso' && turnoRegresoDescanso) {
        const diff = calcularDiffMinutos(timeWithoutTimezone, turnoRegresoDescanso);
        if (diff <= 0) estatus_puntualidad = "Puntual";
        else if (diff <= 10) estatus_puntualidad = "Retraso Leve";
        else estatus_puntualidad = "Retraso Grave";

    } else if (action === 'salida' && turnoSalida) {
        const diff = calcularDiffMinutos(timeWithoutTimezone, turnoSalida);
        // Si los minutos son negativos, significa que salió antes de su hora oficial
        if (diff < 0) {
            estatus_puntualidad = "Salida Anticipada";
        } else {
            estatus_puntualidad = "Puntual";
        }
    }

    // Insert the new record
    const { error: insertError } = await supabase.from("registro_checador").insert({
        id_empleado: user.id,
        fecha: today,
        registro: timeWithoutTimezone,
        tipo_registro: action,
        latitud: latitude,
        longitud: longitude,
        exactitud_geografica: accuracy,
        estatus_puntualidad: estatus_puntualidad
    });

    if (insertError) {
        console.error(`Error inserting ${action}:`, insertError);
        const friendlyAction = action.replace(/_/g, ' ');
        revalidatePath('/checador');
        return { error: `Error al registrar ${friendlyAction}.` };
    }

    const friendlyAction = action.replace(/_/g, ' ');
    revalidatePath('/checador');
    return { success: `Se ha registrado tu ${friendlyAction} con éxito.` };
}