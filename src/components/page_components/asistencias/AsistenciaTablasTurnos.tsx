/*'use client';

import React, { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useNombreEmpleado } from '@/components/providers/NombreEmpleadoProvider';
import { AsistenciaReporteRow } from '@/services/asistencias';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Ban, CalendarX, CheckCircle2, Clock, Coffee, Palmtree, Search, Stethoscope } from 'lucide-react';
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
const getEstatusUI = (registro?: AsistenciaReporteRow) => {
  if (!registro) return <Badge variant="outline" className="text-slate-500">Ausente</Badge>;

  if (registro.estado_general && registro.estado_general !== 'LABORAL') {
    switch (registro.estado_general) {
      case 'VACACIONES': return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-transparent"><Palmtree className="w-3 h-3 mr-1" /> Vacaciones</Badge>;
      case 'INCAPACIDAD': return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-transparent"><Stethoscope className="w-3 h-3 mr-1" /> Incapacidad</Badge>;
      case 'BAJA': return <Badge className="bg-slate-200 text-slate-700 hover:bg-slate-300 border-transparent"><Ban className="w-3 h-3 mr-1" /> Baja</Badge>;
      case 'DESCANSO': return <Badge variant="outline" className="text-slate-500"><Coffee className="w-3 h-3 mr-1" /> Descanso</Badge>;
      case 'FALTA': return <Badge variant="destructive" className="bg-red-50 text-red-700 hover:bg-red-100 border-red-200">Falta Injustificada</Badge>;
      case 'SIN_HORARIO': return <Badge variant="outline"><CalendarX className="w-3 h-3 mr-1" /> Sin Horario Asignado</Badge>;
    }
  }

  if (registro.hora_entrada_real) {
    switch (registro.estado_entrada) {
      case 'PUNTUAL': return <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-transparent"><CheckCircle2 className="w-3 h-3 mr-1" /> Puntual</Badge>;
      case 'RETARDO_LEVE': return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200 border-transparent"><Clock className="w-3 h-3 mr-1" /> Retraso Leve</Badge>;
      case 'RETARDO_GRAVE': return <Badge className="bg-red-100 text-red-800 hover:bg-red-200 border-transparent"><AlertCircle className="w-3 h-3 mr-1" /> Retraso Grave</Badge>;
    }
  }
  return <Badge variant="outline">Asistencia Registrada</Badge>;
};

const getEstatusSalidaUI = (registro?: AsistenciaReporteRow) => {
  if (!registro || !registro.hora_salida_real) return null;

  switch (registro.estado_salida) {
    case 'SALIDA_ANTICIPADA': return <Badge className="bg-red-100 text-red-800 hover:bg-red-200 border-transparent"><AlertCircle className="w-3 h-3 mr-1" /> Salida Anticipada</Badge>;
    case 'NORMAL': return <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-transparent"><CheckCircle2 className="w-3 h-3 mr-1" /> Salida Normal</Badge>;
    default: return <Badge variant="outline">{registro.estado_salida}</Badge>;
  }
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
                      <TableCell colSpan={2} className="font-semibold">
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

                      //console.log("asistenciaInfo", asistenciaInfo)
                      const ubicacionInfo = ubicaciones[empleado_id];
                      const esAusenciaInjustificada = !asistenciaInfo?.hora_entrada_real && 
                        (!asistenciaInfo || ['LABORAL', 'FALTA', 'SIN_HORARIO'].includes(asistenciaInfo.estado_general as string));

                      //if (!asistenciaInfo) {
                      if (esAusenciaInjustificada) {
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
                                    {inasistenciaInfo ? (
                                        <Badge variant="destructive">
                                          Inasistencia confirmada por {getNombreEmpleadoPorId(inasistenciaInfo.capturo)?.nombre_corto}
                                        </Badge>
                                      ) : (
                                        <ul className="space-y-1">
                                          <li>{getEstatusUI(asistenciaInfo)}</li>
                                          {ubicacionInfo && (
                                            <li>
                                              <Badge variant={'outline'}>{ubicacionInfo?.nombre_ubicacion || 'Sin ubicación'}</Badge>
                                            </li>
                                          )}
                                        </ul>
                                      )}
                                    </li>
                                  </ul>
                                </TableCell>
                                <TableCell>--:--</TableCell>
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
                              {asistenciaInfo?.hora_entrada_real && (
                                <li>{asistenciaInfo.hora_entrada_real}</li>
                              )}
                              <li>
                                {getEstatusUI(asistenciaInfo)}
                              </li>
                              {asistenciaInfo?.ubicacion_entrada && (
                                <li>
                                  <span className="text-xs text-muted-foreground">{asistenciaInfo.ubicacion_entrada}</span>
                                </li>
                              )}
                            </ul>
                          </TableCell>
                          <TableCell>
                            <ul>
                              <li>
                              {asistenciaInfo?.hora_salida_real || '--:--'}
                              </li>
                              <li>
                                {getEstatusSalidaUI(asistenciaInfo)}
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
};*/
'use client';

