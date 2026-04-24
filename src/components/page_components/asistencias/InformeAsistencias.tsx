/*'use client';

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
}*/
/*'use client';

import React, { useState, useEffect, useTransition, useMemo } from 'react';
import { format, startOfWeek, endOfWeek, subDays, eachDayOfInterval } from 'date-fns';
import { es } from 'date-fns/locale';
import { DateRange } from 'react-day-picker';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

import { fetchAsistenciaReporteAction, fetchEmpleadosReporteAction } from '@/app/(roles)/rh/asistencias/actions';
import { AsistenciaReporteRow } from '@/services/asistencias';
import { Button } from '@/components/ui/button';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Loader2, Download } from 'lucide-react';
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
  const [empleadosReporte, setEmpleadosReporte] = useState<any[]>([]);
  const [isPending, startTransition] = useTransition();

  const handleFetchReport = () => {
    if (!dateRange?.from || !dateRange?.to) return;
    startTransition(async () => {
      const fechaInicio = format(dateRange.from!, 'yyyy-MM-dd');
      const fechaFin = format(dateRange.to!, 'yyyy-MM-dd');
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
  }, []);
  
  const dateHeaders = useMemo(() => {
    if (!dateRange?.from || !dateRange?.to) return [];
    return eachDayOfInterval({ start: dateRange.from, end: dateRange.to });
  }, [dateRange]);

  const processedData: ProcessedData = useMemo(() => {
    const baseData: ProcessedData = {};
    empleadosReporte.forEach((emp: any) => {
      const idStr = String(emp.id_empleado);
      const nombreInfo = getNombreEmpleadoPorId(idStr);
      const nombre = nombreInfo?.nombre_corto || `${emp.nombres} ${emp.apellidos}`;
      baseData[idStr] = { nombre, registrosPorFecha: {} };
    });

    reportData.forEach((row: any) => {
      const empleadoId = String(row.id_empleado);
      if (baseData[empleadoId]) {
        baseData[empleadoId].registrosPorFecha[row.fecha] = {
          hora_entrada_real: row.hora_entrada_real,
          hora_salida_descanso_real: row.hora_salida_descanso_real,
          hora_regreso_descanso_real: row.hora_regreso_descanso_real,
          hora_salida_real: row.hora_salida_real,
        };
      }
    });
    return baseData;
  }, [reportData, empleadosReporte, getNombreEmpleadoPorId]);

  // --- FUNCIÓN DE EXPORTACIÓN A EXCEL ---
  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Reporte de Asistencias');

    // 1. Estilos base
    const headerFill: ExcelJS.Fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0E0E0' } };
    const boldFont = { bold: true };
    const centerAlignment: Partial<ExcelJS.Alignment> = { vertical: 'middle', horizontal: 'center' };

    // 2. Crear encabezados (Fila 1: Fechas)
    const dateRow = worksheet.getRow(1);
    const subHeaderRow = worksheet.getRow(2);

    worksheet.getCell('A1').value = 'Empleado';
    worksheet.mergeCells('A1:A2');
    worksheet.getColumn(1).width = 30;

    dateHeaders.forEach((date, index) => {
      const colStart = 2 + (index * 4);
      const dateStr = format(date, 'eee d/MMM', { locale: es }).toUpperCase();
      
      // Combinar 4 columnas para cada día
      worksheet.mergeCells(1, colStart, 1, colStart + 3);
      const cell = worksheet.getCell(1, colStart);
      cell.value = dateStr;
      cell.fill = headerFill;
      cell.font = boldFont;
      cell.alignment = centerAlignment;

      // Sub-encabezados
      worksheet.getCell(2, colStart).value = 'Entrada';
      worksheet.getCell(2, colStart + 1).value = 'S. Desc';
      worksheet.getCell(2, colStart + 2).value = 'R. Desc';
      worksheet.getCell(2, colStart + 3).value = 'Salida';
    });

    // Estilo para sub-encabezados
    subHeaderRow.font = boldFont;
    subHeaderRow.alignment = centerAlignment;

    // 3. Rellenar datos
    Object.values(processedData).forEach((data, rowIndex) => {
      const row = worksheet.getRow(rowIndex + 3);
      row.getCell(1).value = data.nombre;

      dateHeaders.forEach((date, dateIndex) => {
        const colStart = 2 + (dateIndex * 4);
        const fechaKey = format(date, 'yyyy-MM-dd');
        const reg = data.registrosPorFecha[fechaKey];

        if (reg) {
          row.getCell(colStart).value = reg.hora_entrada_real?.substring(0, 5);
          row.getCell(colStart + 1).value = reg.hora_salida_descanso_real?.substring(0, 5);
          row.getCell(colStart + 2).value = reg.hora_regreso_descanso_real?.substring(0, 5);
          row.getCell(colStart + 3).value = reg.hora_salida_real?.substring(0, 5);
        }
      });
    });

    // 4. Bordes y ajustes finales
    worksheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    });

    // Generar archivo
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `Reporte_Asistencias_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <DateRangePicker range={dateRange} onRangeChange={setDateRange} />
          <Button onClick={handleFetchReport} disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Buscar
          </Button>
        </div>
        
        {Object.keys(processedData).length > 0 && (
          <Button variant="outline" onClick={exportToExcel} className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100">
            <Download className="mr-2 h-4 w-4" />
            Exportar Excel
          </Button>
        )}
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
            No se encontraron empleados.
          </div>
        )}
      </div>
    </div>
  );
}*/
/*'use client';

import React, { useState, useEffect, useTransition, useMemo } from 'react';
import { format, startOfWeek, endOfWeek, subDays, eachDayOfInterval } from 'date-fns';
import { es } from 'date-fns/locale';
import { DateRange } from 'react-day-picker';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

import { fetchAsistenciaReporteAction, fetchEmpleadosReporteAction } from '@/app/(roles)/rh/asistencias/actions';
import { AsistenciaReporteRow } from '@/services/asistencias';
import { Button } from '@/components/ui/button';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Loader2, Download } from 'lucide-react';
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

// 1. Añadimos estado_general a nuestro tipo para poder leerlo
type RegistrosPorFecha = Record<string, Partial<Pick<AsistenciaReporteRow, 
  'hora_entrada_real' | 
  'hora_salida_descanso_real' | 
  'hora_regreso_descanso_real' | 
  'hora_salida_real' |
  'estado_general'
>>>;

type ProcessedData = Record<string, {
  nombre: string;
  registrosPorFecha: RegistrosPorFecha;
}>;

export function InformeAsistencias({ empresaId }: Props) {
  const { getNombreEmpleadoPorId } = useNombreEmpleado();
  const [dateRange, setDateRange] = useState<DateRange | undefined>(getDefaultDateRange());
  const [reportData, setReportData] = useState<AsistenciaReporteRow[]>([]);
  const [empleadosReporte, setEmpleadosReporte] = useState<any[]>([]);
  const [isPending, startTransition] = useTransition();

  const handleFetchReport = () => {
    if (!dateRange?.from || !dateRange?.to) return;
    startTransition(async () => {
      const fechaInicio = format(dateRange.from!, 'yyyy-MM-dd');
      const fechaFin = format(dateRange.to!, 'yyyy-MM-dd');
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
    empleadosReporte.forEach((emp: any) => {
      const idStr = String(emp.id_empleado);
      const nombreInfo = getNombreEmpleadoPorId(idStr);
      const nombre = nombreInfo?.nombre_corto || `${emp.nombres} ${emp.apellidos}`;
      baseData[idStr] = { nombre, registrosPorFecha: {} };
    });

    reportData.forEach((row: any) => {
      const empleadoId = String(row.id_empleado);
      if (baseData[empleadoId]) {
        baseData[empleadoId].registrosPorFecha[row.fecha] = {
          hora_entrada_real: row.hora_entrada_real,
          hora_salida_descanso_real: row.hora_salida_descanso_real,
          hora_regreso_descanso_real: row.hora_regreso_descanso_real,
          hora_salida_real: row.hora_salida_real,
          estado_general: row.estado_general, // <- Lo guardamos para evaluarlo
        };
      }
    });
    return baseData;
  }, [reportData, empleadosReporte, getNombreEmpleadoPorId]);

  // --- NUEVA EXPORTACIÓN EXCEL VERTICAL ---
  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Registro de Asistencia');

    // Estilos Base
    const headerFill: ExcelJS.Fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEEEEEE' } };
    const descansoFill: ExcelJS.Fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFBAE6FD' } }; // Azul Claro (Tailwind blue-200)
    const centerAlign: Partial<ExcelJS.Alignment> = { vertical: 'middle', horizontal: 'center' };

    // Construir Cabecera (Fila 1)
    worksheet.getRow(1).height = 25;
    worksheet.getCell('A1').value = 'N°';
    worksheet.getCell('B1').value = 'Nombre del Empleado';
    worksheet.getColumn(1).width = 5;
    worksheet.getColumn(2).width = 35;

    dateHeaders.forEach((date, index) => {
      const col = index + 3; // Empezamos en la columna C
      const dateCell = worksheet.getCell(1, col);
      dateCell.value = format(date, 'dd/MMM', { locale: es }).toUpperCase();
      dateCell.fill = headerFill;
      dateCell.font = { bold: true };
      dateCell.alignment = centerAlign;
      worksheet.getColumn(col).width = 10; // Columna estrecha
    });

    let currentRow = 2;

    // Llenar Datos
    Object.values(processedData).forEach((data, index) => {
      const startRow = currentRow;
      const endRow = currentRow + 3;

      // Combinar celdas de Número y Nombre para que abarquen las 4 filas verticales
      worksheet.mergeCells(`A${startRow}:A${endRow}`);
      const numCell = worksheet.getCell(`A${startRow}`);
      numCell.value = index + 1;
      numCell.alignment = centerAlign;

      worksheet.mergeCells(`B${startRow}:B${endRow}`);
      const nameCell = worksheet.getCell(`B${startRow}`);
      nameCell.value = data.nombre;
      nameCell.alignment = { vertical: 'middle', horizontal: 'left' };

      // Iterar sobre los días (Columnas)
      dateHeaders.forEach((date, dateIndex) => {
        const col = dateIndex + 3;
        const fechaKey = format(date, 'yyyy-MM-dd');
        const reg = data.registrosPorFecha[fechaKey];
        
        // ¿Es día de descanso según la BD?
        const isDescanso = reg?.estado_general === 'DESCANSO';

        // Obtener las 4 celdas verticales de esta columna
        const cellEntrada = worksheet.getCell(startRow, col);
        const cellSDescanso = worksheet.getCell(startRow + 1, col);
        const cellRDescanso = worksheet.getCell(startRow + 2, col);
        const cellSalida = worksheet.getCell(startRow + 3, col);

        // Asignar los valores
        cellEntrada.value = reg?.hora_entrada_real?.substring(0, 5) || '';
        cellSDescanso.value = reg?.hora_salida_descanso_real?.substring(0, 5) || '';
        cellRDescanso.value = reg?.hora_regreso_descanso_real?.substring(0, 5) || '';
        cellSalida.value = reg?.hora_salida_real?.substring(0, 5) || '';

        // Formatear y pintar
        [cellEntrada, cellSDescanso, cellRDescanso, cellSalida].forEach(c => {
          c.alignment = centerAlign;
          if (isDescanso) c.fill = descansoFill; // ¡Magia Azul!
        });
      });

      currentRow += 4; // Brincar 4 filas para el siguiente empleado
    });

    // Poner todos los bordes bonitos
    worksheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' }, left: { style: 'thin' },
          bottom: { style: 'thin' }, right: { style: 'thin' }
        };
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `Registro_Asistencia_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <DateRangePicker range={dateRange} onRangeChange={setDateRange} />
          <Button onClick={handleFetchReport} disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Buscar
          </Button>
        </div>
        
        {Object.keys(processedData).length > 0 && (
          <Button variant="outline" onClick={exportToExcel} className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100">
            <Download className="mr-2 h-4 w-4" />
            Exportar Excel
          </Button>
        )}
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

                <div className="grid border-t border-l border-gray-300" style={{ gridTemplateColumns: `75px repeat(${dateHeaders.length}, minmax(45px, 1fr))` }}>
                  
                  <div className="border-r border-b border-gray-300 bg-gray-100"></div>
                  {dateHeaders.map(date => (
                    <div key={`daynum-${format(date, 'T')}`} className="text-center font-bold p-1 border-r border-b border-gray-300 bg-gray-100">
                      {format(date, 'd')}
                    </div>
                  ))}
                  
                  <div className="border-r border-b border-gray-300 bg-gray-100"></div>
                  {dateHeaders.map(date => (
                    <div key={`dayname-${format(date, 'T')}`} className="text-center font-semibold p-1 border-r border-b border-gray-300 bg-gray-100 capitalize">
                      {format(date, 'E', { locale: es })}
                    </div>
                  ))}
                  
                  <div className="text-right font-medium p-1 border-r border-b border-gray-300 text-gray-500 bg-gray-50 flex items-center justify-end">Entrada</div>
                  {dateHeaders.map(date => {
                    const registro = data.registrosPorFecha[format(date, 'yyyy-MM-dd')];
                    const isDescanso = registro?.estado_general === 'DESCANSO';
                    return (
                      <div key={`entry-${format(date, 'T')}`} className={`text-center p-1 border-r border-b border-gray-300 h-6 flex items-center justify-center ${isDescanso ? 'bg-blue-100' : 'bg-white'}`}>
                        {registro?.hora_entrada_real?.substring(0, 5) || ''}
                      </div>
                    );
                  })}
                  
                  <div className="text-right font-medium p-1 border-r border-b border-gray-300 text-gray-500 bg-gray-50 flex items-center justify-end">S. Desc</div>
                  {dateHeaders.map(date => {
                    const registro = data.registrosPorFecha[format(date, 'yyyy-MM-dd')];
                    const isDescanso = registro?.estado_general === 'DESCANSO';
                    return (
                      <div key={`breakstart-${format(date, 'T')}`} className={`text-center p-1 border-r border-b border-gray-300 h-6 flex items-center justify-center ${isDescanso ? 'bg-blue-100' : 'bg-white'}`}>
                        {registro?.hora_salida_descanso_real?.substring(0, 5) || ''}
                      </div>
                    );
                  })}
                  
                  <div className="text-right font-medium p-1 border-r border-b border-gray-300 text-gray-500 bg-gray-50 flex items-center justify-end">R. Desc</div>
                  {dateHeaders.map(date => {
                    const registro = data.registrosPorFecha[format(date, 'yyyy-MM-dd')];
                    const isDescanso = registro?.estado_general === 'DESCANSO';
                    return (
                      <div key={`breakend-${format(date, 'T')}`} className={`text-center p-1 border-r border-b border-gray-300 h-6 flex items-center justify-center ${isDescanso ? 'bg-blue-100' : 'bg-white'}`}>
                        {registro?.hora_regreso_descanso_real?.substring(0, 5) || ''}
                      </div>
                    );
                  })}

                  <div className="text-right font-medium p-1 border-r border-b border-gray-300 text-gray-500 bg-gray-50 flex items-center justify-end">Salida</div>
                  {dateHeaders.map(date => {
                    const registro = data.registrosPorFecha[format(date, 'yyyy-MM-dd')];
                    const isDescanso = registro?.estado_general === 'DESCANSO';
                    return (
                      <div key={`exit-${format(date, 'T')}`} className={`text-center p-1 border-r border-b border-gray-300 h-6 flex items-center justify-center ${isDescanso ? 'bg-blue-100' : 'bg-white'}`}>
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
            No se encontraron empleados registrados.
          </div>
        )}
      </div>
    </div>
  );
}*/

