'use client';

import type { Database } from '@/types/database.types';
import { Coffee, CalendarOff } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type TurnoSemanal = Database['public']['Views']['vista_horarios_empleados_semanal']['Row'];

interface HorarioVistaProps {
  turnos: TurnoSemanal[];
  cargando?: boolean;
}

const DIAS_SEMANA = [
  { id: 'lunes', label: 'Lunes' },
  { id: 'martes', label: 'Martes' },
  { id: 'miercoles', label: 'Miércoles' },
  { id: 'jueves', label: 'Jueves' },
  { id: 'viernes', label: 'Viernes' },
  { id: 'sabado', label: 'Sábado' }
] as const;

// --- FUNCIONES AUXILIARES ---
const generarIntervalosTiempo = (intervaloMins = 30) => {
  const intervalos = [];
  const startHour = 7; // Desde las 07:00
  const endHour = 18;  // Hasta las 18:00

  for (let h = startHour; h <= endHour; h++) {
    for (let m = 0; m < 60; m += intervaloMins) {
      if (h === endHour && m > 0) break; // Para terminar exactamente a las 18:00
      
      const formatTime = (hour: number, minute: number) => 
        `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      
      const startTimeStr = formatTime(h, m);
      const totalMinutesStart = h * 60 + m;
      const totalMinutesEnd = totalMinutesStart + intervaloMins;

      const endHourActual = Math.floor(totalMinutesEnd / 60);
      const endMinuteActual = totalMinutesEnd % 60;
      const endTimeStr = formatTime(endHourActual, endMinuteActual);

      // Evitar crear un bloque extra al final
      if (totalMinutesStart >= endHour * 60) break;

      intervalos.push({
        label: `${startTimeStr} - ${endTimeStr}`,
        startInMins: totalMinutesStart,
        endInMins: totalMinutesEnd,
      });
    }
  }
  return intervalos;
};

const timeToMinutes = (timeStr: string | null) => {
  if (!timeStr) return null;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

const getEstadoCelda = (turno: TurnoSemanal, intervaloInicioMins: number, intervaloFinMins: number) => {
  const entradaMins = timeToMinutes(turno.entrada);
  const salidaMins = timeToMinutes(turno.salida);
  const descInicioMins = timeToMinutes(turno.salida_descanso);
  const descFinMins = timeToMinutes(turno.regreso_descanso);

  if (entradaMins === null || salidaMins === null) return 'fuera';

  // Descanso
  if (descInicioMins !== null && descFinMins !== null && 
      intervaloInicioMins >= descInicioMins && intervaloFinMins <= descFinMins) {
    return 'descanso';
  }

  // Fuera del horario laboral
  if (intervaloFinMins <= entradaMins || intervaloInicioMins >= salidaMins) {
    return 'fuera';
  }

  // Trabajo
  if (intervaloInicioMins >= entradaMins && intervaloFinMins <= salidaMins) {
    return 'trabajo';
  }

  return 'fuera';
};

// --- COMPONENTE ---
export function HorarioVista({ turnos, cargando = false }: HorarioVistaProps) {
  const intervalosTiempo = generarIntervalosTiempo(30);

  if (cargando) {
    return <div className="text-center p-8 text-muted-foreground animate-pulse">Cargando horario...</div>;
  }

  if (!turnos || turnos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg bg-muted/30">
        <CalendarOff className="w-12 h-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No hay turnos asignados.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border bg-card overflow-hidden">
      {/* Envolvemos en un div con overflow para no romper la pantalla en móviles */}
      <div className="overflow-x-auto">
        <Table className="min-w-[800px]">
          <TableHeader className="bg-muted/50">
            <TableRow className="bg-slate-50/50">
              {/* Celda vacía superior izquierda */}
              <TableHead className="w-[60px]">Hora</TableHead>
              {DIAS_SEMANA.map(({ id, label }) => (
                <TableHead key={id} className="">
                  {label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {intervalosTiempo.map((intervalo) => (
              <TableRow key={intervalo.label} className="hover:bg-transparent">
                {/* Columna de la hora */}
                <TableCell className="">
                  {intervalo.label}
                </TableCell>
                
                {/* Columnas de los días */}
                {DIAS_SEMANA.map(({ id }) => {
                  const turnoDelDia = turnos.find((t) => t[id as keyof TurnoSemanal] === true);

                  if (!turnoDelDia) {
                    // Día libre
                    return <TableCell key={id} className="border-r border-b p-0" />;
                  }

                  const estado = getEstadoCelda(turnoDelDia, intervalo.startInMins, intervalo.endInMins);

                  // --- APLICACIÓN DE COLORES DE SHADCN ---
                  
                  if (estado === 'trabajo') {
                    // bg-primary: El color principal de tu tema (normalmente negro o el color de tu marca)
                    return <TableCell key={id} className="border-r border-b bg-primary p-0" />;
                  }

                  if (estado === 'descanso') {
                    // bg-secondary: Un color secundario/atenuado de tu tema, perfecto para el descanso
                    return (
                      <TableCell key={id} className="border-r border-b bg-secondary p-0">
                        <div className="flex h-full w-full items-center justify-center py-2">
                          <Coffee className="w-4 h-4 text-secondary-foreground opacity-50" />
                        </div>
                      </TableCell>
                    );
                  }

                  // Fuera de horario pero en un día de trabajo
                  return <TableCell key={id} className="border-r border-b p-0 bg-muted/10" />;
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}