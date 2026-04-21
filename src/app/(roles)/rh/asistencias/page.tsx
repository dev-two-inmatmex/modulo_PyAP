/*export const dynamic = 'force-dynamic';
import RelojAsistencia from "@/components/page_components/asistencias/AsistenciaReloj";
import { RealtimeAsistencias } from "@/hooks/useRealtimeChecadorRegistros";
import { RealtimeInasistencias } from "@/hooks/useRealtimeInasistenciasConfirmadas";
import { getAsistencias } from "@/services/asistencias";
import { getVistaEmpleadosEmpresa } from "@/services/empleados";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getEmpresas } from "@/services/empresas";
import { EmpresaColor } from "@/services/empresas-data_estilos";
import { getHorarioEmpleadoDelDia, getHorasExtra, type turno, type Empleado_asignacion_horas_extra } from "@/services/horarios";
import { AsistenciaEmpresaCard } from "@/components/page_components/asistencias/AsistenciaEmpresaCard";
import EmpresaLogo from "@/components/reutilizables/EmpresaLogo";
import { getInasistencias } from "@/services/asistencias";
import { AsistenciaReporteRow } from "@/services/asistencias";
import { getVistaEmpleadoUbicacion, type vista_empleado_ubicacion } from "@/services/ubicaciones";
import { useHoy } from "@/hooks/useHoy";

export default async function AsistenciasPage() {
  const empleadoEmpresaView = await getVistaEmpleadosEmpresa(1);
  const empresas = await getEmpresas();
  const { getFormatosBD } = useHoy();
  const inasistenciasConfirmadas = await getInasistencias(getFormatosBD().fecha);
  const asistenciasHoy = await getAsistencias(getFormatosBD().fecha);
  const horasExtraHoy = await getHorasExtra(getFormatosBD().fecha);
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
  const horasExtraMap = (horasExtraHoy || []).reduce((acc: any, curr: any) => {
    if (!acc[curr.id_empleado]) acc[curr.id_empleado] = [];
    acc[curr.id_empleado].push(curr);
    return acc;
  }, {});

  console.log("horasExtraMap", horasExtraMap)

  const asistenciasMap = (asistenciasHoy || []).reduce((acc: Record<string, AsistenciaReporteRow>, curr: AsistenciaReporteRow) => {
    if (curr.hora_entrada_real) {
      acc[curr.id_empleado] = curr;
    }
    return acc;
  }, {});
  const empleadosActivosConTurnoHoy = (empleadoEmpresaView || [])
    .filter(emp =>
        emp.id_estatus === 1 &&      
          horariosMap[emp.id_empleado as string] 
    );

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
}*/
/*export const dynamic = 'force-dynamic';
import { createServidorClient } from "@/lib/supabase/server";
import RelojAsistencia from "@/components/page_components/asistencias/AsistenciaReloj";
import { RealtimeAsistencias } from "@/hooks/useRealtimeChecadorRegistros";
import { RealtimeInasistencias } from "@/hooks/useRealtimeInasistenciasConfirmadas";
import { getAsistencias } from "@/services/asistencias";
import { getVistaEmpleadosEmpresa } from "@/services/empleados";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getEmpresas } from "@/services/empresas";
import { EmpresaColor } from "@/services/empresas-data_estilos";
// 👇 Importamos getHorariosHoy en lugar del anterior
import { getHorariosHoy, getHorasExtra, type Empleado_asignacion_horas_extra } from "@/services/horarios";
import { AsistenciaEmpresaCard } from "@/components/page_components/asistencias/AsistenciaEmpresaCard";
import EmpresaLogo from "@/components/reutilizables/EmpresaLogo";
import { getInasistencias } from "@/services/asistencias";
import { AsistenciaReporteRow } from "@/services/asistencias";
import { getVistaEmpleadoUbicacion, type vista_empleado_ubicacion } from "@/services/ubicaciones";
import { useHoy } from "@/hooks/useHoy";

export default async function AsistenciasPage() {
  const empleadoEmpresaView = await getVistaEmpleadosEmpresa(1);
  const empresas = await getEmpresas();
  const { getFormatosBD } = useHoy();
  
  // Guardamos la fecha para reusarla
  const fechaHoy = getFormatosBD().fecha;
  
  const inasistenciasConfirmadas = await getInasistencias(fechaHoy);
  const asistenciasHoy = await getAsistencias(fechaHoy);
  const horasExtraHoy = await getHorasExtra(fechaHoy);
  
  // 👇 1. Calcular dinámicamente qué día de la semana es hoy (lunes, martes...)
  const dateObj = new Date(fechaHoy + 'T12:00:00'); // Se agrega 'T12:00:00' para evitar desfase de zona horaria
  const diasSemana = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
  const diaActual = diasSemana[dateObj.getDay()];

  // 👇 2. Llamar a la nueva función pasándole el día
  const turnosDelDia = await getHorariosHoy(diaActual);
  
  const empleadoUbicacion = await getVistaEmpleadoUbicacion();
  
  const ubicacionesMap = (empleadoUbicacion || []).reduce((acc: Record<string, vista_empleado_ubicacion>, curr: vista_empleado_ubicacion) => {
    if (curr.id) {
      acc[curr.id] = curr;
    }
    return acc;
  }, {});

  const inasistenciasMap = (inasistenciasConfirmadas || []).reduce((acc, curr: any) => {
    acc[curr.id_empleado] = { capturo: curr.capturo, fecha: curr.fecha, hora: curr.hora };
    return acc;
  }, {} as Record<string, { capturo: string; fecha: string; hora: string }>);

  // 👇 3. Crear el mapa de horarios leyendo dinámicamente la propiedad del día
  const horariosMap = (turnosDelDia || []).reduce((acc: Record<string, any>, curr: any) => {
    const horarioDia = curr[diaActual];
    // Verificamos que el empleado tenga un horario asignado ese día en específico
    if (curr.id_empleado && horarioDia && horarioDia.hora_entrada) {
      acc[curr.id_empleado] = {
        entrada: horarioDia.hora_entrada,
        salida: horarioDia.hora_salida
      };
    }
    return acc;
  }, {});

  const horasExtraMap = (horasExtraHoy || []).reduce((acc: any, curr: any) => {
    if (!acc[curr.id_empleado]) acc[curr.id_empleado] = [];
    acc[curr.id_empleado].push(curr);
    return acc;
  }, {});

  const asistenciasMap = (asistenciasHoy || []).reduce((acc: Record<string, AsistenciaReporteRow>, curr: AsistenciaReporteRow) => {
    if (curr.hora_entrada_real) {
      acc[curr.id_empleado] = curr;
    }
    return acc;
  }, {});

  const empleadosActivosConTurnoHoy = (empleadoEmpresaView || [])
    .filter(emp =>
        emp.id_estatus === 1 &&      
          horariosMap[emp.id_empleado as string] 
    );

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
    acc[key].detalles_empleados.push({
      empleado_id: empleado.id_empleado as string,
    });
    return acc;
  }, {} as Record<string, { id_empresa: number; hora_entrada: string; detalles_empleados: { empleado_id: string; }[] }>);

  const turnos_entradaEmpresa = Object.values(turnosAgrupadosEmpresa).map((turno) => ({
    ...turno,
    total_personas: turno.detalles_empleados.length,
  })).sort((a, b) => a.hora_entrada.localeCompare(b.hora_entrada));

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

  return (
    <div className="container mx-auto py-1">
      <RealtimeAsistencias />
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
            horasExtraMap={horasExtraMap}
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
                horasExtraMap={horasExtraMap}
              />
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}*/
export const dynamic = 'force-dynamic';
import { createServidorClient } from "@/lib/supabase/server";
import RelojAsistencia from "@/components/page_components/asistencias/AsistenciaReloj";
import { RealtimeAsistencias } from "@/hooks/useRealtimeChecadorRegistros";
import { RealtimeInasistencias } from "@/hooks/useRealtimeInasistenciasConfirmadas";
import { getAsistencias } from "@/services/asistencias";
import { getVistaEmpleadosEmpresa } from "@/services/empleados";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getEmpresas } from "@/services/empresas";
import { EmpresaColor } from "@/services/empresas-data_estilos";
import { getHorariosHoy, getHorasExtra, type Empleado_asignacion_horas_extra } from "@/services/horarios";
import { AsistenciaEmpresaCard } from "@/components/page_components/asistencias/AsistenciaEmpresaCard";
import EmpresaLogo from "@/components/reutilizables/EmpresaLogo";
import { getInasistencias } from "@/services/asistencias";
import { AsistenciaReporteRow } from "@/services/asistencias";
import { getVistaEmpleadoUbicacion, type vista_empleado_ubicacion } from "@/services/ubicaciones";
import { useHoy } from "@/hooks/useHoy";

