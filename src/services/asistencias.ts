import { createClient } from '@/lib/supabase/server';

/*export interface DetalleEmpleadoEntrada {
  empleado_id: string;
  nombre_completos: string;
}

export interface GrupoHoraEntrada {
  entrada: string;
  total_personas: number;
  detalles_empleados: DetalleEmpleadoEntrada[];
}*/

/**
 * Obtiene y agrupa a los empleados activos por su hora de entrada asignada.
 * Puede filtrar por una empresa específica o traer a todas.
 * * @param id_empresa - (Opcional) El ID de la empresa para filtrar. Si se omite o es nulo, trae todas.
 * @returns Un arreglo de grupos con la hora, el total y los detalles de los empleados.
 */
/*export async function getEmpleadosAgrupadosPorHoraEntrada(id_empresa?: string | number | null): Promise<GrupoHoraEntrada[]> {
  const supabase = await createClient();

  // 1. Construimos la consulta base (trae a todos los empleados activos)
  let query = supabase
    .from('empleados')
    .select(`
      id,
      nombres,
      apellido_paterno,
      id_empresa,
      empleado_estatus!inner ( id_estatus ),
      empleado_turno!inner (
        horarios ( hora_entrada )
      )
    `)
    .eq('empleado_estatus.id_estatus', 1); // Solo estatus 'Activo'

  // 2. Aplicamos el filtro de empresa SOLO si se envió el parámetro
  if (id_empresa) {
    query = query.eq('id_empresa', id_empresa);
  }

  // 3. Ejecutamos la consulta a la base de datos (Un solo viaje de red)
  const { data, error } = await query;

  if (error) {
    throw new Error(`Error al consultar empleados: ${error.message}`);
  }

  if (!data) return [];

  // 4. Agrupamos y transformamos los datos (Equivalente al GROUP BY de SQL)
  const grupos = data.reduce((acumulador, empleado) => {
    
    // Extraemos el turno de forma segura
    const turnos = Array.isArray(empleado.empleado_turno) 
      ? empleado.empleado_turno[0] 
      : empleado.empleado_turno;

    // 👇 AQUÍ ESTÁ LA CORRECCIÓN 👇
    // Extraemos los horarios de forma segura (por si Supabase lo devuelve como arreglo)
    const horarios = Array.isArray(turnos?.horarios) 
      ? turnos.horarios[0] 
      : turnos?.horarios;

    const horaEntrada = horarios?.hora_entrada || 'Sin Horario Asignado';
    // 👆 FIN DE LA CORRECCIÓN 👆

    // Formateamos el nombre
    const primerNombre = empleado.nombres?.split(' ')[0] || '';
    const nombreCompleto = `${primerNombre} ${empleado.apellido_paterno || ''}`.trim();

    // Inicializamos el grupo si no existe
    if (!acumulador[horaEntrada]) {
      acumulador[horaEntrada] = {
        entrada: horaEntrada,
        total_personas: 0,
        detalles_empleados: []
      };
    }

    // Agregamos al empleado y sumamos al contador
    acumulador[horaEntrada].total_personas += 1;
    acumulador[horaEntrada].detalles_empleados.push({
      empleado_id: String(empleado.id),
      nombre_completos: nombreCompleto
    });

    return acumulador;
  }, {} as Record<string, GrupoHoraEntrada>);

  return Object.values(grupos);
}*/

import { Database } from '@/types/database.types';

type GrupoHoraEntradaDB = Database['public']['Views']['vista_empleados_hora_entrada']['Row'];

/**
 * Obtiene y agrupa a los empleados por su hora de entrada y estatus.
 * @param id_empresa - (Opcional) El ID de la empresa para filtrar.
 * @param id_estatus - (Opcional) El ID del estatus (Por defecto es 1: Activo).
 */
export async function getEmpleadosAgrupadosPorHoraEntrada(
  id_empresa?: number | null,
  id_estatus: number = 1 // 👈 Valor por defecto
): Promise<GrupoHoraEntradaDB[]> { 
  
  const supabase = await createClient();

  let query = supabase
    .from('vista_empleados_hora_entrada')
    .select('*')
    .eq('id_estatus', id_estatus); // 👈 Aplicamos el filtro aquí

  if (id_empresa) {
    query = query.eq('id_empresa', id_empresa);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Error al consultar empleados: ${error.message}`);
  }

  return data || [];
}