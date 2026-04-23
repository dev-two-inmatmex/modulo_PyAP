
'use client';

import React, { useState, useEffect, useTransition, useMemo } from 'react';
import { format, startOfWeek, endOfWeek, subDays, eachDayOfInterval } from 'date-fns';
import { es } from 'date-fns/locale';
import { DateRange } from 'react-day-picker';

// 👇 Importamos la nueva Server Action
import { fetchAsistenciaReporteAction, fetchEmpleadosReporteAction } from '@/app/(roles)/rh/asistencias/actions';
import { AsistenciaReporteRow } from '@/services/asistencias';
import { Button } from '@/components/ui/button';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Loader2 } from 'lucide-react';
import { useNombreEmpleado } from '@/components/providers/NombreEmpleadoProvider';
import { UserAvatar } from '@/components/reutilizables/UserAvatar';

interface Props {
  empresaId: number | null;
}

const getDefaultDateRange = (): DateRange => {  
  const today = new Date();
  const dayOfWeek = today.getDay(); 

  let startDate;
  if (dayOfWeek < 4) { 
    startDate = subDays(startOfWeek(today, { weekStartsOn: 4 }), 7);
  } else { 
    startDate = startOfWeek(today, { weekStartsOn: 4 });
  }
  const endDate = endOfWeek(startDate, { weekStartsOn: 4 });

  return { from: startDate, to: endDate };
};

type RegistrosPorFecha = Record<string, Partial<Pick<AsistenciaReporteRow, 
  'hora_entrada_real' | 
  'hora_salida_descanso_real' | 
  'hora_regreso_descanso_real' | 
  'hora_salida_real'
>>>;

type ProcessedData = Record<string, {
  nombre: string;
  registrosPorFecha: RegistrosPorFecha;
}>;


