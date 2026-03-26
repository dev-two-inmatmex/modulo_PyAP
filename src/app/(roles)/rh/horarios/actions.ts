'use server';

import { createServidorClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { HorarioDraft, DiaSemana } from "@/services/horarios";

export async function guardarNuevoHorario(
  empleadoId: string,
  horarioDraft: HorarioDraft
) {
  const supabase = await createServidorClient();

  // 1. Obtener el usuario autenticado (el gerente de RH que está haciendo el cambio)
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "No estás autenticado para realizar esta acción." };
  }

  // 2. AGRUPACIÓN INTELIGENTE: Convertimos el "Draft" visual al formato de la BD
  const turnosAgrupados: Record<string, any> = {};

  // Iteramos sobre los 7 días que nos manda el Modal
  (Object.entries(horarioDraft) as [DiaSemana, { id_horario: number | null; id_descanso: number | null }][]).forEach(([dia, asignacion]) => {
    
    // Si el día es libre (no tiene horario), lo ignoramos para no crear filas vacías
    if (!asignacion.id_horario) return;

    // Creamos una "llave" única combinando el ID del horario y el ID del descanso (Ej: "1-2" o "3-null")
    const key = `${asignacion.id_horario}-${asignacion.id_descanso}`;

    // Si este bloque de horario/descanso aún no existe en nuestro objeto, lo creamos
    if (!turnosAgrupados[key]) {
      turnosAgrupados[key] = {
        id_empleado: empleadoId,
        id_horario: asignacion.id_horario,
        id_descanso: asignacion.id_descanso,
        lunes: false, martes: false, miercoles: false, jueves: false, viernes: false, sabado: false, domingo: false
      };
    }
    
    // Marcamos el día actual como TRUE dentro de su grupo correspondiente
    turnosAgrupados[key][dia] = true;
  });

  // Convertimos el objeto en un arreglo listo para insertarse en Supabase
  const filasAInsertar = Object.values(turnosAgrupados);

  // 3. TRANSACCIÓN EN LA BASE DE DATOS
  
  // A. Borramos TODOS los turnos anteriores de este empleado (Limpieza total)
  const { error: deleteError } = await supabase
    .from('empleado_turno')
    .delete()
    .eq('id_empleado', empleadoId);
    
  if (deleteError) {
    return { error: `Error al limpiar el horario anterior: ${deleteError.message}` };
  }

  // B. Insertamos las nuevas filas agrupadas (Si es que no le asignaron toda la semana libre)
  if (filasAInsertar.length > 0) {
    const { error: insertError } = await supabase
      .from('empleado_turno')
      .insert(filasAInsertar);
      
    if (insertError) {
      return { error: `Error al guardar los nuevos turnos: ${insertError.message}` };
    }
  }

  // C. Guardamos la evidencia en la tabla de auditoría
  const { error: auditError } = await supabase
    .from('registro_empleado_cambio_turno')
    .insert({
      id_empleado: empleadoId,
      modificado_por: user.id, // El UUID del usuario de Supabase Auth
      nuevo_horario: horarioDraft as any // Guardamos el JSON de los 7 días tal cual llegó
    });

  if (auditError) {
    // Si falla la auditoría, lo imprimimos en la consola del servidor (IDX),
    // pero no bloqueamos el éxito de la operación para el usuario final.
    console.error("⚠️ Error crítico al guardar en auditoría:", auditError);
    return { error: `Error en la tabla de auditoría: ${auditError.message}` };
  }

  // 4. RECARGAR LA PÁGINA
  // Esto hace que Next.js limpie la caché y vuelva a dibujar la tabla principal con los nuevos datos
  revalidatePath('/rh/horarios'); // 👈 Asegúrate de que esta sea la ruta correcta de tu página de horarios
  
  return { success: "¡Horario actualizado y registrado en auditoría exitosamente!" };
}