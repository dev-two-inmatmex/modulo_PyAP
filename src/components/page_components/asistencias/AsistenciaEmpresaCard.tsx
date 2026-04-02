'use client';
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { type DateRange } from "react-day-picker";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { PorcentajeAsistencia } from "./AsistenciaPorcentaje";
import { HistogramaAsistencia } from "./AsistenciaHistograma";
import { TablasTurnos } from "./AsistenciaTablasTurnos";
import { HistorialAsistencia } from "./AsistenciaHistorial";
import { getAsistenciaReporte, type AsistenciaReporteRow } from "@/services/asistencias";
import { type Inasistencias } from "@/services/asistencias";
interface AsistenciaCardProps {
  empresaId: number | null | undefined;
  nombreEmpresa: string | null;
  turnosHoy: any[];
  asistenciasMap: any;
  turnoCompletoMap: any;
  inasistenciasMap: any;
  segmentoDona: any[];
  totalEsperadosHoy: number;
  fechaDelDia: string;
}

export function AsistenciaEmpresaCard({
  empresaId, nombreEmpresa, turnosHoy, asistenciasMap, turnoCompletoMap, inasistenciasMap, segmentoDona, totalEsperadosHoy, fechaDelDia
}: AsistenciaCardProps) {
  // Estados del componente
  const [viewMode, setViewMode] = useState<"hoy" | "rango">("hoy");
  const [date, setDate] = useState<DateRange | undefined>();
  //const [historialData, setHistorialData] = useState<HistorialAsistenciaRow[]>([]);
  const [historialData, setHistorialData] = useState<AsistenciaReporteRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Efecto que pide los datos a Supabase cuando eliges fechas en el calendario
  useEffect(() => {
    if (viewMode === 'rango' && date?.from && date?.to) {
      setIsLoading(true);
      const fromStr = format(date.from, 'yyyy-MM-dd');
      const toStr = format(date.to, 'yyyy-MM-dd');

      getAsistenciaReporte(fromStr, toStr, empresaId)
        .then((data) => {
          // 👇 LUPA 1: Vemos qué llega de la base de datos
          console.log("Datos crudos de Supabase:", data);
          if (data.length === 0) {
            toast.warning("Supabase devolvió 0 registros para estas fechas.");
          } else {
            toast.success(`¡Se encontraron ${data.length} registros!`);
          }
          setHistorialData(data);
        })
        .catch((err) => {
          // 👇 LUPA 2: Atrapamos si la función SQL no existe o falló
          console.error("Error fatal en Supabase:", err);
          toast.error("Error de Supabase: " + err.message);
        })
        .finally(() => setIsLoading(false));
    }
  }, [viewMode, date, empresaId]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-lg border shadow-sm">
        <h2 className="text-xl font-bold tracking-tight">
          Asistencia: <span className="text-primary">{nombreEmpresa}</span>
        </h2>

        <div className="grid w-full grid-cols-1">
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "hoy" | "rango")}>
            <TabsList className="">
              <TabsTrigger value="hoy">Hoy</TabsTrigger>
              <TabsTrigger value="rango">Rango</TabsTrigger>
            </TabsList>
          </Tabs>

          {viewMode === "rango" && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant={"outline"} className={cn("w-65 justify-start text-left font-normal", !date && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd", { locale: es })} - {format(date.to, "LLL dd", { locale: es })}
                      </>
                    ) : (
                      format(date.from, "LLL dd", { locale: es })
                    )
                  ) : (
                    <span>Selecciona fechas...</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="range" captionLayout="dropdown" defaultMonth={date?.from} selected={date} onSelect={setDate} numberOfMonths={2} locale={es} />
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>

      {viewMode === "hoy" ? (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <PorcentajeAsistencia segmentos={segmentoDona} totalEsperados={totalEsperadosHoy} />
          <TablasTurnos
            turnos={turnosHoy}
            asistencias={asistenciasMap}
            turnoCompleto={turnoCompletoMap}
            inasistencias={inasistenciasMap}
            mostrarLogo={empresaId === null}
          />
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="col-span-1 md:col-span-2 lg:col-span-4">
              {/* Le pasamos los datos del historial al histograma (si tu histograma los soporta) */}
              <HistogramaAsistencia />
            </div>
          </div>

          <div className="relative">
            {isLoading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-lg">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
            {!date?.from || !date?.to ? (
              <div className="p-12 text-center border-2 border-dashed rounded-lg text-muted-foreground">
                <CalendarIcon className="mx-auto h-12 w-12 opacity-20 mb-4" />
                <p>Selecciona una fecha de inicio y fin en el calendario de arriba para generar el reporte.</p>
              </div>
            ) : (
              <HistorialAsistencia
                historial={historialData}
                mostrarLogo={empresaId === null}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
