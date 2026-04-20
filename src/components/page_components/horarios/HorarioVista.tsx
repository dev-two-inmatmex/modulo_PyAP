'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserAvatar } from "@/components/reutilizables/UserAvatar";
import EmpresaLogo from '../../reutilizables/EmpresaLogo';
import { 
  EditarHorarioModal, TurnoOption, DescansoOption
} from "../horarios/EditarHorarioEmpleado";
import { useNombreEmpleado } from "@/components/providers/NombreEmpleadoProvider";

// Tipos adaptados a la respuesta exacta de tus funciones
type InfoDiaHorario = { hora_entrada: string | null; hora_salida: string | null } | null;
type InfoDiaDescanso = { inicio_descanso: string | null; fin_descanso: string | null } | null;

export interface EmpleadoProcesado {
  id: string;
  nombres: string | null;
  id_empresa: number | null;
  configuracion: {
    turnos: Record<string, any> | null; 
    descansos: Record<string, any> | null;
  }
}

interface HorarioVistaProps {
  empleados: EmpleadoProcesado[];
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

// Utilidad para limpiar el formato de hora (ej: de "08:00:00" a "08:00")
const formatHora = (hora: string | null) => hora ? hora.slice(0, 5) : '--:--';

export function HorarioVista({ 
  empleados, 
  mostrarLogo = false,
  horariosDisponibles,
  descansosDisponibles 
}: HorarioVistaProps) {
  
  const { getNombreEmpleadoPorId: getEmployeeById } = useNombreEmpleado();
  if (!empleados || empleados.length === 0) {
    return <div className="text-center p-8 text-muted-foreground border rounded-md bg-muted/20">No hay empleados para mostrar en esta vista.</div>;
  }

  return (
    <div className="grid w-full grid-cols-1 rounded-md border shadow-sm overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Empleado</TableHead>
            {mostrarLogo && <TableHead>Emp.</TableHead>}
            {DIAS_SEMANA.map(({ id, label }) => (
              <TableHead key={id} className="text-center font-bold text-foreground border-l">
                {label}
              </TableHead>
            ))}
            <TableHead className="text-center font-bold text-foreground border-l">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {empleados.map((emp) => (
            <TableRow key={emp.id} className="hover:bg-muted/50">
              <TableCell>
                <div className="flex items-center gap-3">
                  <UserAvatar
                    employeeId={emp.id}
                    name={getEmployeeById(emp.id)?.nombre_corto || 'Desconocido'}
                    className="w-10 h-10"
                  />
                  <span className="font-medium">{getEmployeeById(emp.id)?.nombre_corto}</span>
                </div>
              </TableCell>
              {mostrarLogo && (
                <TableCell>
                  {emp.id_empresa ? <EmpresaLogo id={emp.id_empresa} wyh={24} /> : '-'}
                </TableCell>
              )}

              {DIAS_SEMANA.map(dia => {
                // Extraemos la información de este día específico
                const infoTurno = emp.configuracion.turnos?.[dia.id] as InfoDiaHorario;
                const infoDescanso = emp.configuracion.descansos?.[dia.id] as InfoDiaDescanso;

                return (
                  <TableCell key={dia.id} className="p-2 border-l min-w-30">
                    <div className="flex flex-col gap-1.5 items-center">
                      
                      {infoTurno && infoTurno.hora_entrada ? (
                        <div className="text-[11px] bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-100 w-full text-center font-semibold">
                          {formatHora(infoTurno.hora_entrada)} - {formatHora(infoTurno.hora_salida)}
                        </div>
                      ) : (
                        <div className="text-[11px] text-muted-foreground bg-muted/40 px-2 py-1 rounded w-full text-center italic border border-transparent">
                          Descanso
                        </div>
                      )}
                      {infoDescanso && infoDescanso.inicio_descanso ? (
                        <div className="text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-100 w-full text-center flex justify-center items-center gap-1">
                          ☕ {formatHora(infoDescanso.inicio_descanso)} - {formatHora(infoDescanso.fin_descanso)}
                        </div>
                      ) : (
                        <div className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-100 w-full text-center">
                          Sin Pausa
                        </div>
                      )}

                    </div>
                  </TableCell>
                );
              })}
              <TableCell className="text-center border-l">
                <EditarHorarioModal 
                  empleadoId={emp.id}
                  empleadoNombre={getEmployeeById(emp.id)?.nombre_corto || 'Desconocido'}
                  horariosDisponibles={horariosDisponibles}
                  descansosDisponibles={descansosDisponibles}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}