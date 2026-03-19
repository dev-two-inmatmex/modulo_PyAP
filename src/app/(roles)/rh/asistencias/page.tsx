export const dynamic = 'force-dynamic';
import { createClient } from "@/lib/supabase/server";
import RelojAsistencia from "@/components/page_components/asistencias/RelojAsistencia";
import { PorcentajeAsistencia } from "@/components/page_components/asistencias/tab_contenent/PorcentajeAsistencia";
import { HistogramaAsistencia } from "@/components/page_components/asistencias/tab_contenent/HistogramaAsistencia";
import { TablasTurnos } from "@/components/page_components/asistencias/TablasTurnos";
import { getAvatarsMap } from "@/utils/storage";
import { RealtimeAsistencias } from "@/hooks/useRealtimeChecadorRegistros";
import { getEmpleadosAgrupadosPorHoraEntrada } from "@/services/asistencias";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getEmpresas } from "@/services/empresas";
import { getHorarioEmpleadoDelDia } from "@/services/horarios";

export default async function AsistenciasPage() {
  const supabase = await createClient();

  // ==========================================
  // 1. EL BUFFET: TRAEMOS TODOS LOS DATOS
  // ==========================================
  const empresas = await getEmpresas();
  const turnos_entrada = await getEmpleadosAgrupadosPorHoraEntrada(); // Trae TODOS los turnos
  const empleadoTurnoRel = await getHorarioEmpleadoDelDia();
  // Traemos horarios completos
  /*const { data: empleadoTurnoRel } = await supabase
    .from("vista_horarios_empleados")
    .select("id, entrada, salida_descanso, regreso_descanso, salida");*/

  const turnosCompletosMap = (empleadoTurnoRel || []).reduce((acc, curr: any) => {
    acc[curr.id] = { entrada: curr.entrada, salida: curr.salida, salida_descanso: curr.salida_descanso, regreso_descanso: curr.regreso_descanso };
    return acc;
  }, {} as Record<string, { entrada: string; salida: string; salida_descanso: string; regreso_descanso: string }>);

  // Traemos los registros (checadas) de hoy
  const today = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'America/Mexico_City',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date());

  const { data: registrosHoy, error: registrosError } = await supabase
    .from('vista_registro_checador_resumida')
    .select('id_empleado, registro, estatus, nombre_ubicacion')
    .eq('fecha', today)
    .eq('tipo_registro', 'entrada');

  if (registrosError) console.error('Error fetching today records:', registrosError);

  // Mapas globales Asistencias
  const asistenciasMap = (registrosHoy || []).reduce((acc, curr: any) => {
    acc[curr.id_empleado] = { hora: curr.registro, estatus: curr.estatus, ubicacion: curr.nombre_ubicacion };
    return acc;
  }, {} as Record<string, { hora: string; estatus: string; ubicacion: string; }>);

  // ==========================================
  // 2. CÁLCULOS GLOBALES (Para la pestaña "Todos")
  // ==========================================
  const totalEmpleadosHoyGlobal = turnos_entrada?.reduce((acc, turno: any) => acc + turno.total_personas, 0) || 0;

  // 1. Mapa para saber a qué empresa pertenece cada empleado (basado en los turnos)
  const empleadoEmpresaMap: Record<string, number> = {};
  turnos_entrada?.forEach((turno: any) => {
    turno.detalles_empleados.forEach((emp: any) => {
      empleadoEmpresaMap[emp.empleado_id] = turno.id_empresa;
    });
  });

  // 2. Contamos las llegadas reales separadas por empresa
  const llegadasPorEmpresa: Record<number, number> = {};
  registrosHoy?.forEach((reg: any) => {
    const empId = empleadoEmpresaMap[reg.id_empleado];
    if (empId) {
      llegadasPorEmpresa[empId] = (llegadasPorEmpresa[empId] || 0) + 1;
    }
  });

  // 3. Colores del tema para asignar uno diferente a cada empresa
  const coloresGrafica = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))"
  ];

  // 4. Armamos las "Rebanadas" globales (Pestaña Todos)
  const segmentosGlobales = empresas.map((empresa, index) => ({
    id: `empresa_${empresa.id}`,
    label: empresa.nombre_empresa,
    count: llegadasPorEmpresa[empresa.id] || 0,
    color: coloresGrafica[index % coloresGrafica.length]
  }));
  return (
    <div className="container space-y-4 mx-auto py-1">
      <RealtimeAsistencias />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Control de Asistencias</h1>
        <RelojAsistencia />
      </div>

      <Tabs defaultValue="0" className="grid w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="0">Todos</TabsTrigger>
          {empresas.map((empresa) => (
            <TabsTrigger key={empresa.id} value={empresa.id.toString()}>
              {empresa.nombre_empresa}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* ------------------------------------------- */}
        {/* PESTAÑA 0: TODOS LOS EMPLEADOS GLOBALES */}
        {/* ------------------------------------------- */}
        <TabsContent value="0" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="col-span-1 md:col-span-2 lg:col-span-2">
              <PorcentajeAsistencia
                segmentos={segmentosGlobales} // <--- REBANADAS MULTICOLOR
                totalEsperados={totalEmpleadosHoyGlobal}
              />
            </div>
            <div className="col-span-1 md:col-span-2 lg:col-span-2">
              <HistogramaAsistencia />
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-bold tracking-tight mb-4">Asistencia General</h2>
            <TablasTurnos
              turnos={turnos_entrada || []}
              asistencias={asistenciasMap}
              turnoCompleto={turnosCompletosMap}
            />
          </div>
        </TabsContent>

        {/* ------------------------------------------- */}
        {/* PESTAÑAS DINÁMICAS: UNA POR CADA EMPRESA */}
        {/* ------------------------------------------- */}
        {empresas.map((empresa, index) => {
          // AQUI ESTÁ LA MAGIA: Filtramos los datos SOLO para esta empresa

          // 1. Filtramos los turnos
          const turnosDeEstaEmpresa = turnos_entrada?.filter(
            (turno: any) => turno.id_empresa === empresa.id
          ) || [];

          // 2. Calculamos los totales solo de esta empresa
          const totalEsperadosEmpresa = turnosDeEstaEmpresa.reduce((acc, turno: any) => acc + turno.total_personas, 0);

          // 3. Filtramos cuántos llegaron de esta empresa
          // Revisamos si el ID del empleado que llegó está en los turnos de esta empresa
          const idsEmpleadosEmpresa = turnosDeEstaEmpresa.flatMap((t: any) => t.detalles_empleados.map((e: any) => e.empleado_id));
          const llegadasEmpresa = registrosHoy?.filter(reg => idsEmpleadosEmpresa.includes(reg.id_empleado)).length || 0;
          const segmentoUnico = [{
            id: `empresa_${empresa.id}`,
            label: empresa.nombre_empresa,
            count: llegadasEmpresa, // La variable que ya calculaste
            color: coloresGrafica[index % coloresGrafica.length] // Usa su mismo color global
          }];

          return (
            <TabsContent key={empresa.id} value={empresa.id.toString()} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="col-span-1 md:col-span-2 lg:col-span-2">
                  <PorcentajeAsistencia
                    segmentos={segmentoUnico} // <--- UNA SOLA REBANADA
                    totalEsperados={totalEsperadosEmpresa}
                  />
                </div>
                <div className="col-span-1 md:col-span-2 lg:col-span-2">
                  {/* Si el histograma necesita datos filtrados, se los pasarías aquí */}
                  <HistogramaAsistencia />
                </div>
              </div>

              <div className="mt-8">
                <h2 className="text-2xl font-bold tracking-tight mb-4">
                  Asistencia: {empresa.nombre_empresa}
                </h2>
                <TablasTurnos
                  turnos={turnosDeEstaEmpresa}
                  asistencias={asistenciasMap}
                  turnoCompleto={turnosCompletosMap}
                />
              </div>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}