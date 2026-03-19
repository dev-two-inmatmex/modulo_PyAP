'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserAvatar } from "@/components/reutilizables/UserAvatar";
import { Clock, CheckCircle2, AlertCircle, XCircle, MinusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmpleadoDetalle {
  empleado_id: string;
  nombre_completos: string;
}

interface TurnoData {
  entrada: string;
  detalles_empleados: EmpleadoDetalle[];
  total_personas: number;
}

interface TablasTurnosProps {
  turnos: TurnoData[];
  avatarUrls: Record<string, string>;
  asistencias: Record<string, { hora: string; estatus: string; ubicacion: string }>;
  turnoCompleto: Record<string, { entrada: string; salida: string; salida_descanso: string; regreso_descanso: string }>;
}

const formatearHora = (hora: string) => {
  if (!hora) return '--:--';
  const [h, m] = hora.split(':');
  const date = new Date();
  date.setHours(parseInt(h), parseInt(m));
  return date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: true });
};

const getEstatusUI = (storedStatus: string | null) => {
  if (!storedStatus) {
    return {
      texto: 'Sin Entrada',
      clase: 'bg-slate-100 text-slate-600 border-slate-200',
      icono: <MinusCircle className="w-3 h-3 mr-1" />
    };
  }

  // Comparamos directamente contra las cadenas de texto almacenadas en la base de datos
  switch (storedStatus) {
    case 'Puntual':
      return {
        texto: 'Puntual',
        clase: 'bg-green-100 text-green-800 border-green-300',
        icono: <CheckCircle2 className="w-3 h-3 mr-1" />
      };
    case 'Retraso Leve':
      return {
        texto: 'Retraso Leve',
        clase: 'bg-orange-100 text-orange-800 border-orange-300',
        icono: <Clock className="w-3 h-3 mr-1" />
      };
    case 'Retraso Grave':
      return {
        texto: 'Retraso Grave',
        clase: 'bg-red-100 text-red-800 border-red-300',
        icono: <AlertCircle className="w-3 h-3 mr-1" />
      };
    default:
      // Fallback para estatus desconocidos o inesperados
      return {
        texto: 'Estatus Desconocido',
        clase: 'bg-slate-100 text-slate-600 border-slate-200',
        icono: <MinusCircle className="w-3 h-3 mr-1" />
      };
  }
};

export function TablasTurnos({ turnos, asistencias, turnoCompleto }: TablasTurnosProps) {
  if (!turnos || turnos.length === 0) {
    return <p>No hay datos de turnos para mostrar.</p>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
      {turnos.map((turno) => {
        const llegaron = turno.detalles_empleados.filter(e => asistencias[e.empleado_id]).length;
        return (
          <Card key={turno.entrada} className="overflow-hidden shawdow-sm">
            <CardHeader className="bg-slate-50 border-b py-4">
              <CardTitle className="text-lg flex justify-between items-center">
                <span>Turno: {formatearHora(turno.entrada)}</span>
                <span className={`text-sm font-medium px-3 py-1 rounded-full border ${llegaron === turno.total_personas ? 'bg-green-100 text-green-800 border-green-200' : 'bg-white text-slate-600'
                  }`}>
                  {llegaron} / {turno.total_personas} Registrados
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50">
                    <TableHead className="w-[60px]"></TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>LLegada</TableHead>
                    <TableHead>Estatus</TableHead>
                    <TableHead>Ubicacion</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {turno.detalles_empleados.map((empleado) => {
                    const asistencia = asistencias[empleado.empleado_id];
                    const turnohyd = turnoCompleto[empleado.empleado_id];
                    const estatusUI = getEstatusUI(asistencia ? asistencia.estatus : null);
                    return (
                      <Popover key={empleado.empleado_id}>
                        <PopoverTrigger asChild>
                          <TableRow className="cursor-pointer hover:bg-slate-50/50">
                            <TableCell>
                              <UserAvatar
                                employeeId={empleado.empleado_id}
                                name={empleado.nombre_completos}
                                className="w-10 h-10"
                              />
                            </TableCell>
                            <TableCell>{empleado.nombre_completos}</TableCell>
                            <TableCell className="text-slate-600 font-mono text-sm">
                              {asistencia ? formatearHora(asistencia.hora) : '--:--'}
                            </TableCell>
                            <TableCell>
                              <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold border ${estatusUI.clase}`}>
                                {estatusUI.icono}
                                {estatusUI.texto}
                              </span>
                            </TableCell>
                            <TableCell>
                              {asistencia ? asistencia.ubicacion : '--'}
                            </TableCell>
                          </TableRow>
                        </PopoverTrigger>
                        <PopoverContent align="center">
                          <PopoverHeader>
                            <PopoverTitle>Turno Completo</PopoverTitle>
                            <div >
                            {turnohyd ? (
                              <>
                                <div >
                                  <span>Entrada: </span>
                                  <span>{formatearHora(turnohyd.entrada)}</span>
                                </div>
                                <div >
                                  <span>Salida Descanso: </span>
                                  <span>{formatearHora(turnohyd.salida_descanso)}</span>
                                </div>
                                <div >
                                  <span>Regreso Descanso: </span>
                                  <span>{formatearHora(turnohyd.regreso_descanso)}</span>
                                </div>
                                <div >
                                  <span >Salida: </span>
                                  <span>{formatearHora(turnohyd.salida)}</span>
                                </div>
                                <div>
                                  { !asistencia &&(
                                  <Button variant="outline">Guardar Falta</Button>)}
                                </div>

                              </>
                            ) : (
                              <span>Sin horario asignado</span>
                            )}
                            </div>
                          </PopoverHeader>
                        </PopoverContent>
                      </Popover>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
