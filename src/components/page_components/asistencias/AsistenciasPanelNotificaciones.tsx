'use client';

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Coffee, DoorOpen, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ScannerBiometrico } from "@/components/reutilizables/ScannerBiometrico";
import { responderSolicitudAsistenciaTardia } from "@/app/(roles)/rh/asistencias/actions";
import { useNombreEmpleado } from "@/components/providers/NombreEmpleadoProvider";

export interface AlertaSalida {
  id_empleado: string;
  nombre_completo: string;
  horaSalidaEfectiva: string;
}

export interface AlertaDescanso {
  id_empleado: string;
  nombre_completo: string;
  salidaDescanso: string;
}

interface PanelAlertasRHProps {
  solicitudes: any[];
  empleadosView: any[];
  faltaSalida: AlertaSalida[];
  excedeDescanso: AlertaDescanso[];
}

export default function PanelAlertasRH({ solicitudes, empleadosView, faltaSalida, excedeDescanso }: PanelAlertasRHProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { getNombreEmpleadoPorId } = useNombreEmpleado();

  // Función que se ejecuta DESPUÉS de que el scanner biométrico obtiene el rostro
  const handleRespuestaBiometrica = (solicitudId: number, aceptar: boolean, descriptor: number[]) => {
    startTransition(async () => {
      // 1. Obtenemos la hora actual en formato de base de datos
      const now = new Date();
      const hora_aceptacion = now.toLocaleTimeString('es-MX', {
        timeZone: 'America/Mexico_City',
        hour12: false
      });

      // 2. Llamamos al Server Action
      const result = await responderSolicitudAsistenciaTardia(
        solicitudId,
        hora_aceptacion,
        aceptar,
        descriptor
      );

      // 3. Mostramos feedback y refrescamos la página
      if (result.success) {
        toast.success(result.message);
        router.refresh(); // Refresca para que la solicitud desaparezca del panel
      } else {
        toast.error(result.message);
      }
    });
  };

  // Solo mostramos las solicitudes que siguen en "Limbo" (sin aceptar ni rechazar)
  const solicitudesPendientes = solicitudes.filter(s => s.aceptar_asistencia_tardia === null);

  return (
    <div className="space-y-4">
      {/* ALERTA 1: SOLICITUDES DE ENTRADA TARDÍA */}
      <Card className="border-red-200 shadow-sm">
        <CardHeader className="pb-2 bg-red-50/50 rounded-t-lg">
          <CardTitle className="text-sm font-bold flex items-center gap-2 text-red-700">
            <DoorOpen className="w-4 h-4" />
            Esperando en Puerta ({solicitudesPendientes.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 pt-4 max-h-75 overflow-y-auto">
          {solicitudesPendientes.length === 0 && (
            <p className="text-xs text-muted-foreground text-center">Nadie esperando</p>
          )}
          {solicitudesPendientes.map((s) => (
            <div key={s.id} className="p-3 bg-red-50 rounded-md border border-red-100 flex flex-col gap-2 shadow-sm">
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-bold text-red-900">`{getNombreEmpleadoPorId(s.id_empleado)?.nombre_completo}</span>
                <span className="text-xs text-red-800">Checó a las: <b>{s.hora}</b></span>
                {s.motivo && <span className="text-xs text-red-700 italic mt-1">"{s.motivo}"</span>}
              </div>

              {/* Botones de acción biométrica */}
              <div className="flex gap-2 mt-1">
                <ScannerBiometrico onResult={(desc) => handleRespuestaBiometrica(s.id, true, desc)}>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={isPending}
                    className=" h-8 text-xs bg-green-50 hover:bg-green-100 text-green-700 border-green-300 hover:text-green-800"
                  >
                    <Check className="w-3 h-3 mr-1" /> Permitir
                  </Button>
                </ScannerBiometrico>

                <ScannerBiometrico onResult={(desc) => handleRespuestaBiometrica(s.id, false, desc)}>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={isPending}
                    className=" h-8 text-xs bg-red-50 hover:bg-red-100 text-red-700 border-red-300 hover:text-red-800"
                  >
                    <X className="w-3 h-3 mr-1" /> Denegar
                  </Button>
                </ScannerBiometrico>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* ALERTA 2: EXCEDEN HORA DE COMIDA (+1 hr) */}
      <Card className="border-amber-200 shadow-sm">
        <CardHeader className="pb-2 bg-amber-50/50 rounded-t-lg">
          <CardTitle className="text-sm font-bold flex items-center gap-2 text-amber-700">
            <Coffee className="w-4 h-4" />
            Exceden Comida (+1 hr) ({excedeDescanso.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 pt-4 max-h-48 overflow-y-auto">
          {excedeDescanso.length === 0 && (
            <p className="text-xs text-muted-foreground text-center">Todos a tiempo</p>
          )}
          {excedeDescanso.map((e, i) => (
            <div key={i} className="p-3 bg-amber-50 rounded-md border border-amber-100 flex flex-col gap-1">
              <span className="text-xs font-bold text-amber-900">{getNombreEmpleadoPorId(e.id_empleado as string)?.nombre_completo}</span>
              <span className="text-xs text-amber-800">Salió a las: <b>{e.salidaDescanso}</b></span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* ALERTA 3: FALTA CHECAR SALIDA */}
      <Card className="border-orange-200 shadow-sm">
        <CardHeader className="pb-2 bg-orange-50/50 rounded-t-lg">
          <CardTitle className="text-sm font-bold flex items-center gap-2 text-orange-700">
            <Clock className="w-4 h-4" />
            Falta Checar Salida ({faltaSalida.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 pt-4 max-h-48 overflow-y-auto">
          {faltaSalida.length === 0 && (
            <p className="text-xs text-muted-foreground text-center">Todo en orden</p>
          )}
          {faltaSalida.map((f, i) => (
            <div key={i} className="p-3 bg-orange-50 rounded-md border border-orange-100 flex flex-col gap-1">
              <span className="text-xs font-bold text-orange-900">{getNombreEmpleadoPorId(f.id_empleado as string)?.nombre_completo}</span>
              <span className="text-xs text-orange-800">Debió salir a las: <b>{f.horaSalidaEfectiva}</b></span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}