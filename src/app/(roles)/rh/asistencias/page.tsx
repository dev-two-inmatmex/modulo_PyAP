import { createClient } from "@/lib/supabase/server";
import  RelojAsistencia from "@/components/page_components/asistencias/RelojAsistencia";
import { PorcentajeAsistencia } from "@/components/page_components/asistencias/PorcentajeAsistencia";
import { HistogramaAsistencia } from "@/components/page_components/asistencias/HistogramaAsistencia";
import { TablasTurnos } from "@/components/page_components/asistencias/TablasTurnos";
import { getAvatarsMap } from "@/utils/storage";
import { RealtimeAsistencias } from "@/hooks/useRealtimeChecadorRegistros";

export default async function AsistenciasPage() {
  const supabase = await createClient();

  // 1. Fetch de los turnos y empleados esperados para hoy
  const { data: turnos_entrada, error: turnosError } = await supabase
    .from('vista_empleados_hora_entrada')
    .select('entrada, detalles_empleados, total_personas');

  if (turnosError) {
    console.error('Error fetching turnos:', turnosError);
    return <div>Error al cargar los datos de los turnos.</div>;
  }
  const { data: empleadoTurnoRel} = await supabase
    .from("vista_horarios_empleados")
    .select("id, entrada, salida_descanso, regreso_descanso, salida");

    const turnosCompletosMap = (empleadoTurnoRel || []).reduce((acc, curr) => {
      acc[curr.id] = { entrada: curr.entrada, salida: curr.salida, salida_descanso: curr.salida_descanso, regreso_descanso: curr.regreso_descanso };
      return acc;
    }, {} as Record<string, { entrada: string; salida: string; salida_descanso: string; regreso_descanso: string }>);
  
  const todosLosIds = turnos_entrada?.flatMap(turno_entrada => 
    turno_entrada.detalles_empleados.map((emp: any) => emp.empleado_id)
  ) || [];
  const avatarUrls = await getAvatarsMap(todosLosIds);

  const today = new Intl.DateTimeFormat('sv-SE', { 
    timeZone: 'America/Mexico_City',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date());
  const { data: registrosHoy, error: registrosError } = await supabase
    .from('vista_registro_checador_resumida') // <-- TU NUEVA VISTA AQUÍ
    .select('id_empleado, registro, estatus, nombre_ubicacion') // Obtenemos el ID, la hora real y el estatus pre-calculado
    .eq('fecha', today)
    .eq('tipo_registro', 'entrada');
  
  if (registrosError) console.error('Error fetching today records:', registrosError);

  const asistenciasMap = (registrosHoy || []).reduce((acc, curr) => {
    acc[curr.id_empleado] = { hora: curr.registro, estatus: curr.estatus, ubicacion: curr.nombre_ubicacion };
    return acc;
  }, {} as Record<string, { hora: string; estatus: string; ubicacion: string; }>);

  const checkedInCount = registrosHoy?.length || 0;
  const totalEmpleadosHoy = turnos_entrada?.reduce((acc, turno) => acc + turno.total_personas, 0) || 0;
/*<div className="flex-1 space-y-4 p-4 md:p-8 pt-6">*/
  return (
    <div className="container space-y-4 mx-auto py-1">
      
      <h1 className="text-3xl font-bold tracking-tight mb-6">Control de Asistencias</h1>
      <RealtimeAsistencias />
      {/* Fila Superior: Métricas Principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="col-span-1 md:col-span-2 lg:col-span-2 flex items-center justify-center p-6 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <RelojAsistencia />
        </div>
        <div className="col-span-1 md:col-span-2 lg:col-span-2">
          <PorcentajeAsistencia 
            checkedInCount={checkedInCount || 0} 
            totalCount={totalEmpleadosHoy} 
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
          <HistogramaAsistencia />
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold tracking-tight mb-4">Asistencia por Turno</h2>
        <TablasTurnos turnos={turnos_entrada || []} avatarUrls={avatarUrls} asistencias={asistenciasMap} turnoCompleto={turnosCompletosMap} />
      </div>
    </div>
  );
}