export function InformeAsistencias({ empresaId }: Props) {
  const { getNombreEmpleadoPorId } = useNombreEmpleado();
  const [dateRange, setDateRange] = useState<DateRange | undefined>(getDefaultDateRange());
  const [reportData, setReportData] = useState<AsistenciaReporteRow[]>([]);
  
  // 👇 NUEVO: Estado para guardar el padrón completo de empleados (activos e inactivos)
  const [empleadosReporte, setEmpleadosReporte] = useState<any[]>([]);
  const [isPending, startTransition] = useTransition();

  const handleFetchReport = () => {
    if (!dateRange?.from || !dateRange?.to) return;

    startTransition(async () => {
      const fechaInicio = format(dateRange.from!, 'yyyy-MM-dd');
      const fechaFin = format(dateRange.to!, 'yyyy-MM-dd');
      
      // 👇 Disparamos ambas peticiones al mismo tiempo para mayor velocidad
      const [rawData, empleadosData] = await Promise.all([
        fetchAsistenciaReporteAction(fechaInicio, fechaFin),
        fetchEmpleadosReporteAction(empresaId)
      ]);
      
      setReportData(rawData || []);
      setEmpleadosReporte(empleadosData || []);
    });
  };

  useEffect(() => {
    handleFetchReport();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const dateHeaders = useMemo(() => {
    if (!dateRange?.from || !dateRange?.to) return [];
    return eachDayOfInterval({ start: dateRange.from, end: dateRange.to });
  }, [dateRange]);

  const processedData: ProcessedData = useMemo(() => {
    const baseData: ProcessedData = {};

    // 1. DIBUJAMOS LA BASE usando a TODOS los empleados que nos devolvió la Action
    empleadosReporte.forEach((emp: any) => {
      const idStr = String(emp.id_empleado);
      const nombreInfo = getNombreEmpleadoPorId(idStr);
      const nombre = nombreInfo?.nombre_corto || `${emp.nombres} ${emp.apellidos}`;

      baseData[idStr] = {
        nombre: nombre,
        registrosPorFecha: {}
      };
    });

    // 2. RELLENAMOS LOS DATOS
    reportData.forEach((row: any) => {
      const empleadoId = String(row.id_empleado);
      const fechaKey = row.fecha; 

      if (baseData[empleadoId]) {
        baseData[empleadoId].registrosPorFecha[fechaKey] = {
          hora_entrada_real: row.hora_entrada_real,
          hora_salida_descanso_real: row.hora_salida_descanso_real,
          hora_regreso_descanso_real: row.hora_regreso_descanso_real,
          hora_salida_real: row.hora_salida_real,
        };
      }
    });

    return baseData;
  }, [reportData, empleadosReporte, getNombreEmpleadoPorId]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <DateRangePicker range={dateRange} onRangeChange={setDateRange} />
        <Button onClick={handleFetchReport} disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Buscar
        </Button>
      </div>

      <div className="border rounded-md max-h-[70vh] overflow-y-auto text-xs bg-white">
        {isPending ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : Object.keys(processedData).length > 0 ? (
          <div className="p-2 space-y-3">
            {Object.entries(processedData).map(([empleadoId, data]) => (
              <div key={empleadoId} className="border border-gray-400 p-1">
                <div className="flex items-center gap-2 text-sm font-semibold mb-1">
                   <UserAvatar employeeId={empleadoId} name={data.nombre} className='w-8 h-8 rounded-full'/>
                   <div>{data.nombre}</div>
                </div>

                <div className="grid border-t border-l border-gray-300" style={{ gridTemplateColumns: `repeat(${dateHeaders.length}, minmax(45px, 1fr))` }}>
                  {dateHeaders.map(date => (
                    <div key={`daynum-${format(date, 'T')}`} className="text-center font-bold p-1 border-r border-b border-gray-300 bg-gray-100">
                      {format(date, 'd')}
                    </div>
                  ))}
                  {dateHeaders.map(date => (
                    <div key={`dayname-${format(date, 'T')}`} className="text-center font-semibold p-1 border-r border-b border-gray-300 bg-gray-100 capitalize">
                      {format(date, 'E', { locale: es })}
                    </div>
                  ))}
                  
                  {dateHeaders.map(date => {
                    const registro = data.registrosPorFecha[format(date, 'yyyy-MM-dd')];
                    return (
                      <div key={`entry-${format(date, 'T')}`} className="text-center p-1 border-r border-b border-gray-300 h-6 flex items-center justify-center">
                        {registro?.hora_entrada_real?.substring(0, 5) || ''}
                      </div>
                    );
                  })}
                  
                  {dateHeaders.map(date => {
                    const registro = data.registrosPorFecha[format(date, 'yyyy-MM-dd')];
                    return (
                      <div key={`breakstart-${format(date, 'T')}`} className="text-center p-1 border-r border-b border-gray-300 h-6 flex items-center justify-center">
                        {registro?.hora_salida_descanso_real?.substring(0, 5) || ''}
                      </div>
                    );
                  })}
                  
                  {dateHeaders.map(date => {
                    const registro = data.registrosPorFecha[format(date, 'yyyy-MM-dd')];
                    return (
                      <div key={`breakend-${format(date, 'T')}`} className="text-center p-1 border-r border-b border-gray-300 h-6 flex items-center justify-center">
                        {registro?.hora_regreso_descanso_real?.substring(0, 5) || ''}
                      </div>
                    );
                  })}

                  {dateHeaders.map(date => {
                    const registro = data.registrosPorFecha[format(date, 'yyyy-MM-dd')];
                    return (
                      <div key={`exit-${format(date, 'T')}`} className="text-center p-1 border-r border-b border-gray-300 h-6 flex items-center justify-center">
                        {registro?.hora_salida_real?.substring(0, 5) || ''}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-24 text-center flex items-center justify-center text-sm">
            No se encontraron empleados registrados en esta empresa.
          </div>
        )}
      </div>
    </div>
  );
}