export default async function AsistenciasPage() {
  const empleadoEmpresaView = await getVistaEmpleadosEmpresa(1);
  const empresas = await getEmpresas();
  const { getFormatosBD } = useHoy();
  
  // Guardamos la fecha para reusarla
  const fechaHoy = getFormatosBD().fecha;
  
  const inasistenciasConfirmadas = await getInasistencias(fechaHoy);
  const asistenciasHoy = await getAsistencias(fechaHoy);
  const horasExtraHoy = await getHorasExtra(fechaHoy);
  
  // Calcular dinámicamente qué día de la semana es hoy
  const dateObj = new Date(fechaHoy + 'T12:00:00'); 
  const diasSemana = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
  const diaActual = diasSemana[dateObj.getDay()];

  // Llamar a la nueva función pasándole el día
  const turnosDelDia = await getHorariosHoy(diaActual);
  
  const empleadoUbicacion = await getVistaEmpleadoUbicacion();
  
  const ubicacionesMap = (empleadoUbicacion || []).reduce((acc: Record<string, vista_empleado_ubicacion>, curr: vista_empleado_ubicacion) => {
    if (curr.id) {
      acc[curr.id] = curr;
    }
    return acc;
  }, {});

  const inasistenciasMap = (inasistenciasConfirmadas || []).reduce((acc, curr: any) => {
    acc[curr.id_empleado] = { capturo: curr.capturo, fecha: curr.fecha, hora: curr.hora };
    return acc;
  }, {} as Record<string, { capturo: string; fecha: string; hora: string }>);

  // Crear el mapa de horarios
  const horariosMap = (turnosDelDia || []).reduce((acc: Record<string, any>, curr: any) => {
    const horarioDia = curr[diaActual];
    if (curr.id_empleado && horarioDia && horarioDia.hora_entrada) {
      acc[curr.id_empleado] = {
        entrada: horarioDia.hora_entrada,
        salida: horarioDia.hora_salida
      };
    }
    return acc;
  }, {});

  const horasExtraMap = (horasExtraHoy || []).reduce((acc: any, curr: any) => {
    if (!acc[curr.id_empleado]) acc[curr.id_empleado] = [];
    acc[curr.id_empleado].push(curr);
    return acc;
  }, {});

  const asistenciasMap = (asistenciasHoy || []).reduce((acc: Record<string, AsistenciaReporteRow>, curr: AsistenciaReporteRow) => {
    if (curr.hora_entrada_real) {
      acc[curr.id_empleado] = curr;
    }
    return acc;
  }, {});

  const empleadosActivosConTurnoHoy = (empleadoEmpresaView || [])
    .filter(emp =>
        emp.id_estatus === 1 &&      
          horariosMap[emp.id_empleado as string] 
    );

  // 👇 NUEVO BLOQUE 1: Calcular Inasistencias Globales válidas
  const idsEsperadosHoy = new Set(empleadosActivosConTurnoHoy.map((e: any) => e.id_empleado));
  const inasistenciasValidasHoy = (inasistenciasConfirmadas || []).filter((reg: any) => 
    idsEsperadosHoy.has(reg.id_empleado)
  );
  const totalInasistenciasGlobal = inasistenciasValidasHoy.length;
  // -------------------------------------------------------------

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
    acc[key].detalles_empleados.push({
      empleado_id: empleado.id_empleado as string,
    });
    return acc;
  }, {} as Record<string, { id_empresa: number; hora_entrada: string; detalles_empleados: { empleado_id: string; }[] }>);

  const turnos_entradaEmpresa = Object.values(turnosAgrupadosEmpresa).map((turno) => ({
    ...turno,
    total_personas: turno.detalles_empleados.length,
  })).sort((a, b) => a.hora_entrada.localeCompare(b.hora_entrada));

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

  return (
    <div className="container mx-auto py-1">
      <RealtimeAsistencias />
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
            totalInasistenciasHoy={totalInasistenciasGlobal} // 👇 NUEVO BLOQUE 2: Pasar props a Todas las empresas
            ubicacionesMap={ubicacionesMap}
            horasExtraMap={horasExtraMap}
          />
        </TabsContent>
        {empresas.map((empresa) => {
          const turnosDeEstaEmpresa = turnos_entradaEmpresa.filter(
            (turno) => turno.id_empresa === empresa.id
          );

          const totalEsperadosEmpresa = turnosDeEstaEmpresa.reduce((acc, turno) => acc + turno.total_personas, 0);
          const llegadasEmpresa = llegadasPorEmpresa[empresa.id] || 0;

          // 👇 NUEVO BLOQUE 3: Calcular inasistencias de esta empresa específica
          const inasistenciasEmpresa = inasistenciasValidasHoy.filter(
            (reg: any) => empleadoEmpresaMap[reg.id_empleado] === empresa.id
          ).length;
          // -------------------------------------------------------------------

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
                totalInasistenciasHoy={inasistenciasEmpresa} // 👇 NUEVO BLOQUE 4: Pasar props por empresa
                ubicacionesMap={ubicacionesMap}
                horasExtraMap={horasExtraMap}
              />
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}

