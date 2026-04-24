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
import { getSolicitudesAsistencia30MinDespues } from "@/services/solicitudes-asistenciatardia";
import { AlertaSalida, AlertaDescanso } from "@/components/page_components/asistencias/AsistenciasPanelNotificaciones";

export default async function AsistenciasPage() {
  const empleadoEmpresaView = await getVistaEmpleadosEmpresa(1);
  const empresas = await getEmpresas();
  const { getFormatosBD } = useHoy();
  
  const fechaHoy = getFormatosBD().fecha;
  
  const inasistenciasConfirmadas = await getInasistencias(fechaHoy);
  const asistenciasHoy = await getAsistencias(fechaHoy);
  const horasExtraHoy = await getHorasExtra(fechaHoy);
  
  const dateObj = new Date(fechaHoy + 'T12:00:00'); 
  const diasSemana = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
  const diaActual = diasSemana[dateObj.getDay()];

  const turnosDelDia = await getHorariosHoy(diaActual);
  const solicitudes = await getSolicitudesAsistencia30MinDespues(fechaHoy,null, null) || [];
  const empleadoUbicacion = await getVistaEmpleadoUbicacion();
  
  const ubicacionesMap = (empleadoUbicacion || []).reduce((acc: Record<string, vista_empleado_ubicacion>, curr: vista_empleado_ubicacion) => {
    if (curr.id) acc[curr.id] = curr;
    return acc;
  }, {});

  const inasistenciasMap = (inasistenciasConfirmadas || []).reduce((acc, curr: any) => {
    acc[curr.id_empleado] = { capturo: curr.capturo, fecha: curr.fecha, hora: curr.hora };
    return acc;
  }, {} as Record<string, { capturo: string; fecha: string; hora: string }>);

  const horariosMap = (turnosDelDia || []).reduce((acc: Record<string, any>, curr: any) => {
    const horarioDia = curr[diaActual];
    if (curr.id_empleado && horarioDia && horarioDia.hora_entrada) {
      acc[curr.id_empleado] = { entrada: horarioDia.hora_entrada, salida: horarioDia.hora_salida };
    }
    return acc;
  }, {});

  const horasExtraMap = (horasExtraHoy || []).reduce((acc: any, curr: any) => {
    if (!acc[curr.id_empleado]) acc[curr.id_empleado] = [];
    acc[curr.id_empleado].push(curr);
    return acc;
  }, {});

  const asistenciasMap = (asistenciasHoy || []).reduce((acc: Record<string, AsistenciaReporteRow>, curr: AsistenciaReporteRow) => {
    if (curr.hora_entrada_real) acc[curr.id_empleado] = curr;
    return acc;
  }, {});

  const empleadoEmpresaMap = (empleadoEmpresaView || []).reduce((acc, curr:any) => {
    acc[curr.id_empleado] = curr.id_empresa;
    return acc;
  }, {} as Record<string, number>);

  const empleadosActivosConTurnoHoy = (empleadoEmpresaView || []).filter(emp =>
    emp.id_estatus === 1 && horariosMap[emp.id_empleado as string] 
  );

  // CÁLCULO DE ALERTAS DE ASISTENCIA
  const timeToMins = (t: string) => {
    if (!t) return 0;
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  };
  
  // Hora actual exacta en CDMX
  const now = new Date();
  const horaActualStr = now.toLocaleTimeString('es-MX', { timeZone: 'America/Mexico_City', hour: '2-digit', minute: '2-digit', hour12: false });
  const minActual = timeToMins(horaActualStr);

  const alertasFaltaSalida: (AlertaSalida & { id_empresa: number })[] = [];
  const alertasExcedeDescanso: (AlertaDescanso & { id_empresa: number })[] = [];

  empleadosActivosConTurnoHoy.forEach((emp: any) => {
    const asistencia = asistenciasMap[emp.id_empleado as string];
    if (!asistencia) return; 

    const turno = horariosMap[emp.id_empleado as string];
    const extras = horasExtraMap[emp.id_empleado as string] || [];
    const nombreCompleto = `${emp.nombres} ${emp.apellidos}`;

    // 1. Falta checar Salida
    if (!asistencia.hora_salida_real && turno?.salida) {
      let horaSalidaEfectiva = turno.salida;
      const heSalida = extras.find((he: any) => he.hora_inicio && timeToMins(he.hora_inicio) >= timeToMins(turno.salida));
      if (heSalida && heSalida.hora_fin) {
        horaSalidaEfectiva = heSalida.hora_fin;
      }
      if (minActual > timeToMins(horaSalidaEfectiva)) {
        alertasFaltaSalida.push({
          id_empleado: emp.id_empleado,
          id_empresa: emp.id_empresa,
          nombre_completo: nombreCompleto,
          horaSalidaEfectiva: horaSalidaEfectiva,
        });
      }
    }

    // 2. Excede Descanso (+60 min)
    if (asistencia.hora_salida_descanso_real && !asistencia.hora_regreso_descanso_real) {
      const minSalidaDescanso = timeToMins(asistencia.hora_salida_descanso_real);
      if (minActual - minSalidaDescanso > 60) {
        alertasExcedeDescanso.push({
          id_empleado: emp.id_empleado,
          id_empresa: emp.id_empresa,
          nombre_completo: nombreCompleto,
          salidaDescanso: asistencia.hora_salida_descanso_real,
        });
      }
    }
  });

  const idsEsperadosHoy = new Set(empleadosActivosConTurnoHoy.map((e: any) => e.id_empleado));
  const inasistenciasValidasHoy = (inasistenciasConfirmadas || []).filter((reg: any) => 
    idsEsperadosHoy.has(reg.id_empleado)
  );
  const totalInasistenciasGlobal = inasistenciasValidasHoy.length;

  const turnosAgrupadosEmpresa = empleadosActivosConTurnoHoy.reduce((acc, empleado: any) => {
    const turno = horariosMap[empleado.id_empleado as string];
    const horaEntrada = turno.entrada;
    const idEmpresa = empleado.id_empresa;
    const key = `${idEmpresa}-${horaEntrada}`;

    if (!acc[key]) {
      acc[key] = { id_empresa: idEmpresa, hora_entrada: horaEntrada as string, detalles_empleados: [] };
    }
    acc[key].detalles_empleados.push({ empleado_id: empleado.id_empleado as string });
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
      acc[key] = { hora_entrada: horaEntrada, detalles_empleados: [] };
    }
    acc[key].detalles_empleados.push({ empleado_id: empleado.id_empleado, id_empresa: empleado.id_empresa });
    return acc;
  }, {} as Record<string, { hora_entrada: string; detalles_empleados: { empleado_id: number; id_empresa: number; }[] }>);

  const turnos_entrada_global = Object.values(turnosAgrupadosGlobales).map((turno) => ({
    ...turno,
    total_personas: turno.detalles_empleados.length,
  })).sort((a, b) => a.hora_entrada.localeCompare(b.hora_entrada));

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
            totalInasistenciasHoy={totalInasistenciasGlobal} 
            ubicacionesMap={ubicacionesMap}
            solicitudesAlertas={solicitudes} 
            empleadosViewAlertas={empleadoEmpresaView} 
            faltaSalidaAlertas={alertasFaltaSalida} 
            excedeDescansoAlertas={alertasExcedeDescanso} 
          />
        </TabsContent>

        {empresas.map((empresa) => {
          const turnosDeEstaEmpresa = turnos_entradaEmpresa.filter((turno) => turno.id_empresa === empresa.id);
          const totalEsperadosEmpresa = turnosDeEstaEmpresa.reduce((acc, turno) => acc + turno.total_personas, 0);
          const llegadasEmpresa = llegadasPorEmpresa[empresa.id] || 0;

          const inasistenciasEmpresa = inasistenciasValidasHoy.filter(
            (reg: any) => empleadoEmpresaMap[reg.id_empleado] === empresa.id
          ).length;

          const segmentoUnico = [{
            id: `empresa_${empresa.id}`,
            label: empresa.nombre_empresa,
            count: llegadasEmpresa,
            color: EmpresaColor(empresa.id)
          }];

          // Filtrar alertas para esta empresa específica
          const solicitudesEmpresa = solicitudes.filter((s:any) => empleadoEmpresaMap[s.id_empleado] === empresa.id);
          const faltaSalidaEmpresa = alertasFaltaSalida.filter(a => a.id_empresa === empresa.id);
          const excedeDescansoEmpresa = alertasExcedeDescanso.filter(a => a.id_empresa === empresa.id);

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
                totalInasistenciasHoy={inasistenciasEmpresa} 
                ubicacionesMap={ubicacionesMap}
                solicitudesAlertas={solicitudesEmpresa} 
                empleadosViewAlertas={empleadoEmpresaView} 
                faltaSalidaAlertas={faltaSalidaEmpresa} 
                excedeDescansoAlertas={excedeDescansoEmpresa} 
              />
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}