'use client';

import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/reutilizables/UserAvatar";
import { Clock, CheckCircle2, AlertCircle, UserMinus, Palmtree, Stethoscope, Ban, CalendarX, Coffee } from "lucide-react";
import { toast } from "sonner";
import type { AsistenciaReporteRow } from "@/services/asistencias";

interface HistorialProps {
  historial: AsistenciaReporteRow[];
}

export function HistorialAsistencia({ historial}: HistorialProps) {
  
  const getEstatusUI = (registro: AsistenciaReporteRow) => {
    if (registro.estado_general !== 'LABORAL') {
      switch (registro.estado_general) {
        case 'VACACIONES': return <Badge className="bg-blue-100 text-blue-800"><Palmtree className="w-3 h-3 mr-1" /> Vacaciones</Badge>;
        case 'INCAPACIDAD': return <Badge className="bg-yellow-100 text-yellow-800"><Stethoscope className="w-3 h-3 mr-1" /> Incapacidad</Badge>;
        case 'BAJA': return <Badge className="bg-slate-200 text-slate-700"><Ban className="w-3 h-3 mr-1" /> Baja</Badge>;
        case 'DESCANSO': return <Badge variant="outline" className="text-slate-500"><Coffee className="w-3 h-3 mr-1" /> Descanso</Badge>;
        case 'FALTA': return <Badge variant="destructive" className="bg-red-50 text-red-700">Falta Injustificada</Badge>;
        case 'SIN_HORARIO': return <Badge variant="outline"><CalendarX className="w-3 h-3 mr-1" /> Sin Horario Asignado</Badge>;
      }
    }
    
    if (registro.hora_entrada_real) {
      switch (registro.estado_entrada) {
        case 'PUNTUAL': return <Badge className="bg-green-100 text-green-800"><CheckCircle2 className="w-3 h-3 mr-1" /> Puntual</Badge>;
        case 'RETARDO_LEVE': return <Badge className="bg-orange-100 text-orange-800"><Clock className="w-3 h-3 mr-1" /> Retraso Leve</Badge>;
        case 'RETARDO_GRAVE': return <Badge className="bg-red-100 text-red-800"><AlertCircle className="w-3 h-3 mr-1" /> Retraso Grave</Badge>;
      }
    }
    
    return <Badge variant="outline">Asistencia Registrada</Badge>;
  };

  const formatHora = (timeString: string | null) => {
    if (!timeString) return '--:--';
    return timeString.substring(0, 5); 
  };

  // Calculamos el nombre del día ("Lunes", "Martes") porque ya no viene de la base de datos
  const getDiaNombre = (fechaStr: string) => {
    const [y, m, d] = fechaStr.split('-');
    const date = new Date(Number(y), Number(m) - 1, Number(d));
    return new Intl.DateTimeFormat('es-MX', { weekday: 'long' }).format(date);
  };

  if (!historial || historial.length === 0) {
    return (
      <div className="p-8 text-center border rounded-lg bg-slate-50 border-dashed">
        <p className="text-muted-foreground">No hay registros para este rango de fechas.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 dark:bg-slate-800/50">
            <TableHead>Empleado</TableHead>
            <TableHead>Día y Fecha</TableHead>
            <TableHead>Entrada - Salida</TableHead>
            <TableHead>Estatus</TableHead>
            <TableHead className="text-right">Acción</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {historial.map((row: AsistenciaReporteRow, idx: number) => {
            const nombreCompleto = row.empleados 
              ? `${row.empleados.nombres.split(' ')[0]} ${row.empleados.apellido_paterno}` 
              : 'Desconocido';
              
            const esFaltaInjustificada = row.estado_general === 'FALTA';
            
            return (
              <TableRow key={`${row.id_empleado}-${row.fecha}-${idx}`} className="hover:bg-slate-50/50">
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <UserAvatar 
                      employeeId={row.id_empleado} 
                      name={nombreCompleto} 
                      className="w-9 h-9 border" 
                    />
                    <span>{nombreCompleto}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium capitalize">{getDiaNombre(row.fecha)}</span>
                    <span className="text-xs text-muted-foreground font-mono">{row.fecha}</span>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-sm text-slate-600">
                  {row.estado_general !== 'LABORAL' && row.estado_general !== 'FALTA' ? (
                    <span className="text-slate-400">N/A</span>
                  ) : (
                    `${formatHora(row.hora_entrada_real)} - ${formatHora(row.hora_salida_real)}`
                  )}
                </TableCell>
                <TableCell>
                  {getEstatusUI(row)}
                </TableCell>
                <TableCell className="text-right">
                  {esFaltaInjustificada ? (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 h-8"
                      onClick={() => toast.info(`Justificar falta de ${nombreCompleto}`)}
                    >
                      <UserMinus className="w-4 h-4 mr-2" />
                      Justificar
                    </Button>
                  ) : (
                    <span className="text-slate-400 font-mono text-sm">
                      {row.estado_entrada && row.estado_entrada.includes('RETARDO') ? 'Evaluar' : '--'}
                    </span>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}