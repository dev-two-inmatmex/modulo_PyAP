'use client';

import type { Database } from '@/types/database.types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserAvatar } from "@/components/reutilizables/UserAvatar";
import EmpresaLogo from '../../reutilizables/EmpresaLogo'; // Ajusté la ruta de importación para que sea consistente

// 👇 1. Importamos tu nuevo Modal y sus tipos
import { 
  EditarHorarioModal, TurnoOption, DescansoOption
} from "../horarios/EditarHorarioEmpleado";
import { type HorarioDraft, type DiaSemana, getHorarioBaseActualEmpleado } from "@/services/horarios";

export type TurnoSemanal = Database['public']['Views']['vista_horarios_empleados_semanal']['Row'];

export interface EmpleadoConTurnos {
  id: string | null; // Asegúrate de que no sea null
  nombres: string | null;
  id_empresa: number | null;
  turnos: TurnoSemanal[];
}

// 👇 2. Agregamos los catálogos a las Props para que el padre (page.tsx) nos los pase
interface HorarioVistaProps {
  empleados: EmpleadoConTurnos[];
  mostrarLogo?: boolean;
  horariosDisponibles: TurnoOption[];
  descansosDisponibles: DescansoOption[];
}

const DIAS_SEMANA = [
  { id: 'lunes', label: 'Lunes' },
  { id: 'martes', label: 'Martes' },
  { id: 'miercoles', label: 'Miércoles' },
  { id: 'jueves', label: 'Jueves' },
  { id: 'viernes', label: 'Viernes' },
  { id: 'sabado', label: 'Sábado' },
  { id: 'domingo', label: 'Domingo' }
] as const;

const formatHora = (hora: string | null) => hora ? hora.slice(0, 5) : '--:--';

export function HorarioVista({ 
  empleados, 
  mostrarLogo = false,
  horariosDisponibles,
  descansosDisponibles 
}: HorarioVistaProps) {
  
  if (!empleados || empleados.length === 0) {
    return <div className="text-center p-8 text-muted-foreground border rounded-md bg-muted/20">No hay empleados para mostrar en esta vista.</div>;
  }

  return (
    <div className="grid w-full grid-cols-1 rounded-md border shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Empleado</TableHead>
            {mostrarLogo && (
              <TableHead>Emp.</TableHead>
            )}
            {DIAS_SEMANA.map(({ id, label }) => (
              <TableHead key={id} className="text-center font-bold text-foreground border-l">
                {label}
              </TableHead>
            ))}
            <TableHead className="text-center font-bold text-foreground border-l">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {empleados.map((empleado) => {
            
            // Convertimos la data de este empleado en específico para el Modal
            //const horarioActualBase = getHorarioBaseActualEmpleado(empleado?.id);

            return (
              <TableRow key={empleado.id} className="hover:bg-muted/50">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <UserAvatar
                      employeeId={empleado.id}
                      name={empleado.nombres || 'Desconocido'}
                      className="w-10 h-10"
                    />
                    <span>{empleado.nombres}</span>
                  </div>
                </TableCell>

                {mostrarLogo && empleado.id_empresa && (
                  <TableCell>
                    <EmpresaLogo id={empleado.id_empresa} wyh={20} />
                  </TableCell>
                )}

                {DIAS_SEMANA.map(({ id }) => {
                  const turnoDelDia = empleado.turnos.find((t) => t[id as keyof TurnoSemanal] === true);

                  if (!turnoDelDia) {
                    return (
                      <TableCell key={id}>
                        <span className="inline-flex w-full items-center justify-center bg-emerald-600/10 text-emerald-700 dark:text-emerald-400 rounded-sm px-2 py-1.5 font-medium text-xs">
                          Libre
                        </span>
                      </TableCell>
                    );
                  }

                  return (
                    <TableCell key={id}>
                      <div className="inline-flex w-full items-center justify-center bg-muted/40 border border-muted-foreground/20 rounded-sm px-2 py-1.5">
                        <span className="text-[11px] font-semibold text-foreground whitespace-nowrap">
                          {formatHora(turnoDelDia.entrada)} - {formatHora(turnoDelDia.salida)}
                        </span>
                      </div>
                    </TableCell>
                  );
                })}

                <TableCell className="text-center">
                  <EditarHorarioModal 
                    empleadoId={empleado.id}
                    empleadoNombre={empleado.nombres || 'Desconocido'}
                    horariosDisponibles={horariosDisponibles}
                    descansosDisponibles={descansosDisponibles}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}