'use client';

import React, { useState, useEffect, useTransition, useMemo } from 'react';
import { format, startOfWeek, endOfWeek, subDays, eachDayOfInterval } from 'date-fns';
import { es } from 'date-fns/locale';
import { DateRange } from 'react-day-picker';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

import { fetchAsistenciaReporteAction, fetchEmpleadosReporteAction } from '@/app/(roles)/rh/asistencias/actions';
import { AsistenciaReporteRow } from '@/services/asistencias';
import { Button } from '@/components/ui/button';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Loader2, Download } from 'lucide-react';
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
  'hora_salida_real' |
  'estado_general'
>>>;

type ProcessedData = Record<string, {
  nombre: string;
  registrosPorFecha: RegistrosPorFecha;
}>;

export function InformeAsistencias({ empresaId }: Props) {
  const { getNombreEmpleadoPorId } = useNombreEmpleado();
  const [dateRange, setDateRange] = useState<DateRange | undefined>(getDefaultDateRange());
  const [reportData, setReportData] = useState<AsistenciaReporteRow[]>([]);
  const [empleadosReporte, setEmpleadosReporte] = useState<any[]>([]);
  const [isPending, startTransition] = useTransition();

  const handleFetchReport = () => {
    if (!dateRange?.from || !dateRange?.to) return;
    startTransition(async () => {
      const fechaInicio = format(dateRange.from!, 'yyyy-MM-dd');
      const fechaFin = format(dateRange.to!, 'yyyy-MM-dd');
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
    empleadosReporte.forEach((emp: any) => {
      const idStr = String(emp.id_empleado);
      const nombreInfo = getNombreEmpleadoPorId(idStr);
      const nombre = nombreInfo?.nombre_corto || `${emp.nombres} ${emp.apellidos}`;
      baseData[idStr] = { nombre, registrosPorFecha: {} };
    });

    reportData.forEach((row: any) => {
      const empleadoId = String(row.id_empleado);
      if (baseData[empleadoId]) {
        baseData[empleadoId].registrosPorFecha[row.fecha] = {
          hora_entrada_real: row.hora_entrada_real,
          hora_salida_descanso_real: row.hora_salida_descanso_real,
          hora_regreso_descanso_real: row.hora_regreso_descanso_real,
          hora_salida_real: row.hora_salida_real,
          estado_general: row.estado_general,
        };
      }
    });
    return baseData;
  }, [reportData, empleadosReporte, getNombreEmpleadoPorId]);

  // --- FUNCIÓN EXCEL ACTUALIZADA AL FORMATO DE LA IMAGEN ---
  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Registro de Asistencia');

    // Estilos Base
    const headerFill: ExcelJS.Fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEEEEEE' } };
    const descansoFill: ExcelJS.Fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFBAE6FD' } }; // Azul Claro
    const centerAlign: Partial<ExcelJS.Alignment> = { vertical: 'middle', horizontal: 'center' };
    const boldFont = { bold: true };

    // Configurar anchos de las columnas
    worksheet.getColumn(1).width = 15; // Columna A: Etiquetas (Registro, Entrada, etc.)
    worksheet.getColumn(2).width = 12; // Columna B
    worksheet.getColumn(3).width = 12; // Columna C
    worksheet.getColumn(4).width = 12; // Columna D
    worksheet.getColumn(5).width = 25; // Columna E (Para el nombre)
    
    // Ancho para las columnas de las fechas
    dateHeaders.forEach((_, index) => {
      worksheet.getColumn(index + 2).width = 12; 
    });

    // 1. Encabezado Global
    worksheet.addRow(['Registro de asistencia']);
    worksheet.getRow(1).font = { bold: true, size: 14 };
    worksheet.addRow([]);
    worksheet.addRow([]);

    // Rango de Fechas
    const startDateStr = dateRange?.from ? format(dateRange.from, 'yyyy-MM-dd') : '';
    const endDateStr = dateRange?.to ? format(dateRange.to, 'yyyy-MM-dd') : '';
    worksheet.addRow(['Fecha:', startDateStr, '-', endDateStr]);
    worksheet.addRow([]);

    let currentRow = 6;

    // 2. Iterar por cada empleado para crear su "bloque"
    Object.entries(processedData).forEach(([empleadoId, data]) => {
      // Fila: ID y Nombre
      const headerRow = worksheet.getRow(currentRow);
      headerRow.getCell(1).value = 'ID:';
      headerRow.getCell(1).font = boldFont;
      headerRow.getCell(2).value = empleadoId;
      headerRow.getCell(4).value = 'Nombre:';
      headerRow.getCell(4).font = boldFont;
      headerRow.getCell(5).value = data.nombre;
      currentRow++;

      // Fila: Encabezados de Días (Registro, 16 jue, 17 vie...)
      const datesRow = worksheet.getRow(currentRow);
      datesRow.getCell(1).value = 'Registro';
      datesRow.getCell(1).font = boldFont;
      datesRow.getCell(1).fill = headerFill;
      
      dateHeaders.forEach((date, i) => {
        const cell = datesRow.getCell(i + 2);
        cell.value = format(date, 'd eee', { locale: es }).toLowerCase();
        cell.font = boldFont;
        cell.fill = headerFill;
        cell.alignment = centerAlign;
      });
      currentRow++;

      // Filas de Datos (Entrada, S. Comida, R. Comida, Salida)
      const rowEntrada = worksheet.getRow(currentRow);
      const rowSComida = worksheet.getRow(currentRow + 1);
      const rowRComida = worksheet.getRow(currentRow + 2);
      const rowSalida = worksheet.getRow(currentRow + 3);

      rowEntrada.getCell(1).value = 'Entrada';
      rowSComida.getCell(1).value = 'S. Comida';
      rowRComida.getCell(1).value = 'R. Comida';
      rowSalida.getCell(1).value = 'Salida';

      // Poner negritas a las etiquetas de la izquierda
      [rowEntrada, rowSComida, rowRComida, rowSalida].forEach(row => {
        row.getCell(1).font = boldFont;
        row.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF9FAFB' } };
      });

      // Llenar las celdas de horarios
      dateHeaders.forEach((date, i) => {
        const col = i + 2;
        const fechaKey = format(date, 'yyyy-MM-dd');
        const reg = data.registrosPorFecha[fechaKey];
        const isDescanso = reg?.estado_general === 'DESCANSO';

        const cellE = rowEntrada.getCell(col);
        const cellS = rowSComida.getCell(col);
        const cellR = rowRComida.getCell(col);
        const cellSal = rowSalida.getCell(col);

        cellE.value = reg?.hora_entrada_real?.substring(0, 5) || '';
        cellS.value = reg?.hora_salida_descanso_real?.substring(0, 5) || '';
        cellR.value = reg?.hora_regreso_descanso_real?.substring(0, 5) || '';
        cellSal.value = reg?.hora_salida_real?.substring(0, 5) || '';

        // Aplicar alineación y color de descanso
        [cellE, cellS, cellR, cellSal].forEach(c => {
           c.alignment = centerAlign;
           if (isDescanso) c.fill = descansoFill; // El azul claro de descanso
        });
      });

      currentRow += 4;
      
      // Aplicar bordes al bloque de datos de este empleado
      for(let r = currentRow - 5; r < currentRow; r++) {
          const row = worksheet.getRow(r);
          for(let c = 1; c <= dateHeaders.length + 1; c++) {
             row.getCell(c).border = {
                top: { style: 'thin', color: { argb: 'FFD1D5DB' } }, 
                left: { style: 'thin', color: { argb: 'FFD1D5DB' } },
                bottom: { style: 'thin', color: { argb: 'FFD1D5DB' } }, 
                right: { style: 'thin', color: { argb: 'FFD1D5DB' } }
             };
          }
      }

      // Fila vacía para separar del siguiente empleado
      currentRow++;
    });

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `Registro_Asistencia_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <DateRangePicker range={dateRange} onRangeChange={setDateRange} />
          <Button onClick={handleFetchReport} disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Buscar
          </Button>
        </div>
        
        {Object.keys(processedData).length > 0 && (
          <Button variant="outline" onClick={exportToExcel} className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100">
            <Download className="mr-2 h-4 w-4" />
            Exportar Excel
          </Button>
        )}
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

                <div className="grid border-t border-l border-gray-300" style={{ gridTemplateColumns: `75px repeat(${dateHeaders.length}, minmax(45px, 1fr))` }}>
                  
                  {/* Fila 1: Números */}
                  <div className="border-r border-b border-gray-300 bg-gray-100"></div>
                  {dateHeaders.map(date => (
                    <div key={`daynum-${format(date, 'T')}`} className="text-center font-bold p-1 border-r border-b border-gray-300 bg-gray-100">
                      {format(date, 'd')}
                    </div>
                  ))}
                  
                  {/* Fila 2: Nombres de Días */}
                  <div className="border-r border-b border-gray-300 bg-gray-100"></div>
                  {dateHeaders.map(date => (
                    <div key={`dayname-${format(date, 'T')}`} className="text-center font-semibold p-1 border-r border-b border-gray-300 bg-gray-100 capitalize">
                      {format(date, 'E', { locale: es })}
                    </div>
                  ))}
                  
                  {/* Fila 3: Entradas */}
                  <div className="text-right font-medium p-1 border-r border-b border-gray-300 text-gray-500 bg-gray-50 flex items-center justify-end">Entrada</div>
                  {dateHeaders.map(date => {
                    const registro = data.registrosPorFecha[format(date, 'yyyy-MM-dd')];
                    const isDescanso = registro?.estado_general === 'DESCANSO';
                    return (
                      <div key={`entry-${format(date, 'T')}`} className={`text-center p-1 border-r border-b border-gray-300 h-6 flex items-center justify-center ${isDescanso ? 'bg-blue-100' : 'bg-white'}`}>
                        {registro?.hora_entrada_real?.substring(0, 5) || ''}
                      </div>
                    );
                  })}
                  
                  {/* Fila 4: Salida a Descanso */}
                  <div className="text-right font-medium p-1 border-r border-b border-gray-300 text-gray-500 bg-gray-50 flex items-center justify-end">S. Comida</div>
                  {dateHeaders.map(date => {
                    const registro = data.registrosPorFecha[format(date, 'yyyy-MM-dd')];
                    const isDescanso = registro?.estado_general === 'DESCANSO';
                    return (
                      <div key={`breakstart-${format(date, 'T')}`} className={`text-center p-1 border-r border-b border-gray-300 h-6 flex items-center justify-center ${isDescanso ? 'bg-blue-100' : 'bg-white'}`}>
                        {registro?.hora_salida_descanso_real?.substring(0, 5) || ''}
                      </div>
                    );
                  })}
                  
                  {/* Fila 5: Regreso de Descanso */}
                  <div className="text-right font-medium p-1 border-r border-b border-gray-300 text-gray-500 bg-gray-50 flex items-center justify-end">R. Comida</div>
                  {dateHeaders.map(date => {
                    const registro = data.registrosPorFecha[format(date, 'yyyy-MM-dd')];
                    const isDescanso = registro?.estado_general === 'DESCANSO';
                    return (
                      <div key={`breakend-${format(date, 'T')}`} className={`text-center p-1 border-r border-b border-gray-300 h-6 flex items-center justify-center ${isDescanso ? 'bg-blue-100' : 'bg-white'}`}>
                        {registro?.hora_regreso_descanso_real?.substring(0, 5) || ''}
                      </div>
                    );
                  })}

                  {/* Fila 6: Salida */}
                  <div className="text-right font-medium p-1 border-r border-b border-gray-300 text-gray-500 bg-gray-50 flex items-center justify-end">Salida</div>
                  {dateHeaders.map(date => {
                    const registro = data.registrosPorFecha[format(date, 'yyyy-MM-dd')];
                    const isDescanso = registro?.estado_general === 'DESCANSO';
                    return (
                      <div key={`exit-${format(date, 'T')}`} className={`text-center p-1 border-r border-b border-gray-300 h-6 flex items-center justify-center ${isDescanso ? 'bg-blue-100' : 'bg-white'}`}>
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
            No se encontraron empleados registrados.
          </div>
        )}
      </div>
    </div>
  );
}