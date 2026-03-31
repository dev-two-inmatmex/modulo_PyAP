'use client';

import * as React from "react";
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
import { Clock, CheckCircle2, AlertCircle, MinusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import EmpresaLogo from "@/components/reutilizables/EmpresaLogo";

interface EmpleadoDetalle {
  empleado_id: string;
  nombre_completos: string;
  id_empresa?: number;
}

interface TurnoData {
  entrada: string;
  detalles_empleados: EmpleadoDetalle[];
  total_personas: number;
  id_empresa?: number;
}

interface TablasTurnosProps {
  turnos: TurnoData[];
  asistencias: Record<string, { hora: string; estatus: string; ubicacion: string }>;
  turnoCompleto: Record<string, { entrada: string; salida: string; salida_descanso: string; regreso_descanso: string }>;
  mostrarLogo?: boolean;
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
    return { texto: 'Falta', clase: 'bg-slate-100 text-slate-600 border-slate-200', icono: <MinusCircle className="w-3 h-3 mr-1" /> };
  }
  switch (storedStatus) {
    case 'Puntual': return { texto: 'Puntual', clase: 'bg-green-100 text-green-800 border-green-300', icono: <CheckCircle2 className="w-3 h-3 mr-1" /> };
    case 'Retraso Leve': return { texto: 'Retraso Leve', clase: 'bg-orange-100 text-orange-800 border-orange-300', icono: <Clock className="w-3 h-3 mr-1" /> };
    case 'Retraso Grave': return { texto: 'Retraso Grave', clase: 'bg-red-100 text-red-800 border-red-300', icono: <AlertCircle className="w-3 h-3 mr-1" /> };
    default: return { texto: 'Estatus Desconocido', clase: 'bg-slate-100 text-slate-600 border-slate-200', icono: <MinusCircle className="w-3 h-3 mr-1" /> };
  }
};

export function TablasTurnos({ turnos, asistencias, turnoCompleto, mostrarLogo = false }: TablasTurnosProps) {

  const turnosAgrupados = React.useMemo(() => {
    if (!turnos) return [];

    const agrupados: Record<string, TurnoData> = {};

    turnos.forEach(turno => {
      // Si la hora aún no existe en nuestro objeto, la creamos
      const empleadosConEmpresa = turno.detalles_empleados.map(emp => ({
        ...emp,
        id_empresa: turno.id_empresa
      }));
      if (!agrupados[turno.entrada]) {
        agrupados[turno.entrada] = {
          entrada: turno.entrada,
          // Clonamos el arreglo para no modificar los datos originales por accidente
          detalles_empleados: [...empleadosConEmpresa],
          total_personas: turno.total_personas
        };
      } else {
        // Si ya existe otra empresa con la misma hora, fusionamos a los empleados
        agrupados[turno.entrada].detalles_empleados.push(...empleadosConEmpresa);
        agrupados[turno.entrada].total_personas += turno.total_personas;
      }
    });

    // Convertimos el objeto de vuelta a un arreglo y lo ordenamos por hora
    return Object.values(agrupados).sort((a, b) => a.entrada.localeCompare(b.entrada));
  }, [turnos]);

  if (!turnosAgrupados || turnosAgrupados.length === 0) {
    return <p>No hay datos de turnos para mostrar.</p>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
      {/* 👇 Ahora mapeamos 'turnosAgrupados' en lugar de 'turnos' 👇 */}
      {turnosAgrupados.map((turno) => {
        const llegaron = turno.detalles_empleados.filter(e => asistencias[e.empleado_id]).length;
        return (
          // Al estar agrupados, la llave 'turno.entrada' vuelve a ser 100% única
          <Card key={turno.entrada} className="overflow-hidden shadow-sm">
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
                    <TableHead>Empleado</TableHead>
                    {mostrarLogo && (
                      <TableHead>Emp.</TableHead>
                    )}
                    <TableHead>Llegada</TableHead>
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
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-3">
                                <UserAvatar
                                  employeeId={empleado.empleado_id}
                                  name={empleado.nombre_completos}
                                  className="w-10 h-10"
                                />
                                <span>{empleado.nombre_completos}</span>
                              </div>
                            </TableCell>

                            {mostrarLogo && empleado.id_empresa && (
                              <TableCell>
                                <EmpresaLogo id={empleado.id_empresa} wyh={20} />
                              </TableCell>
                            )}

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
                                    {!asistencia && (
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