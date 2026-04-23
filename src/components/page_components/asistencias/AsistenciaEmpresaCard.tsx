'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PorcentajeAsistencia, SegmentoAsistencia } from "./AsistenciaPorcentaje";
import { AsistenciaTablaTurnos } from "./AsistenciaTablasTurnos";
import { AsistenciaReporteRow } from "@/services/asistencias";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { InformeAsistencias } from "./InformeAsistencias";
import { FileText, Bell } from "lucide-react";
import PanelAlertasRH, { AlertaSalida, AlertaDescanso } from "./AsistenciasPanelNotificaciones";

type TurnoDetalle = {
  empleado_id: number;
};

type TurnoData = {
  hora_entrada: string;
  detalles_empleados: TurnoDetalle[];
  total_personas: number;
};

type AsistenciasMap = Record<string, AsistenciaReporteRow>;
type InasistenciasMap = Record<string, { capturo: string; }>;
type TurnoCompletoMap = Record<string, { entrada: string; salida: string; }>;
type ubicacionesMap = Record<string, any>; 

interface AsistenciaCardProps {
  empresaId: number | null;
  nombreEmpresa: string;
  turnosHoy: TurnoData[];
  asistenciasMap: AsistenciasMap;
  turnoCompletoMap: TurnoCompletoMap;
  inasistenciasMap: InasistenciasMap;
  segmentoDona: SegmentoAsistencia[];
  totalEsperadosHoy: number;
  totalInasistenciasHoy: number;
  ubicacionesMap: ubicacionesMap;
  solicitudesAlertas: any[];
  empleadosViewAlertas: any[];
  faltaSalidaAlertas: AlertaSalida[];
  excedeDescansoAlertas: AlertaDescanso[];
}

export function AsistenciaEmpresaCard({
  empresaId,
  nombreEmpresa,
  turnosHoy,
  asistenciasMap,
  turnoCompletoMap,
  inasistenciasMap,
  segmentoDona,
  totalEsperadosHoy,
  totalInasistenciasHoy,
  ubicacionesMap,
  solicitudesAlertas,
  empleadosViewAlertas,
  faltaSalidaAlertas,
  excedeDescansoAlertas
}: AsistenciaCardProps) {
  console.log(empleadosViewAlertas)
  // Filtramos solicitudes pendientes para el contador
  const solicitudesPendientes = solicitudesAlertas.filter(s => s.aceptar_asistencia_tardia === null);
  
  // Calculamos el total de alertas para mostrar el "globito" rojo
  const totalAlertas = solicitudesPendientes.length + faltaSalidaAlertas.length + excedeDescansoAlertas.length;

  return (
    <Card className="col-span-1 lg:col-span-3">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
            <CardTitle>{nombreEmpresa}</CardTitle>
            <CardDescription>Resumen de Asistencia y Puntualidad para Hoy</CardDescription>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
            {/* NUEVO DIALOG: Alertas */}
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline" className="relative">
                        <Bell className="mr-2 h-4 w-4" />
                        Alertas
                        {totalAlertas > 0 && (
                            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white font-bold animate-in zoom-in">
                                {totalAlertas}
                            </span>
                        )}
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Alertas de RH - {nombreEmpresa}</DialogTitle>
                    </DialogHeader>
                    <div className="py-2">
                        <PanelAlertasRH 
                            solicitudes={solicitudesAlertas}
                            empleadosView={empleadosViewAlertas}
                            faltaSalida={faltaSalidaAlertas}
                            excedeDescanso={excedeDescansoAlertas}
                        />
                    </div>
                </DialogContent>
            </Dialog>

            {/* DIALOG ORIGINAL: Informe */}
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline">
                        <FileText className="mr-2 h-4 w-4" />
                        Ver Informe
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Informe de Asistencias - {nombreEmpresa}</DialogTitle>
                    </DialogHeader>
                    <InformeAsistencias empresaId={empresaId} />
                </DialogContent>
            </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <PorcentajeAsistencia
          segmentos={segmentoDona}
          totalEsperados={totalEsperadosHoy}
          totalInasistencias={totalInasistenciasHoy}
          />
        </div>
        
        <AsistenciaTablaTurnos
          turnos={turnosHoy}
          asistencias={asistenciasMap}
          inasistencias={inasistenciasMap}
          horarios={turnoCompletoMap}
          ubicaciones={ubicacionesMap}
        />
      </CardContent>
    </Card>
  );
}