import React, { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useNombreEmpleado } from '@/components/providers/NombreEmpleadoProvider';
import { AsistenciaReporteRow } from '@/services/asistencias';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, Palmtree, Stethoscope, Ban, Coffee, CalendarX, CheckCircle2, Clock, AlertCircle, MapPin
} from 'lucide-react';
import { vista_empleado_ubicacion } from '@/services/ubicaciones';
import { UserAvatar } from '@/components/reutilizables/UserAvatar';
import { Popover, PopoverContent, PopoverHeader, PopoverTitle, PopoverTrigger } from "@/components/ui/popover";
import { ConfirmarInasistenciaDialog } from './AsistenciaDialogConfirmarInasistencia';
import { Button } from '@/components/ui/button';

// --- HELPERS Y DISEÑO ---
const timeToMins = (time: string | null | undefined): number => {
  if (!time) return 0;
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
};
type FilterStatus = 'todos' | 'presentes' | 'ausentes';

const getEstatusUI = (registro?: AsistenciaReporteRow) => {
  if (!registro) return <Badge variant="outline" className="text-slate-500">Ausente</Badge>;
  if (registro.estado_general && registro.estado_general !== 'LABORAL') {
    switch (registro.estado_general) {
      case 'VACACIONES': return <Badge className="bg-blue-100 text-blue-800"><Palmtree className="w-3 h-3 mr-1" /> Vacaciones</Badge>;
      case 'INCAPACIDAD': return <Badge className="bg-yellow-100 text-yellow-800"><Stethoscope className="w-3 h-3 mr-1" /> Incapacidad</Badge>;
      case 'BAJA': return <Badge className="bg-slate-200 text-slate-700"><Ban className="w-3 h-3 mr-1" /> Baja</Badge>;
      case 'DESCANSO': return <Badge variant="outline" className="text-slate-500"><Coffee className="w-3 h-3 mr-1" /> Descanso</Badge>;
      case 'FALTA': return <Badge variant="destructive" className="bg-red-50 text-red-700">Falta Injustificada</Badge>;
      case 'SIN_HORARIO': return <Badge variant="outline"><CalendarX className="w-3 h-3 mr-1" /> Sin Horario</Badge>;
    }
  }
  if (registro.hora_entrada_real) {
    switch (registro.estado_entrada) {
      case 'PUNTUAL': return <Badge className="bg-green-100 text-green-800"><CheckCircle2 className="w-3 h-3 mr-1" /> Puntual</Badge>;
      case 'RETARDO_LEVE': return <Badge className="bg-orange-100 text-orange-800"><Clock className="w-3 h-3 mr-1" /> Retardo<br/>Leve</Badge>;
      case 'RETARDO_GRAVE': return <Badge className="bg-red-100 text-red-800"><AlertCircle className="w-3 h-3 mr-1" /> Retardo<br/>Grave</Badge>;
    }
  }
  return <Badge variant="outline">Asistencia Registrada</Badge>;
};

