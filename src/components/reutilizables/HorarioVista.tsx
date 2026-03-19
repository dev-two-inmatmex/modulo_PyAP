'use client';

import type { Database } from '@/types/database.types';
import { Pencil } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/reutilizables/UserAvatar";
export type TurnoSemanal = Database['public']['Views']['vista_horarios_empleados_semanal']['Row'];

// Creamos un nuevo tipo que combina la info del empleado con sus turnos
export interface EmpleadoConTurnos {
  id: string | null;
  nombres: string | null;
  turnos: TurnoSemanal[];
}

interface HorarioVistaProps {
  empleados: EmpleadoConTurnos[];
}

// Agregamos Domingo a la lista
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

export function HorarioVista({ empleados }: HorarioVistaProps) {
  if (!empleados || empleados.length === 0) {
    return <div className="text-center p-8 text-muted-foreground border rounded-md bg-muted/20">No hay empleados para mostrar en esta vista.</div>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead className="text-foreground">Empleado</TableHead>
            {DIAS_SEMANA.map(({ id, label }) => (
              <TableHead key={id} className="text-center font-bold text-foreground border-l ">
                {label}
              </TableHead>
            ))}
            {/* Columna final para el botón de editar */}
            <TableHead className="text-center font-bold text-foreground border-l">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {empleados.map((empleado) => (
            <TableRow key={empleado.id} className="hover:bg-muted/50">
              <TableCell>
                <UserAvatar
                  employeeId={empleado.id}
                  name={empleado.nombres}
                  className="w-10 h-10"
                />
              </TableCell>
              <TableCell >
                {empleado.nombres}
              </TableCell>

              {DIAS_SEMANA.map(({ id }) => {
                // Buscamos si el empleado tiene turno este día
                const turnoDelDia = empleado.turnos.find((t) => t[id as keyof TurnoSemanal] === true);

                // DÍA LIBRE
                if (!turnoDelDia) {
                  return (
                    <TableCell key={id}>
                      <span className="inline-flex w-full items-center justify-center bg-emerald-600/10 text-emerald-700 dark:text-emerald-400 rounded-sm px-2 py-1.5 font-medium text-xs">
                        Libre
                      </span>
                    </TableCell>
                  );
                }

                // DÍA DE TRABAJO
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

              {/* BOTÓN DE EDICIÓN AL FINAL */}
              <TableCell >
                <Button variant="ghost" size="icon" title={`Editar horario de ${empleado.nombres}`} className="h-8 w-8 text-muted-foreground hover:text-primary">
                  <Pencil className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}