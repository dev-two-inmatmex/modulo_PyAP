export const dynamic = 'force-dynamic';
import { createServidorClient } from "@/lib/supabase/server";
import RelojAsistencia from "@/components/page_components/asistencias/AsistenciaReloj";
import { RealtimeAsistencias, RealtimeSalidas } from "@/hooks/useRealtimeChecadorRegistros";
import { RealtimeInasistencias } from "@/hooks/useRealtimeInasistenciasConfirmadas";
import { getEmpleadosAgrupadosPorHoraEntrada } from "@/services/asistencias";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getEmpresas } from "@/services/empresas";
import { EmpresaColor } from "@/services/empresas-data_estilos";
import { getHorarioEmpleadoDelDia } from "@/services/horarios";
import { AsistenciaEmpresaCard } from "@/components/page_components/asistencias/AsistenciaEmpresaCard";
import EmpresaLogo from "@/components/reutilizables/EmpresaLogo";
import { useHoy } from "@/hooks/useHoy";
import { getInasistencias } from "@/services/asistencias";

export default async function AsistenciasPage() {
  const supabase = await createServidorClient();

  const empresas = await getEmpresas();
  const turnos_entrada = await getEmpleadosAgrupadosPorHoraEntrada();
  const empleadoTurnoRel = await getHorarioEmpleadoDelDia();

  /*const today = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'America/Mexico_City',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date());*/

  const { getFormatosBD } = useHoy();
  const inasistencias_confirmadas = await getInasistencias(getFormatosBD().fecha);
  const inasistenciasMap = (inasistencias_confirmadas || []).reduce((acc, curr: any) => {
    acc[curr.id_empleado] = { capturo: curr.capturo, fecha: curr.fecha, hora: curr.hora };
    return acc;
  }, {} as Record<string, { capturo: string; fecha: string; hora: string }>);


  const turnosCompletosMap = (empleadoTurnoRel || []).reduce((acc, curr: any) => {
    acc[curr.id] = { entrada: curr.entrada, salida: curr.salida, salida_descanso: curr.salida_descanso, regreso_descanso: curr.regreso_descanso };
    return acc;
  }, {} as Record<string, { entrada: string; salida: string; salida_descanso: string; regreso_descanso: string }>);

  

  const { data: registrosHoy, error: registrosError } = await supabase
    .from('vista_registro_checador_resumida')
    .select('id_empleado, registro, estatus, nombre_ubicacion')
    .eq('fecha', getFormatosBD().fecha)
    .eq('tipo_registro', 'entrada');

  if (registrosError) console.error('Error fetching today records:', registrosError);

  // Mapas globales Asistencias
  const asistenciasMap = (registrosHoy || []).reduce((acc, curr: any) => {
    acc[curr.id_empleado] = { hora: curr.registro, estatus: curr.estatus, ubicacion: curr.nombre_ubicacion };
    return acc;
  }, {} as Record<string, { hora: string; estatus: string; ubicacion: string; }>);

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

  // 4. Armamos las "Rebanadas" globales (Pestaña Todos)
  const segmentosGlobales = empresas.map((empresa) => ({
    id: `empresa_${empresa.id}`,
    label: empresa.nombre_empresa,
    count: llegadasPorEmpresa[empresa.id] || 0,
    color: EmpresaColor(empresa.id)
  }));
  return (
    <div className="container mx-auto py-1">
      <RealtimeAsistencias />
      <RealtimeSalidas />
      <RealtimeInasistencias />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Control de Asistencias</h1>
        <RelojAsistencia />
      </div>

      <Tabs defaultValue="0">
        <TabsList>
          <TabsTrigger value="0">Todos</TabsTrigger>
          {empresas.map((empresa) => (
            <TabsTrigger key={empresa.id} value={empresa.id.toString()}>
              <EmpresaLogo id={empresa.id} wyh={24} />
              {empresa.nombre_empresa}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="0" className="space-y-4">
          <AsistenciaEmpresaCard
            empresaId={null}
            nombreEmpresa={"Todas las empresas"}
            turnosHoy={turnos_entrada}
            asistenciasMap={asistenciasMap}
            turnoCompletoMap={turnosCompletosMap}
            inasistenciasMap={inasistenciasMap}
            segmentoDona={segmentosGlobales}
            totalEsperadosHoy={totalEmpleadosHoyGlobal}
            fechaDelDia={getFormatosBD().fecha}
          />
        </TabsContent>
        {empresas.map((empresa) => {

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
            color: EmpresaColor(empresa.id) // Usa su mismo color global
          }];

          return (
            <TabsContent key={empresa.id} value={empresa.id.toString()} className="space-y-4">
              <AsistenciaEmpresaCard
                empresaId={empresa.id}
                nombreEmpresa={empresa.nombre_empresa}
                turnosHoy={turnosDeEstaEmpresa}
                asistenciasMap={asistenciasMap}
                turnoCompletoMap={turnosCompletosMap}
                inasistenciasMap={inasistenciasMap}
                segmentoDona={segmentoUnico}
                totalEsperadosHoy={totalEsperadosEmpresa}
                fechaDelDia={getFormatosBD().fecha}
              />
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}