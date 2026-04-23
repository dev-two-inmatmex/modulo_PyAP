'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Clock, Coffee, DoorOpen } from "lucide-react";
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
  const { getNombreEmpleadoPorId: getEmployeeById } = useNombreEmpleado();
  /*const getNombre = (id: string) => {
    const emp = empleadosView.find((e: any) => e.id_empleado === id);
    return emp ? `${emp.nombres} ${emp.apellidos}` : 'Empleado Desconocido';
  };*/

  // Filtramos para asegurar que solo mostramos las solicitudes que siguen en "Limbo"
  const solicitudesPendientes = solicitudes.filter(s => s.aceptar_asistencia_tardia === null);

  return (
    <div className="space-y-4">
      {/* ALERTA 1: SOLICITUDES DE ENTRADA TARDÍA */}
      <Card className="border-red-200 shadow-sm">
        <CardHeader className="pb-2 bg-red-50/50 rounded-t-lg">
          <CardTitle className="text-sm font-bold flex items-center gap-2 text-red-700">
            <DoorOpen className="w-4 h-4" />
            Esperando Permiso de entrada ({solicitudesPendientes.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 pt-4">
          {solicitudesPendientes.length === 0 && (
            <p className="text-xs text-muted-foreground text-center">Nadie esperando</p>
          )}
          {solicitudesPendientes.map((s) => (
            <div key={s.id} className="p-3 bg-red-50 rounded-md border border-red-100 flex flex-col gap-1">
              <span className="text-xs font-bold text-red-900">{getEmployeeById(s.id_empleado)?.nombre_completo || 'Empleado Desconocido'}</span>
              <span className="text-xs text-red-800">Checó a las: <b>{s.hora}</b></span>
              {s.motivo && <span className="text-[10px] text-red-700 italic">"{s.motivo}"</span>}
              {/* Aquí puedes agregar después tu DialogTrigger para que RH acepte */}
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
        <CardContent className="space-y-2 pt-4">
          {excedeDescanso.length === 0 && (
            <p className="text-xs text-muted-foreground text-center">Todos a tiempo</p>
          )}
          {excedeDescanso.map((e, i) => (
            <div key={i} className="p-3 bg-amber-50 rounded-md border border-amber-100 flex flex-col gap-1">
              <span className="text-xs font-bold text-amber-900">{getEmployeeById(e.id_empleado)?.nombre_completo || 'Empleado Desconocido'}</span>
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
        <CardContent className="space-y-2 pt-4">
          {faltaSalida.length === 0 && (
            <p className="text-xs text-muted-foreground text-center">Todo en orden</p>
          )}
          {faltaSalida.map((f, i) => (
            <div key={i} className="p-3 bg-orange-50 rounded-md border border-orange-100 flex flex-col gap-1">
              <span className="text-xs font-bold text-orange-900">{getEmployeeById(f.id_empleado)?.nombre_completo || 'Empleado Desconocido'}</span>
              <span className="text-xs text-orange-800">Debió salir a las: <b>{f.horaSalidaEfectiva}</b></span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}