const getEstatusSalidaUI = (registro?: AsistenciaReporteRow) => {
  if (!registro || !registro.hora_salida_real) return null;
  switch (registro.estado_salida) {
    case 'SALIDA_ANTICIPADA': return <Badge className="bg-red-100 text-red-800"><AlertCircle className="w-3 h-3 mr-1" /> Anticipada</Badge>;
    case 'NORMAL': return <Badge className="bg-green-100 text-green-800"><CheckCircle2 className="w-3 h-3 mr-1" /> Normal</Badge>;
    default: return <Badge variant="outline">{registro.estado_salida}</Badge>;
  }
};

// --- TIPOS ---
type TurnoDetalle = { empleado_id: string; };
type TurnoData = { hora_entrada: string; detalles_empleados: TurnoDetalle[]; total_personas: number; };
type AsistenciasMap = Record<string, AsistenciaReporteRow>;
type InasistenciasMap = Record<string, { capturo: string; }>;
type HorariosMap = Record<string, { entrada: string; salida: string; }>;
type UbicacionesMap = Record<string, vista_empleado_ubicacion>;
type HorasExtraMap = Record<string, any[]>; // Ajusta según tu tipo real

interface Props {
  turnos: TurnoData[];
  asistencias: AsistenciasMap;
  inasistencias: InasistenciasMap;
  horarios: HorariosMap;
  ubicaciones: UbicacionesMap;
  horasExtraMap?: HorasExtraMap; // Nuevo prop
}

