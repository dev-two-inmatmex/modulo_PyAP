export const dynamic = 'force-dynamic';
import { createServidorClient } from "@/lib/supabase/server";
import RelojAsistencia from "@/components/page_components/asistencias/AsistenciaReloj";
import { RealtimeAsistencias, RealtimeSalidas } from "@/hooks/useRealtimeChecadorRegistros";
import { RealtimeInasistencias } from "@/hooks/useRealtimeInasistenciasConfirmadas";
import { getAsistencias } from "@/services/asistencias";
import { getVistaEmpleadosEmpresa } from "@/services/empleados";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getEmpresas } from "@/services/empresas";
import { EmpresaColor } from "@/services/empresas-data_estilos";
import { getHorarioEmpleadoDelDia, type turno } from "@/services/horarios";
import { AsistenciaEmpresaCard } from "@/components/page_components/asistencias/AsistenciaEmpresaCard";
import EmpresaLogo from "@/components/reutilizables/EmpresaLogo";
import { getInasistencias } from "@/services/asistencias";
import { AsistenciaReporteRow } from "@/services/asistencias";
import { getVistaEmpleadoUbicacion, type vista_empleado_ubicacion } from "@/services/ubicaciones";
import { useHoy } from "@/hooks/useHoy";

export default async function AsistenciasPage() {
  const empleadoEmpresaView = await getVistaEmpleadosEmpresa();
  const empresas = await getEmpresas();
  const { getFormatosBD } = useHoy();
  const inasistenciasConfirmadas = await getInasistencias(getFormatosBD().fecha);
  const asistenciasHoy = await getAsistencias(getFormatosBD().fecha);
  const turnosDelDia = await getHorarioEmpleadoDelDia();
  const empleadoUbicacion = await getVistaEmpleadoUbicacion();
  
  const ubicacionesMap = (empleadoUbicacion || []).reduce((acc: Record<string, vista_empleado_ubicacion>, curr: vista_empleado_ubicacion) => {
    if (curr.id) {
      acc[curr.id] = curr;
    }
    return acc;
  }, {});

  // 2. Create helper maps for quick lookups
  const inasistenciasMap = (inasistenciasConfirmadas || []).reduce((acc, curr: any) => {
    acc[curr.id_empleado] = { capturo: curr.capturo, fecha: curr.fecha, hora: curr.hora };
    return acc;
  }, {} as Record<string, { capturo: string; fecha: string; hora: string }>);

  const horariosMap = (turnosDelDia || []).reduce((acc: Record<string, turno>, curr: turno) => {
    if (curr.id) {
      acc[curr.id] = curr;
    }
    return acc;
  }, {});
  //console.log("horariosMap", horariosMap)

  const asistenciasMap = (asistenciasHoy || []).reduce((acc: Record<string, AsistenciaReporteRow>, curr: AsistenciaReporteRow) => {
    if (curr.hora_entrada_real) {
      acc[curr.id_empleado] = curr;
    }
    return acc;
  }, {});
  //console.log("asistenciasMap", asistenciasMap)

  // 3. Process and filter the main employee list
  //console.log("empleadoEmpresaView", empleadoEmpresaView)
  const empleadosActivosConTurnoHoy = (empleadoEmpresaView || [])
    .filter(emp =>
        emp.id_estatus === 1 &&      // Is active?
          horariosMap[emp.id_empleado as string] 
    );
  //console.log("empleadosActivosConTurnoHoy", empleadosActivosConTurnoHoy)


  const turnosAgrupadosEmpresa = empleadosActivosConTurnoHoy.reduce((acc, empleado: any) => {
    const turno = horariosMap[empleado.id_empleado as string];
    const horaEntrada = turno.entrada;
    const idEmpresa = empleado.id_empresa;
    const key = `${idEmpresa}-${horaEntrada}`;

    if (!acc[key]) {
      acc[key] = {
        id_empresa: idEmpresa,
        hora_entrada: horaEntrada as string,
        detalles_empleados: []
      };
    }
    // Pass only the ID; the client will resolve the name using the provider.
    acc[key].detalles_empleados.push({
      empleado_id: empleado.id_empleado as string,
    });
    return acc;
  }, {} as Record<string, { id_empresa: number; hora_entrada: string; detalles_empleados: { empleado_id: string; }[] }>);

  const turnos_entradaEmpresa = Object.values(turnosAgrupadosEmpresa).map((turno) => ({
    ...turno,
    total_personas: turno.detalles_empleados.length,
  })).sort((a, b) => a.hora_entrada.localeCompare(b.hora_entrada));

  // 4. Calculate aggregates for the "Todos" tab and donut chart
  const totalEmpleadosHoyGlobal = empleadosActivosConTurnoHoy.length;
  
  const turnosAgrupadosGlobales = empleadosActivosConTurnoHoy.reduce((acc, empleado: any) => {
    const turno = horariosMap[empleado.id_empleado as string];
    if (!turno) return acc;
    const horaEntrada = turno.entrada;
    const key = horaEntrada;
    if (!acc[key]) {
      acc[key] = {
        hora_entrada: horaEntrada,
        detalles_empleados: []
      };
    }
    acc[key].detalles_empleados.push({
      empleado_id: empleado.id_empleado,
      id_empresa: empleado.id_empresa 
    });

    return acc;
  }, {} as Record<string, { hora_entrada: string; detalles_empleados: { empleado_id: number; id_empresa: number; }[] }>);

  // Esta parte sigue funcionando igual, pero ahora opera sobre la nueva estructura agrupada.
  const turnos_entrada_global = Object.values(turnosAgrupadosGlobales).map((turno) => ({
    ...turno,
    total_personas: turno.detalles_empleados.length,
  })).sort((a, b) => a.hora_entrada.localeCompare(b.hora_entrada));

  const empleadoEmpresaMap = (empleadoEmpresaView || []).reduce((acc, curr:any) => {
    acc[curr.id_empleado] = curr.id_empresa;
    return acc;
  }, {} as Record<string, number>);

  const llegadasPorEmpresa = (asistenciasHoy || []).reduce((acc, reg) => {
    const empresaId = empleadoEmpresaMap[reg.id_empleado];
    if (empresaId && reg.hora_entrada_real) {
      acc[empresaId] = (acc[empresaId] || 0) + 1;
    }
    return acc;
  }, {} as Record<number, number>);

  const segmentosGlobales = empresas.map((empresa) => ({
    id: `empresa_${empresa.id}`,
    label: empresa.nombre_empresa,
    count: llegadasPorEmpresa[empresa.id] || 0,
    color: EmpresaColor(empresa.id)
  }));

  // 5. Render the page
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
            turnosHoy={turnos_entrada_global}
            asistenciasMap={asistenciasMap}
            turnoCompletoMap={horariosMap}
            inasistenciasMap={inasistenciasMap}
            segmentoDona={segmentosGlobales}
            totalEsperadosHoy={totalEmpleadosHoyGlobal}
            ubicacionesMap={ubicacionesMap}
          />
        </TabsContent>
        {empresas.map((empresa) => {
          const turnosDeEstaEmpresa = turnos_entradaEmpresa.filter(
            (turno) => turno.id_empresa === empresa.id
          );

          const totalEsperadosEmpresa = turnosDeEstaEmpresa.reduce((acc, turno) => acc + turno.total_personas, 0);

          const llegadasEmpresa = llegadasPorEmpresa[empresa.id] || 0;

          const segmentoUnico = [{
            id: `empresa_${empresa.id}`,
            label: empresa.nombre_empresa,
            count: llegadasEmpresa,
            color: EmpresaColor(empresa.id)
          }];

          return (
            <TabsContent key={empresa.id} value={empresa.id.toString()} className="space-y-4">
              <AsistenciaEmpresaCard
                empresaId={empresa.id}
                nombreEmpresa={empresa.nombre_empresa}
                turnosHoy={turnosDeEstaEmpresa}
                asistenciasMap={asistenciasMap}
                turnoCompletoMap={horariosMap}
                inasistenciasMap={inasistenciasMap}
                segmentoDona={segmentoUnico}
                totalEsperadosHoy={totalEsperadosEmpresa}
                ubicacionesMap={ubicacionesMap}
              />
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
/*export const dynamic = 'force-dynamic';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useHoy } from "@/hooks/useHoy";
import { getEmpresas } from "@/services/empresas";
import { getInasistencias, getAsistencias } from "@/services/asistencias";
import { getVistaEmpleadosEmpresa } from "@/services/empleados";
import { getHorarioEmpleadoDelDia } from "@/services/horarios";

import RelojAsistencia from "@/components/page_components/asistencias/AsistenciaReloj";
import { RealtimeAsistencias, RealtimeSalidas } from "@/hooks/useRealtimeChecadorRegistros";
import { RealtimeInasistencias } from "@/hooks/useRealtimeInasistenciasConfirmadas";
import { AsistenciaEmpresaCard } from "@/components/page_components/asistencias/AsistenciaEmpresaCard";
import EmpresaLogo from "@/components/reutilizables/EmpresaLogo";
import { EmpresaColor } from "@/services/empresas-data_estilos";
import { AsistenciaReporteRow } from "@/services/asistencias";

export default async function AsistenciasPage() {
  // 1. Fetch all necessary data in parallel
  const { getFormatosBD } = useHoy();
  const fechaHoy = getFormatosBD().fecha;

  const [
    empresas,
    empleadoEmpresaView,
    asistenciasHoy,
    inasistenciasConfirmadas,
    horariosDelDia
  ] = await Promise.all([
    getEmpresas(),
    getVistaEmpleadosEmpresa(),
    getAsistencias(fechaHoy),
    getInasistencias(fechaHoy),
    getHorarioEmpleadoDelDia()
  ]);

  // 2. Create helper maps for quick lookups
  const inasistenciasMap = (inasistenciasConfirmadas || []).reduce((acc, curr: any) => {
    acc[curr.id_empleado] = { capturo: curr.capturo, fecha: curr.fecha, hora: curr.hora };
    return acc;
  }, {} as Record<string, { capturo: string; fecha: string; hora: string }>);

  const horariosMap = Object.fromEntries(
    (horariosDelDia || []).map(curr => [
      curr.id,
      { 
        entrada: curr.entrada, 
        salida: curr.salida, 
        salida_descanso: curr.salida_descanso, 
        regreso_descanso: curr.regreso_descanso 
      }
    ])
  );
  
  const asistenciasMap = (asistenciasHoy || []).reduce((acc, curr) => {
    acc[curr.id_empleado] = curr;
    return acc;
  }, {} as Record<string, AsistenciaReporteRow>);

  // 3. Process and filter the main employee list
  const empleadosActivosConTurnoHoy = (empleadoEmpresaView || [])
    .filter(emp => 
        emp.id_estatus === 1 &&
        horariosMap[emp.id_empleado]
    );
  
  const turnosAgrupados = empleadosActivosConTurnoHoy.reduce((acc, empleado) => {
    const turno = horariosMap[empleado.id_empleado];
    if (!turno) return acc;

    const horaEntrada = turno.entrada;
    const key = horaEntrada;

    if (!acc[key]) {
      acc[key] = {
        hora_entrada: horaEntrada,
        detalles_empleados: []
      };
    }
    
    acc[key].detalles_empleados.push({
      empleado_id: empleado.id_empleado,
      id_empresa: empleado.id_empresa 
    });

    return acc;
  }, {} as Record<string, { hora_entrada: string; detalles_empleados: { empleado_id: number; id_empresa: number; }[] }>);

  const turnos_entrada = Object.values(turnosAgrupados).map((turno) => ({
    ...turno,
    total_personas: turno.detalles_empleados.length,
  })).sort((a, b) => a.hora_entrada.localeCompare(b.hora_entrada));


  // 4. Calculate aggregates for the "Todos" tab and donut chart
  const totalEmpleadosHoyGlobal = empleadosActivosConTurnoHoy.length;

  const empleadoEmpresaMap = (empleadoEmpresaView || []).reduce((acc, curr) => {
    acc[curr.id_empleado] = curr.id_empresa;
    return acc;
  }, {} as Record<string, number>);
  
  const llegadasPorEmpresa = (asistenciasHoy || []).reduce((acc, reg) => {
      const empresaId = empleadoEmpresaMap[reg.id_empleado];
      if (empresaId && reg.hora_entrada_real) {
          acc[empresaId] = (acc[empresaId] || 0) + 1;
      }
      return acc;
  }, {} as Record<number, number>);

  const segmentosGlobales = empresas.map((empresa) => ({
      id: `empresa_${empresa.id}`,
      label: empresa.nombre_empresa,
      count: llegadasPorEmpresa[empresa.id] || 0,
      color: EmpresaColor(empresa.id)
  }));

  // 5. Render the page
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
            turnoCompletoMap={horariosMap}
            inasistenciasMap={inasistenciasMap}
            segmentoDona={segmentosGlobales}
            totalEsperadosHoy={totalEmpleadosHoyGlobal}
          />
        </TabsContent>
        {empresas.map((empresa) => {
          // --- FIX STARTS HERE ---
          // Create a new list of turns specifically for this company
          const turnosDeEstaEmpresa = turnos_entrada.map(turnoGeneral => {
            // Filter the employees within each turn to only include those from the current company
            const empleadosDeLaEmpresa = turnoGeneral.detalles_empleados.filter(
              emp => emp.id_empresa === empresa.id
            );
        
            return {
              ...turnoGeneral,
              detalles_empleados: empleadosDeLaEmpresa,
              // Recalculate the total_personas for this specific company's context
              total_personas: empleadosDeLaEmpresa.length 
            };
          }).filter(turno => turno.detalles_empleados.length > 0); // Remove any turns that are now empty
          // --- FIX ENDS HERE ---

          const totalEsperadosEmpresa = turnosDeEstaEmpresa.reduce((acc, turno) => acc + turno.total_personas, 0);

          const llegadasEmpresa = llegadasPorEmpresa[empresa.id] || 0;
          
          const segmentoUnico = [{
            id: `empresa_${empresa.id}`,
            label: empresa.nombre_empresa,
            count: llegadasEmpresa,
            color: EmpresaColor(empresa.id)
          }];

          return (
            <TabsContent key={empresa.id} value={empresa.id.toString()} className="space-y-4">
              <AsistenciaEmpresaCard
                empresaId={empresa.id}
                nombreEmpresa={empresa.nombre_empresa}
                turnosHoy={turnosDeEstaEmpresa}
                asistenciasMap={asistenciasMap}
                turnoCompletoMap={horariosMap}
                inasistenciasMap={inasistenciasMap}
                segmentoDona={segmentoUnico}
                totalEsperadosHoy={totalEsperadosEmpresa}
              />
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}*/
