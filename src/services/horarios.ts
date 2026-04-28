"use server"
import { createServidorClient } from "@/lib/supabase/server";
import { Database } from "@/types/database.types";
export type empleados_turno_horarios = Database["public"]["Tables"]["empleados_turno_horarios"]["Row"];
export async function getHorariosSemanal(){
  const supabase = await createServidorClient();

  let query = supabase
  .from('empleados_turno_horarios')
  .select(`
    id_empleado,
    lunes:horarios!empleados_turno_horarios_lunes_fkey(hora_entrada, hora_salida),
    martes:horarios!empleados_turno_horarios_martes_fkey(hora_entrada, hora_salida),
    miercoles:horarios!empleados_turno_horarios_miercoles_fkey(hora_entrada, hora_salida),
    jueves:horarios!empleados_turno_horarios_jueves_fkey(hora_entrada, hora_salida),
    viernes:horarios!empleados_turno_horarios_viernes_fkey(hora_entrada, hora_salida),
    sabado:horarios!empleados_turno_horarios_sabado_fkey(hora_entrada, hora_salida),
    domingo:horarios!empleados_turno_horarios_domingo_fkey(hora_entrada, hora_salida)
  `)
  .order('ejecutar_a_partir_de', { ascending: false })
  .order('hora', { ascending: false });

  const { data, error } = await query;
  if (error) {
    throw new Error(`Error al consultar la vista de horarios de empleados: ${error.message}`);
  }
  return data || [];
}


type empleados_turno_descansos = Database["public"]["Tables"]["empleados_turno_descansos"]["Row"];

export async function getDescansosSemanal(){
  const supabase = await createServidorClient();

  let query = supabase
  .from('empleados_turno_descansos')
  .select(`
      id_empleado,
      lunes:descansos!empleados_turno_descansos_lunes_fkey(inicio_descanso, fin_descanso),
      martes:descansos!empleados_turno_descansos_martes_fkey(inicio_descanso, fin_descanso),
      miercoles:descansos!empleados_turno_descansos_miercoles_fkey(inicio_descanso, fin_descanso),
      jueves:descansos!empleados_turno_descansos_jueves_fkey(inicio_descanso, fin_descanso),
      viernes:descansos!empleados_turno_descansos_viernes_fkey(inicio_descanso, fin_descanso),
      sabado:descansos!empleados_turno_descansos_sabado_fkey(inicio_descanso, fin_descanso),
      domingo:descansos!empleados_turno_descansos_domingo_fkey(inicio_descanso, fin_descanso)
    `)
    .order('ejecutar_a_partir_de', { ascending: false })

  const { data, error } = await query;
  if (error) {
    throw new Error(`Error al consultar la vista de descansos de empleados: ${error.message}`);
  }
  return data || [];
}


export async function getIdsConfiguracionActual(empleadoId: string) {
  const supabase = await createServidorClient();

  // Traemos el último turno registrado
  const { data: turno } = await supabase
    .from('empleados_turno_horarios')
    .select('lunes, martes, miercoles, jueves, viernes, sabado, domingo')
    .eq('id_empleado', empleadoId)
    .order('ejecutar_a_partir_de', { ascending: false })
    .order('hora', { ascending: false })
    .limit(1)
    .single();

  // Traemos el último descanso registrado
  const { data: descanso } = await supabase
    .from('empleados_turno_descansos')
    .select('lunes, martes, miercoles, jueves, viernes, sabado, domingo')
    .eq('id_empleado', empleadoId)
    .order('ejecutar_a_partir_de', { ascending: false })
    .order('hora', { ascending: false })
    .limit(1)
    .single();

  return { 
    turnos: turno || null, 
    descansos: descanso || null 
  };
}












export type DiaSemana = 'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes' | 'sabado' | 'domingo';

export interface AsignacionDia {
  id_horario: number | null;
  id_descanso: number | null;
}

// HorarioDraft es un objeto que forzosamente tiene los 7 días de la semana, 
// y cada día contiene su id_horario y id_descanso (o null si es día libre).
export type HorarioDraft = Record<DiaSemana, AsignacionDia>;


// ==========================================
// 2. FUNCIONES DE CATÁLOGOS
// ==========================================

// Obtiene las opciones para el Select de Horarios
export async function getOpcionesHorarios() {
  const supabase = await createServidorClient();
  const { data, error } = await supabase.from('horarios').select('*').order('id');

  if (error) {
    console.error("Error al obtener horarios:", error);
    return [];
  }

  return (data || []).map(h => ({
    id: Number(h.id),
    nombre: h.tipo ? h.tipo.toUpperCase() : 'General', // Ej. "PRODUCCION"
    entrada: h.hora_entrada ? h.hora_entrada.substring(0, 5) : '--:--',
    salida: h.hora_salida ? h.hora_salida.substring(0, 5) : '--:--'
  }));
}

// Obtiene las opciones para el Select de Descansos/Comidas
export async function getOpcionesDescansos() {
  const supabase = await createServidorClient();
  const { data, error } = await supabase.from('descansos').select('*').order('id');

  if (error) {
    console.error("Error al obtener descansos:", error);
    return [];
  }

  return (data || []).map(d => ({
    id: Number(d.id),
    nombre: `Turno ${d.id}`,
    inicio: d.inicio_descanso ? d.inicio_descanso.substring(0, 5) : '--:--',
    fin: d.fin_descanso ? d.fin_descanso.substring(0, 5) : '--:--'
  }));
}