export const AsistenciaTablaTurnos: React.FC<Props> = ({ 
  turnos, asistencias, inasistencias, horarios, ubicaciones, horasExtraMap = {} 
}) => {
  const { getNombreEmpleadoPorId } = useNombreEmpleado();
  const [searchTerm, setSearchTerm] = useState('');
  
  const [filterStatus, setFilterStatus] = useState<FilterStatus>
  ('todos');


  const filteredTurnos = useMemo(() => {
    if (!turnos) return [];
    const turnosConEmpleadosFiltrados = turnos.map(turno => {
      const empleadosFiltrados = turno.detalles_empleados.filter(empleado => {
        const nombre = getNombreEmpleadoPorId(empleado.empleado_id)?.nombre_corto || '';
        const asistencia = asistencias[empleado.empleado_id];
        
        // Consideramos presente si tiene hora de entrada o si tiene una justificación/excepción
        const estaPresenteOJustificado = asistencia?.hora_entrada_real || 
          (asistencia && ['VACACIONES', 'INCAPACIDAD', 'BAJA', 'DESCANSO'].includes(asistencia.estado_general!));

        if (filterStatus === 'presentes' && !estaPresenteOJustificado) return false;
        if (filterStatus === 'ausentes' && estaPresenteOJustificado) return false;
        if (searchTerm && !nombre.toLowerCase().includes(searchTerm.toLowerCase())) return false;
        return true;
      });
      return { ...turno, detalles_empleados: empleadosFiltrados };
    });
    return turnosConEmpleadosFiltrados.filter(turno => turno.detalles_empleados.length > 0);
  }, [turnos, searchTerm, filterStatus, getNombreEmpleadoPorId, asistencias]);

  if (!turnos || turnos.length === 0) return <p className="text-center text-gray-500 py-4">No hay turnos hoy.</p>;

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
              <TableHead>Descanso</TableHead>
              <TableHead>Salida</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTurnos.map((turno) => (
              <React.Fragment key={turno.hora_entrada}>
                <TableRow className="bg-muted/50 font-semibold sticky top-0">
                  <TableCell colSpan={4}>Turno Base: {turno.hora_entrada}</TableCell>
                </TableRow>
                
                {turno.detalles_empleados.map(({ empleado_id }) => {
                  const nombre = getNombreEmpleadoPorId(empleado_id)?.nombre_corto || `ID: ${empleado_id}`;
                  const ast = asistencias[empleado_id];
                  const inasist = inasistencias[empleado_id];
                  const hor = horarios[empleado_id];
                  const ubi = ubicaciones[empleado_id];
                  const extras = horasExtraMap[empleado_id] || [];

                  // Cálculo de Entrada Esperada Real (con horas extra previas)
                  const hrBaseMins = timeToMins(hor?.entrada || turno.hora_entrada);
                  const hePrevia = extras.find(he => he.hora_inicio && timeToMins(he.hora_fin) <= hrBaseMins);
                  const entradaEsperada = hePrevia ? hePrevia.hora_inicio : (hor?.entrada || turno.hora_entrada);

                  // Estado de Excepción (Vacaciones, Baja, Incapacidad)
                  const esExcepcion = ast && ['VACACIONES', 'INCAPACIDAD', 'BAJA', 'DESCANSO'].includes(ast.estado_general!);
                  
                  // Ausencia Injustificada (Falta)
                  const esAusencia = !ast?.hora_entrada_real && !esExcepcion;

                  if (esAusencia) {
                    return (
                      <Popover key={empleado_id}>
                        <PopoverTrigger asChild>
                          <TableRow className="opacity-60 hover:bg-muted/50 cursor-pointer">
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <UserAvatar employeeId={empleado_id} name={nombre} className="w-6 h-6" />
                                <span>{nombre}</span>
                              </div>
                            </TableCell>
                            <TableCell colSpan={3}>
                              <div className="flex items-center gap-4">
                                <span className="text-xs text-muted-foreground">Esp: {entradaEsperada}</span>
                                {inasist ? (
                                  <Badge variant="destructive">
                                    Inasistencia confirmada por <br/>{getNombreEmpleadoPorId(inasist.capturo)?.nombre_corto}
                                  </Badge>
                                ) : (
                                  <>
                                    <Badge variant="outline">Ausente</Badge>
                                    {ubi && <span className="text-xs text-muted-foreground"><MapPin className="w-3 h-3 inline" /> {ubi.nombre_ubicacion}</span>}
                                  </>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        </PopoverTrigger>
                        <PopoverContent>
                          <PopoverHeader>
                            <PopoverTitle>Ausencia registrada</PopoverTitle>
                            {!inasist && <ConfirmarInasistenciaDialog id_empleado={empleado_id} />}
                            <Button variant="outline" className="mt-2 w-full">Justificar Falta</Button>
                          </PopoverHeader>
                        </PopoverContent>
                      </Popover>
                    );
                  }

                  return (
                    <TableRow key={empleado_id} className={esExcepcion ? "bg-muted/20" : ""}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <UserAvatar employeeId={empleado_id} name={nombre} className="w-6 h-6" />
                          <span>{nombre}</span>
                        </div>
                        {esExcepcion && <div className="mt-1">{getEstatusUI(ast)}</div>}
                      </TableCell>
                      
                      <TableCell>
                        {!esExcepcion && (
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{ast?.hora_entrada_real || '--:--'}</span>
                            </div>
                            {getEstatusUI(ast)}
                            {ast?.ubicacion_entrada && (
                              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                <MapPin className="w-3 h-3" /> {ast.ubicacion_entrada}
                              </p>
                            )}
                          </div>
                        )}
                      </TableCell>

                      <TableCell>
                        {!esExcepcion && (
                          <div className="space-y-1 text-sm">
                            <div className="flex flex-col gap-1">
                              <span><span className="text-muted-foreground">S:</span> {ast?.hora_salida_descanso_real || '--:--'}</span>
                              {ast?.ubicacion_salida_descanso && (
                              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                <MapPin className="w-3 h-3" /> {ast.ubicacion_salida_descanso}
                              </p>
                            )}
                              <span><span className="text-muted-foreground">R:</span> {ast?.hora_regreso_descanso_real || '--:--'}</span>
                              {ast?.ubicacion_regreso_descanso && (
                              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                <MapPin className="w-3 h-3" /> {ast.ubicacion_regreso_descanso}
                              </p>
                            )}
                            </div>
                          </div>
                        )}
                      </TableCell>

                      <TableCell>
                        {!esExcepcion && (
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{ast?.hora_salida_real || '--:--'}</span>
                            </div>
                            {getEstatusSalidaUI(ast)}
                            {ast?.ubicacion_salida && (
                              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                <MapPin className="w-3 h-3" /> {ast.ubicacion_salida}
                              </p>
                            )}
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
