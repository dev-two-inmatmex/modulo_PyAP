'use client';

import React, { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useNombreEmpleado } from '@/components/providers/NombreEmpleadoProvider';
import { AsistenciaReporteRow } from '@/services/asistencias';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { vista_empleado_ubicacion } from '@/services/ubicaciones';
import { UserAvatar } from '@/components/reutilizables/UserAvatar';
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ConfirmarInasistenciaDialog } from './AsistenciaDialogConfirmarInasistencia';
import { Button } from '@/components/ui/button';

// Helper to get badge variant
const getStatusBadge = (status: string | null | undefined): 'secondary' | 'destructive' | 'outline' => {
  if (!status) return 'secondary';
  const lowerStatus = status.toLowerCase();
  if (lowerStatus.includes('retardo_grave') || lowerStatus.includes('anticipada')) return 'destructive';
  if (lowerStatus.includes('inasistencia')) return 'destructive';
  if (lowerStatus.includes('ausente')) return 'outline';
  return 'secondary';
};

// Prop Types
type TurnoDetalle = {
  empleado_id: string;
};

type TurnoData = {
  hora_entrada: string;
  detalles_empleados: TurnoDetalle[];
  total_personas: number;
};

type AsistenciasMap = Record<string, AsistenciaReporteRow>;
type InasistenciasMap = Record<string, { capturo: string; }>;
type HorariosMap = Record<string, { entrada: string; salida: string; }>;

type ubicacionesMap = Record<string, vista_empleado_ubicacion>;

type FilterStatus = 'todos' | 'presentes' | 'ausentes';

interface Props {
  turnos: TurnoData[];
  asistencias: AsistenciasMap;
  inasistencias: InasistenciasMap;
  horarios: HorariosMap;
  ubicaciones: ubicacionesMap;
}

