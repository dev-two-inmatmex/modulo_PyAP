'use server'

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { calcularDistanciaMetros } from '@/lib/geo';

type ChequeoAction = 'entrada' | 'salida_descanso' | 'regreso_descanso' | 'salida';

export async function registrarChequeo(
    action: ChequeoAction,
    dateWithTimezone: string,
    timeWithoutTimezone: string,
    latitude: number,
    longitude: number,
    accuracy: number,
    faceDescriptor?: number[],
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

    /*const { data: biometricResult, error: rpcError } = await supabase.rpc('verificar_identidad_biometrica', {
        id_empleado_param: user.id,
        descriptor_param: faceDescriptor
    });

    if (rpcError || !biometricResult) {
        console.error('Biometric RPC Error:', rpcError);
        return { error: "Identidad facial no verificada. Intente de nuevo." };
    }*/
    const { data: biometricResult, error: rpcError } = await supabase.rpc('verificar_identidad_biometrica', {
        id_empleado_param: user.id,
        descriptor_param: faceDescriptor
    });
    if (rpcError || biometricResult === null) {
        console.error('Biometric RPC Error:', rpcError);
        return { error: "Error en el servidor de biometría." };
    }
    console.log('distancia biometrica:', biometricResult);
    /*if (biometricResult>=0.6){
        return {error: `Identidad no verificada. (Distancia: ${biometricResult.toFixed(4)})` };
    }*/
    const score = biometricResult as number;
    if (biometricResult > 3.5) { // Umbral para distancia de Coseno
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
        tipo_registro: action,
        latitud: latitude,
        longitud: longitude,
        exactitud_geografica: accuracy,
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