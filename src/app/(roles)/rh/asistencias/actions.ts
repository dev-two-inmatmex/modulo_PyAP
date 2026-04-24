'use server'
import { createServidorClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { Database } from '@/types/database.types';

import { getAsistenciaReporte } from '@/services/asistencias';
import { AsistenciaReporteRow } from '@/services/asistencias';

type confirmarInasistencia = Database['public']['Tables']['registro_inasistencias_confirmadas']['Insert'];

export async function confirmarInasistencia({ id_empleado, capturo, fecha, hora }: confirmarInasistencia) {
  const supabase = await createServidorClient();

  const { error: inasistenciaError } = await supabase.from('registro_inasistencias_confirmadas').insert({
    id_empleado: id_empleado,
    capturo: capturo,
    fecha: fecha,
    hora: hora,
  });
  if (inasistenciaError) {
    console.error("Error al registrar inasistencia:", inasistenciaError);
    return { error: `Error al registrar inasistencia ${inasistenciaError?.message}.` };
  }
  return { success: `Se ha registrado la inasistencia con éxito.` };
}


export async function fetchAsistenciaReporteAction(
  fechaInicio: string,
  fechaFin: string,
) {
  const supabase = await createServidorClient();

  const { data, error } = await supabase
    .from('asistencia_diaria')
    .select('*')
    .gte('fecha', fechaInicio)
    .lte('fecha', fechaFin);

  // ...
  if (error) {
    console.error("Server Action Error fetching attendance report:", error);
  }
  return data;
}

import { getVistaEmpleadosEmpresa } from "@/services/empleados";

export async function fetchEmpleadosReporteAction(empresaId: number | null) {
  const empleados = await getVistaEmpleadosEmpresa(undefined, empresaId || undefined);
  return empleados;
}


export async function responderSolicitudAsistenciaTardia(
  solicitudId: number,
  hora_aceptacion: string,
  aceptar: boolean,
  faceDescriptor: number[]|null,
) {
  const supabase = await createServidorClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { success: false, message: "No se pudo autenticar al autorizador." };
  }

  // 1. Verificación biométrica usando la función RPC
  if (!faceDescriptor || faceDescriptor.length === 0) {
    return { success: false, message: "Se requiere escaneo facial para autorizar." };
  }

  const { data: biometricResult, error: rpcError } = await supabase.rpc('verificar_identidad_biometrica', {
    id_empleado_param: user.id, // Verificamos la identidad de quien está logueado
    descriptor_param: faceDescriptor
  });

  if (rpcError) {
    console.error("Error en RPC de biometría:", rpcError);
    return { success: false, message: "Error en el servidor de biometría." };
  }

  const score = biometricResult as number;
  // Usamos el mismo umbral que en el checador para consistencia
  if (score > 0.55) {
    return { success: false, message: `Identidad no verificada. Su rostro no coincide (Score: ${score.toFixed(4)})` };
  }

  // 2. Si la verificación es exitosa, actualizamos la solicitud
  const { error: updateError } = await supabase
    .from("registro_solicitud_asistencia_30min_despues")
    .update({
      aceptar_asistencia_tardia: aceptar,
      id_autorizador: user.id,
      hora_aceptacion: hora_aceptacion,
    })
    .eq("id", solicitudId);

  if (updateError) {
    console.error("Error al actualizar la solicitud:", updateError);
    return { success: false, message: "Error al guardar la respuesta." };
  }

  return { success: true, message: `Solicitud ${aceptar ? 'aprobada' : 'denegada'} correctamente.` };
}