export const AsistenciaTablaTurnos: React.FC<Props> = ({ turnos, asistencias, inasistencias, horarios, ubicaciones }) => {
  const { getNombreEmpleadoPorId } = useNombreEmpleado();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('todos');

  const filteredTurnos = useMemo(() => {
    if (!turnos) return [];

    // First, filter employees within each shift
    const turnosConEmpleadosFiltrados = turnos.map(turno => {
      const empleadosFiltrados = turno.detalles_empleados.filter(empleado => {
        const nombre = getNombreEmpleadoPorId(empleado.empleado_id)?.nombre_corto || '';
        const tieneAsistencia = !!asistencias[empleado.empleado_id];

        // Status filter logic
        if (filterStatus === 'presentes' && !tieneAsistencia) return false;
        if (filterStatus === 'ausentes' && tieneAsistencia) return false;

        // Search term filter logic
        if (searchTerm && !nombre.toLowerCase().includes(searchTerm.toLowerCase())) {
          return false;
        }

        return true;
      });

      return {
        ...turno,
        detalles_empleados: empleadosFiltrados,
      };
    });

    // Then, remove any shifts that are now empty
    return turnosConEmpleadosFiltrados.filter(turno => turno.detalles_empleados.length > 0);

  }, [turnos, searchTerm, filterStatus, getNombreEmpleadoPorId, asistencias]);


  if (!turnos || turnos.length === 0) {
    return <p className="text-center text-gray-500 py-4">No hay turnos programados para hoy.</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative grow">
          <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por nombre de empleado..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 w-full"
          />
        </div>
        <Select value={filterStatus} onValueChange={(value: FilterStatus) => setFilterStatus(value)}>
          <SelectTrigger className="w-full sm:w-45">
            <SelectValue placeholder="Filtrar estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="presentes">Presentes</SelectItem>
            <SelectItem value="ausentes">Ausentes</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Empleado</TableHead>
              <TableHead>Entrada</TableHead>
              <TableHead>Salida</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTurnos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No se encontraron resultados.
                </TableCell>
              </TableRow>
            ) : (
              filteredTurnos.map((turno) => {
                const presentes = turno.detalles_empleados.filter(emp => asistencias[emp.empleado_id]).length;

                return (
                  <React.Fragment key={turno.hora_entrada}>
                    <TableRow className="bg-muted/50 hover:bg-muted/50 sticky top-0">
                      <TableCell colSpan={8} className="font-semibold">
                        <div className="flex justify-between w-full">
                          <span>Turno de las {turno.hora_entrada}</span>
                          <Badge variant="secondary">{presentes} / {turno.total_personas}</Badge>
                        </div>
                      </TableCell>
                    </TableRow>

                    {turno.detalles_empleados.map(({ empleado_id }) => {
                      const nombre = getNombreEmpleadoPorId(empleado_id)?.nombre_corto || `ID: ${empleado_id}`;
                      const asistenciaInfo = asistencias[empleado_id];
                      const inasistenciaInfo = inasistencias[empleado_id];
                      const horarioInfo = horarios[empleado_id];

                      console.log("asistenciaInfo", asistenciaInfo)
                      const ubicacionInfo = ubicaciones[empleado_id];

                      if (!asistenciaInfo) {
                        return (
                          <Popover key={empleado_id}>
                            <PopoverTrigger asChild>
                              <TableRow className="opacity-60">
                                <TableCell>
                                  <ul>
                                    <li>
                                      <UserAvatar employeeId={empleado_id} name={nombre} className='w-6 h-6' />
                                    </li>
                                    <li>{nombre}</li>
                                  </ul>
                                </TableCell>
                                <TableCell>
                                  <ul>
                                    <li>
                                      {horarioInfo?.entrada || turno.hora_entrada}
                                    </li>
                                    <li>
                                      {inasistenciaInfo && (
                                        <Badge variant={getStatusBadge("inasistencias")}>
                                          Inasistencia confirmada por {getNombreEmpleadoPorId(inasistenciaInfo.capturo)?.nombre_corto}
                                          </Badge>
                                      )}
                                      {!inasistenciaInfo && (
                                        <ul>
                                          <li>
                                            <Badge variant="outline">Ausente</Badge>
                                          </li>
                                          <li>
                                            <Badge variant={'outline'}>{ubicacionInfo?.nombre_ubicacion || 'Sin ubicación'}</Badge>
                                          </li>
                                        </ul>
                                      )}
                                    </li>

                                  </ul>
                                </TableCell>
                              </TableRow>
                            </PopoverTrigger>
                            <PopoverContent>
                              <PopoverHeader>
                                <PopoverTitle>Ausencia registrada</PopoverTitle>
                                <>
                                  {!inasistenciaInfo && (
                                    <ConfirmarInasistenciaDialog id_empleado={empleado_id} />
                                  )}

                                  <Button variant="outline">Justificar Falta</Button>

                                </>
                              </PopoverHeader>
                            </PopoverContent>
                          </Popover>
                        );
                      }

                      return (
                        <TableRow key={empleado_id}>
                          <TableCell>
                            <ul>
                              <li>
                                <UserAvatar employeeId={empleado_id} name={nombre} className='w-6 h-6' />
                              </li>
                              <li>{nombre}</li>
                            </ul></TableCell>
                          <TableCell>
                            <ul>
                              <li>
                                {asistenciaInfo?.hora_entrada_real}
                              </li>
                              <li>
                                <Badge variant={getStatusBadge(asistenciaInfo?.estado_entrada)}>
                                  {asistenciaInfo?.estado_entrada}
                                </Badge>
                              </li>
                              <li>
                                {asistenciaInfo?.ubicacion_entrada}
                              </li>
                            </ul>
                          </TableCell>
                          <TableCell>
                            <ul>
                              <li>
                                {asistenciaInfo?.hora_salida_real}
                              </li>
                              <li>
                                {asistenciaInfo?.hora_salida_real && (
                                  <Badge variant={getStatusBadge(asistenciaInfo?.estado_salida)}>
                                    {asistenciaInfo?.estado_salida}
                                  </Badge>
                                )}
                              </li>
                            </ul>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </React.Fragment>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
