/*'use server';

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
}*/
'use server';

import { createServidorClient } from "@/lib/supabase/server";// Ajusta el path según tu proyecto
import { revalidatePath } from "next/cache";

// Tipo auxiliar para procesar el objeto del cliente
type SemanaConfig = Record<string, string>;

// Utilidad para convertir el valor del Select ("descanso" o "1") a un número válido o null
const procesarValorDia = (valor: string): number | null => {
  return (valor === "descanso" || valor === "") ? null : Number(valor);
};

export async function guardarTurnosSemana(
  empleadoId: string,
  turnos: SemanaConfig,
  fechaActual: string,
  horaActual: string,
  fechaEfectiva: string
) {
  const supabase = await createServidorClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) return { error: "No estás autenticado." };

  const payloadInsert = {
    id_empleado: empleadoId,
    fecha: fechaActual,
    hora: horaActual,
    ejecutar_a_partir_de: fechaEfectiva,
    id_capturista: user.id,
    lunes: procesarValorDia(turnos.lunes),
    martes: procesarValorDia(turnos.martes),
    miercoles: procesarValorDia(turnos.miercoles),
    jueves: procesarValorDia(turnos.jueves),
    viernes: procesarValorDia(turnos.viernes),
    sabado: procesarValorDia(turnos.sabado),
    domingo: procesarValorDia(turnos.domingo),
  };

  const { error } = await supabase
    .from('empleados_turno_horarios')
    .insert(payloadInsert);

  if (error) {
    return { error: `Error al guardar los horarios: ${error.message}` };
  }

  revalidatePath('/(roles)/rh/horarios', 'page');
  return { success: "¡Turnos actualizados correctamente!" };
}

export async function guardarDescansosSemana(
  empleadoId: string,
  descansos: SemanaConfig,
  fechaActual: string,
  horaActual: string,
  fechaEfectiva: string
) {
  const supabase = await createServidorClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) return { error: "No estás autenticado." };

  const payloadInsert = {
    id_empleado: empleadoId,
    fecha: fechaActual,
    hora: horaActual,
    ejecutar_a_partir_de: fechaEfectiva,
    id_capturista: user.id, 
    lunes: procesarValorDia(descansos.lunes),
    martes: procesarValorDia(descansos.martes),
    miercoles: procesarValorDia(descansos.miercoles),
    jueves: procesarValorDia(descansos.jueves),
    viernes: procesarValorDia(descansos.viernes),
    sabado: procesarValorDia(descansos.sabado),
    domingo: procesarValorDia(descansos.domingo),
  };

  const { error } = await supabase
    .from('empleados_turno_descansos')
    .insert(payloadInsert);

  if (error) {
    return { error: `Error al guardar los descansos: ${error.message}` };
  }

  revalidatePath('/(roles)/rh/horarios', 'page');
  return { success: "¡Descansos actualizados correctamente!" };
}

import { getIdsConfiguracionActual } from "@/services/horarios";

export async function asignarDiasLibres(
  empleadoId: string,
  diasLibresSeleccionados: string[], // Ej: ['lunes', 'domingo']
  fechaActual: string,
  horaActual: string
) {
  const supabase = await createServidorClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) return { error: "No estás autenticado." };

  // 1. Obtenemos cómo está su semana HOY (para no borrarle sus otros días)
  const configuracionActual = await getIdsConfiguracionActual(empleadoId);
  const turnosActuales = configuracionActual.turnos || {};
  const descansosActuales = configuracionActual.descansos || {};

  // 2. Preparamos los objetos copiando lo actual
  const nuevosTurnos = { ...turnosActuales };
  const nuevosDescansos = { ...descansosActuales };

  // 3. Aplicamos el Día Libre (null) a los días seleccionados
  diasLibresSeleccionados.forEach(dia => {
    nuevosTurnos[dia] = null;
    nuevosDescansos[dia] = null;
  });

  // 4. Insertamos en ambas tablas
  const basePayload = {
    id_empleado: empleadoId,
    fecha: fechaActual,
    hora: horaActual,
    ejecutar_a_partir_de: fechaActual,
    id_capturista: user.id,
  };

  const payloadTurnos = {
    ...basePayload,
    lunes: nuevosTurnos.lunes, martes: nuevosTurnos.martes, miercoles: nuevosTurnos.miercoles,
    jueves: nuevosTurnos.jueves, viernes: nuevosTurnos.viernes, sabado: nuevosTurnos.sabado, domingo: nuevosTurnos.domingo
  };

  const payloadDescansos = {
    ...basePayload,
    lunes: nuevosDescansos.lunes, martes: nuevosDescansos.martes, miercoles: nuevosDescansos.miercoles,
    jueves: nuevosDescansos.jueves, viernes: nuevosDescansos.viernes, sabado: nuevosDescansos.sabado, domingo: nuevosDescansos.domingo
  };

  // Ejecutamos ambas inserciones al mismo tiempo (Promesas en paralelo)
  const [resTurnos, resDescansos] = await Promise.all([
    supabase.from('empleados_turno_horarios').insert(payloadTurnos),
    supabase.from('empleados_turno_descansos').insert(payloadDescansos)
  ]);

  if (resTurnos.error || resDescansos.error) {
    return { error: "Hubo un problema al aplicar los días libres." };
  }

  revalidatePath('/(roles)/rh/horarios', 'page');
  return { success: "Días libres asignados correctamente." };
}