// Obtiene el horario ACTUAL del empleado desde `empleado_turno` y lo formatea como un HorarioDraft
/*export async function getHorarioBaseActualEmpleado(empleadoId: string | null): Promise<HorarioDraft> {
  const supabase = await createServidorClient();

  // Plantilla en blanco (Asume por defecto que descansa toda la semana)
  const horarioBase: HorarioDraft = {
    lunes: { id_horario: null, id_descanso: null },
    martes: { id_horario: null, id_descanso: null },
    miercoles: { id_horario: null, id_descanso: null },
    jueves: { id_horario: null, id_descanso: null },
    viernes: { id_horario: null, id_descanso: null },
    sabado: { id_horario: null, id_descanso: null },
    domingo: { id_horario: null, id_descanso: null },
  };

  const { data, error } = await supabase
    .from('empleado_turno')
    .select('*')
    .eq('id_empleado', empleadoId);

  if (error) {
    console.error("Error al obtener el horario base del empleado:", error);
    return horarioBase;
  }

  if (!error && data) {
    const diasSemana: DiaSemana[] = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];

    // Recorremos todas las filas en la BD de este empleado
    data.forEach((filaTurno: any) => {
      diasSemana.forEach(dia => {
        // Si el día está marcado como 'true', lo asignamos al "Draft"
        if (filaTurno[dia] === true) {
          horarioBase[dia] = {
            id_horario: filaTurno.id_horario ? Number(filaTurno.id_horario) : null,
            id_descanso: filaTurno.id_descanso ? Number(filaTurno.id_descanso) : null
          };
        }
      });
    });
  }

  return horarioBase;
}*/

export type Horarios = Database["public"]["Tables"]["horarios"]["Row"];
export async function getHorarios(): Promise<Horarios[]> {
  const supabase = await createServidorClient();

  let query = supabase
    .from('horarios')
    .select('*')
    .order('hora_entrada');

  const { data, error } = await query;

  if (error) {
    throw new Error(`Error al consultar los horarios: ${error.message}`);
  }
  return data || [];
}

export type Descansos = Database["public"]["Tables"]["descansos"]["Row"]
export async function getDescansos(): Promise<Descansos[]> {
  const supabase = await createServidorClient();

  let query = supabase
    .from('descansos')
    .select('*')
    .order('inicio_descanso');

  const { data, error } = await query;

  if (error) {
    throw new Error(`Error al consultar los descansos: ${error.message}`);
  }
  return data || [];
}


export type Empleados_horarios = Database["public"]["Tables"]["empleados_turno_horarios"]["Row"];

export async function getHorarioHoyUser(
  diaActual: string,
)/*: Promise<Empleados_horarios[]> */ {
  const supabase = await createServidorClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Usuario no autenticado.");
  }

  let query = supabase
    .from('empleados_turno_horarios')
    .select(`${diaActual}:horarios!empleados_turno_horarios_${diaActual}_fkey (
      hora_entrada,
      hora_salida
    )`)
    .eq('id_empleado', user.id)
    .lte('ejecutar_a_partir_de', new Date().toISOString())
    .order('ejecutar_a_partir_de', { ascending: false })
    .limit(1)
    .single();
  const { data, error } = await query;
  if (error) {
    throw new Error(`Error al consultar la vista de horarios de empleados: ${error.message}`);
  }
  return data || [];
}

export async function getHorariosHoy(
  diaActual: string,
) {
  const supabase = await createServidorClient();
  
  // 1. Agregamos "as any" al final del string del select para evitar el ParserError
  const query = supabase
    .from('empleados_turno_horarios')
    .select(`
      id_empleado,
      ejecutar_a_partir_de,
      ${diaActual}:horarios!empleados_turno_horarios_${diaActual}_fkey (
        hora_entrada,
        hora_salida
      )
    ` as any)
    .lte('ejecutar_a_partir_de', new Date().toISOString())
    .order('ejecutar_a_partir_de', { ascending: false });

  const { data, error } = await query;
  
  if (error) {
    throw new Error(`Error al consultar los horarios de empleados: ${error.message}`);
  }

  const horariosActivos = [];
  const empleadosProcesados = new Set();

  // 2. Le indicamos a TypeScript que data es un arreglo (as any[])
  for (const registro of (data as any[] || [])) {
    if (!empleadosProcesados.has(registro.id_empleado)) {
      horariosActivos.push(registro);
      empleadosProcesados.add(registro.id_empleado);
    }
  }

  return horariosActivos;
}


export type Empleados_descansos = Database["public"]["Tables"]["empleados_turno_descansos"]["Row"];

export async function getDescansoHoyUser(
  diaActual: string,
) {
  const supabase = await createServidorClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Usuario no autenticado.");
  }

  let query = supabase
    .from('empleados_turno_descansos')
    .select(`${diaActual}:descansos!empleados_turno_descansos_${diaActual}_fkey (
      inicio_descanso,
      fin_descanso
    )`)
    .eq('id_empleado', user.id)
    .lte('ejecutar_a_partir_de', new Date().toISOString())
    .order('ejecutar_a_partir_de', { ascending: false })
    .limit(1)
    .single();
  const { data, error } = await query;
  if (error) {
    throw new Error(`Error al consultar la vista de descansos de empleados: ${error.message}`);
  }
  return data || [];
}

export type Empleado_asignacion_horas_extra = Database["public"]["Tables"]["registro_asignacion_horas_extra"]["Row"];

export async function getHorasExtra(
  fecha?: string | null,
  id_empleado?: string | null,
): Promise<Empleado_asignacion_horas_extra[]> {
  const supabase = await createServidorClient();
  let query = supabase
    .from('registro_asignacion_horas_extra')
    .select('*');

  if (fecha) {
    query = query.eq('dia_asignado', fecha);
  }
  if (id_empleado) {
    query = query.eq('id_empleado', id_empleado);
  }
  const { data, error } = await query;
  if (error) {
    throw new Error(`Error al consultar la vista de horas extra de empleados: ${error.message}`);
  }
  return data || [];
}






