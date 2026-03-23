'use client';

import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/reutilizables/UserAvatar";
import { Clock, CheckCircle2, AlertCircle, UserMinus, Palmtree, Stethoscope, Ban, CalendarX } from "lucide-react";
import { toast } from "sonner";
import type { HistorialAsistenciaRow } from "@/services/asistencias";



export function HistorialAsistencia( historial : HistorialAsistenciaRow[]) {
  
  const getEstatusUI = (registro: HistorialAsistenciaRow) => {
    if (registro.motivo_ausencia) {
      switch (registro.motivo_ausencia) {
        case 'Vacaciones': return <Badge className="bg-blue-100 text-blue-800"><Palmtree className="w-3 h-3 mr-1" /> Vacaciones</Badge>;
        case 'Incapacidad': return <Badge className="bg-yellow-100 text-yellow-800"><Stethoscope className="w-3 h-3 mr-1" /> Incapacidad</Badge>;
        case 'Baja Permanente': return <Badge className="bg-slate-200 text-slate-700"><Ban className="w-3 h-3 mr-1" /> Baja Permanente</Badge>;
        default: return <Badge variant="outline"><CalendarX className="w-3 h-3 mr-1" /> {registro.motivo_ausencia}</Badge>;
      }
    }
    if (registro.entrada) {
      switch (registro.estatus) {
        case 'Puntual': return <Badge className="bg-green-100 text-green-800"><CheckCircle2 className="w-3 h-3 mr-1" /> Puntual</Badge>;
        case 'Retraso Leve': return <Badge className="bg-orange-100 text-orange-800"><Clock className="w-3 h-3 mr-1" /> Retraso Leve</Badge>;
        case 'Retraso Grave': return <Badge className="bg-red-100 text-red-800"><AlertCircle className="w-3 h-3 mr-1" /> Retraso Grave</Badge>;
        default: return <Badge variant="outline">Asistencia Registrada</Badge>;
      }
    }
    return <Badge variant="destructive" className="bg-red-50 text-red-700">Falta sin Justificar</Badge>;
  };

  const handleRegistrarFalta = (empleadoId: string, nombre: string, fecha: string) => {
    toast.info(`Abriendo formulario de falta para ${nombre} el día ${fecha}`);
  };

  const formatHora = (timeString: string | null) => {
    if (!timeString) return '--:--';
    return timeString.substring(0, 5); 
  };

  // ==========================================
  // PROTECCIÓN Y DEPURACIÓN (AQUÍ ESTABA EL ERROR)
  // ==========================================
  
  // 1. Si Supabase manda un undefined o null absoluto
  if (!historial) {
    return <p className="p-4 border rounded bg-slate-50">Cargando datos...</p>;
  }
  let datosReales: HistorialAsistenciaRow[] = [];

  if (Array.isArray(historial)) {
    datosReales = historial; // Si viene normal
  } else if (historial && typeof historial === 'object') {
    // Si viene envuelto en la "caja extra" que vimos en tu imagen
    if (Array.isArray((historial as any).historial)) {
      datosReales = (historial as any).historial;
    } else if (Array.isArray((historial as any).data)) {
      datosReales = (historial as any).data;
    }
  // 2. Si Supabase mandó los datos envueltos en otro objeto (ej. { data: [...] })
  // Lo extraemos a la fuerza
  //const datosReales = Array.isArray(historial) ? historial : (historial as any).data || [];

  // 3. Si definitivamente está vacío
  if (datosReales.length === 0) {
    return (
      <div className="p-8 text-center border rounded-lg bg-slate-50 border-dashed">
        <p className="text-muted-foreground">No hay registros para este rango de fechas.</p>
        <span className="text-xs text-slate-400">Datos recibidos: {JSON.stringify(historial)}</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Etiqueta de depuración para confirmar cuántos lee la tabla */}
      <div className="text-sm font-medium text-slate-500">
        Mostrando {datosReales.length} registros en la tabla
      </div>

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
            {datosReales.map((row: HistorialAsistenciaRow, idx: number) => {
              const esFaltaInjustificada = !row.entrada && !row.motivo_ausencia;
              
              return (
                <TableRow key={`${row.empleado_id}-${row.fecha}-${idx}`} className="hover:bg-slate-50/50">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <UserAvatar 
                        employeeId={row.empleado_id} 
                        name={row.nombre_completos || 'Desconocido'} 
                        className="w-9 h-9 border" 
                      />
                      <span>{row.nombre_completos}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium capitalize">{row.dia_nombre}</span>
                      <span className="text-xs text-muted-foreground font-mono">{row.fecha}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm text-slate-600">
                    {row.motivo_ausencia ? (
                      <span className="text-slate-400">N/A</span>
                    ) : (
                      `${formatHora(row.entrada)} - ${formatHora(row.salida)}`
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
                        onClick={() => handleRegistrarFalta(row.empleado_id, row.nombre_completos, row.fecha)}
                      >
                        <UserMinus className="w-4 h-4 mr-2" />
                        Registrar
                      </Button>
                    ) : (
                      <span className="text-slate-400 font-mono text-sm">
                        {row.estatus && row.estatus.includes('Retraso') ? 'Evaluar min.' : '--'}
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
}