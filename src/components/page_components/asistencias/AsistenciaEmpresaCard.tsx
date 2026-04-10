/*'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PorcentajeAsistencia, SegmentoAsistencia } from "./AsistenciaPorcentaje";
import { AsistenciaTablaTurnos } from "./AsistenciaTablasTurnos";
import { AsistenciaReporteRow } from "@/services/asistencias";
import { vista_empleado_ubicacion} from "@/services/ubicaciones";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';

// Prop types based on page data from AsistenciasPage
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
type ubicacionesMap = Record<string, vista_empleado_ubicacion>;

interface AsistenciaCardProps {
  empresaId: number | null;
  nombreEmpresa: string;
  turnosHoy: TurnoData[];
  asistenciasMap: AsistenciasMap;
  ubicacionesMap: ubicacionesMap;
  turnoCompletoMap: TurnoCompletoMap;
  inasistenciasMap: InasistenciasMap;
  segmentoDona: SegmentoAsistencia[];
  totalEsperadosHoy: number;
}

export function AsistenciaEmpresaCard({
  nombreEmpresa,
  turnosHoy,
  asistenciasMap,
  turnoCompletoMap,
  inasistenciasMap,
  segmentoDona,
  totalEsperadosHoy,
  ubicacionesMap
}: AsistenciaCardProps) {

  return (
    <Card className="col-span-1 lg:col-span-3">
      <CardHeader>
        <CardTitle>{nombreEmpresa}</CardTitle>
        <CardDescription>Resumen de Asistencia y Puntualidad para Hoy</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <PorcentajeAsistencia segmentos={segmentoDona} totalEsperados={totalEsperadosHoy} />

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
}*/

'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PorcentajeAsistencia, SegmentoAsistencia } from "./AsistenciaPorcentaje";
import { AsistenciaTablaTurnos } from "./AsistenciaTablasTurnos";
import { AsistenciaReporteRow } from "@/services/asistencias";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { InformeAsistencias } from "./InformeAsistencias";
import { FileText } from "lucide-react";

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
type ubicacionesMap = Record<string, vista_empleado_ubicacion>;

interface AsistenciaCardProps {
  empresaId: number | null;
  nombreEmpresa: string;
  turnosHoy: TurnoData[];
  asistenciasMap: AsistenciasMap;
  turnoCompletoMap: TurnoCompletoMap;
  inasistenciasMap: InasistenciasMap;
  segmentoDona: SegmentoAsistencia[];
  totalEsperadosHoy: number;
  ubicacionesMap: ubicacionesMap;
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
  ubicacionesMap
}: AsistenciaCardProps) {

  return (
    <Card className="col-span-1 lg:col-span-3">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle>{nombreEmpresa}</CardTitle>
            <CardDescription>Resumen de Asistencia y Puntualidad para Hoy</CardDescription>
        </div>
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <FileText className="mr-2 h-4 w-4" />
                    Ver Informe
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Informe de Asistencias - {nombreEmpresa}</DialogTitle>
                </DialogHeader>
                <InformeAsistencias empresaId={empresaId} />
            </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <PorcentajeAsistencia segmentos={segmentoDona} totalEsperados={totalEsperadosHoy} />
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





