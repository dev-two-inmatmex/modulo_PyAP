'use client';

import React, { useState, useEffect, useTransition, useMemo } from 'react';
import { format, startOfWeek, endOfWeek, subDays, eachDayOfInterval } from 'date-fns';
import { es } from 'date-fns/locale';
import { DateRange } from 'react-day-picker';

import { fetchAsistenciaReporteAction } from '@/app/(roles)/rh/asistencias/actions';
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
  const dayOfWeek = today.getDay(); // Sunday = 0, Thursday = 4

  let startDate;
  // If Sun, Mon, Tue, Wed (0-3)
  if (dayOfWeek < 4) { 
    // Go to the start of the previous week (which was a Thursday)
    startDate = subDays(startOfWeek(today, { weekStartsOn: 4 }), 7);
  } else { // If Thu, Fri, Sat (4-6)
    // Go to the start of the current week (which was a Thursday)
    startDate = startOfWeek(today, { weekStartsOn: 4 });
  }
  const endDate = endOfWeek(startDate, { weekStartsOn: 4 });

  return { from: startDate, to: endDate };
};

// Define a new structure to hold the grid-friendly data
type RegistrosPorFecha = Record<string, Partial<Pick<AsistenciaReporteRow, 
  'hora_entrada_real' | 
  'hora_salida_descanso_real' | 
  'hora_regreso_descanso_real' | 
  'hora_salida_real'
>>>;

type ProcessedData = Record<number, {
  nombre: string;
  registrosPorFecha: RegistrosPorFecha;
}>;


export function InformeAsistencias({ empresaId }: Props) {
  const { getNombreEmpleadoPorId } = useNombreEmpleado();
  const [dateRange, setDateRange] = useState<DateRange | undefined>(getDefaultDateRange());
  const [reportData, setReportData] = useState<AsistenciaReporteRow[]>([]);
  const [isPending, startTransition] = useTransition();

  const handleFetchReport = () => {
    if (!dateRange?.from || !dateRange?.to) return;

    startTransition(async () => {
      const fechaInicio = format(dateRange.from!, 'yyyy-MM-dd');
      const fechaFin = format(dateRange.to!, 'yyyy-MM-dd');
      const data = await fetchAsistenciaReporteAction(fechaInicio, fechaFin, empresaId);
      setReportData(data);
    });
  };

  // Fetch data on initial component load
  useEffect(() => {
    handleFetchReport();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Create an array of Date objects for the table headers
  const dateHeaders = useMemo(() => {
    if (!dateRange?.from || !dateRange?.to) return [];
    return eachDayOfInterval({ start: dateRange.from, end: dateRange.to });
  }, [dateRange]);

  // Process the raw report data into the new grid-friendly structure
  const processedData: ProcessedData = useMemo(() => {
    return reportData.reduce((acc: ProcessedData, row) => {
      const empleadoId = row.id_empleado;
      if (!acc[empleadoId]) {
        const empleadoInfo = row.empleados as { nombres: string, apellido_paterno: string } | null;
        const nombre = empleadoInfo 
          ? `${empleadoInfo.nombres} ${empleadoInfo.apellido_paterno}`
          : getNombreEmpleadoPorId(empleadoId) || `ID: ${empleadoId}`;
        
        acc[empleadoId] = { nombre, registrosPorFecha: {} };
      }

      const fechaKey = row.fecha; // The date string 'YYYY-MM-DD'
      acc[empleadoId].registrosPorFecha[fechaKey] = {
        hora_entrada_real: row.hora_entrada_real,
        hora_salida_descanso_real: row.hora_salida_descanso_real,
        hora_regreso_descanso_real: row.hora_regreso_descanso_real,
        hora_salida_real: row.hora_salida_real,
      };

      return acc;
    }, {});
  }, [reportData, getNombreEmpleadoPorId]);

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
                {/* Employee Info Header */}
                <div className="flex text-sm font-semibold mb-1">
                   {/*<div className="w-20">ID: {empleadoId}</div>*/}
                   <UserAvatar employeeId={empleadoId} name={data.nombre} className='w-8 h-8 rounded-full'/>
                   <div>Nombre: {data.nombre}</div>
                </div>

                {/* Grid Container */}
                <div className="grid border-t border-l border-gray-300" style={{ gridTemplateColumns: `repeat(${dateHeaders.length}, minmax(45px, 1fr))` }}>
                  {/* Headers Row 1: Day Number */}
                  {dateHeaders.map(date => (
                    <div key={`daynum-${format(date, 'T')}`} className="text-center font-bold p-1 border-r border-b border-gray-300 bg-gray-100">
                      {format(date, 'd')}
                    </div>
                  ))}
                  {/* Headers Row 2: Day Name */}
                  {dateHeaders.map(date => (
                    <div key={`dayname-${format(date, 'T')}`} className="text-center font-semibold p-1 border-r border-b border-gray-300 bg-gray-100 capitalize">
                      {format(date, 'E', { locale: es })}
                    </div>
                  ))}
                  
                  {/* Data Row 1: Entry */}
                  {dateHeaders.map(date => {
                    const registro = data.registrosPorFecha[format(date, 'yyyy-MM-dd')];
                    return (
                      <div key={`entry-${format(date, 'T')}`} className="text-center p-1 border-r border-b border-gray-300 h-6 flex items-center justify-center">
                        {registro?.hora_entrada_real?.substring(0, 5) || ''}
                      </div>
                    );
                  })}
                  
                  {/* Data Row 2: Break Start */}
                  {dateHeaders.map(date => {
                    const registro = data.registrosPorFecha[format(date, 'yyyy-MM-dd')];
                    return (
                      <div key={`breakstart-${format(date, 'T')}`} className="text-center p-1 border-r border-b border-gray-300 h-6 flex items-center justify-center">
                        {registro?.hora_salida_descanso_real?.substring(0, 5) || ''}
                      </div>
                    );
                  })}
                  
                  {/* Data Row 3: Break End */}
                  {dateHeaders.map(date => {
                    const registro = data.registrosPorFecha[format(date, 'yyyy-MM-dd')];
                    return (
                      <div key={`breakend-${format(date, 'T')}`} className="text-center p-1 border-r border-b border-gray-300 h-6 flex items-center justify-center">
                        {registro?.hora_regreso_descanso_real?.substring(0, 5) || ''}
                      </div>
                    );
                  })}

                  {/* Data Row 4: Exit */}
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
            No se encontraron registros para el período seleccionado.
          </div>
        )}
      </div>
    </div>
  );
}
