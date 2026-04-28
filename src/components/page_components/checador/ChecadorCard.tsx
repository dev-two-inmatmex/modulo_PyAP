'use client';

import { useTransition, useMemo, useState } from 'react';
import { useGeocerca } from '@/hooks/useGeoCerca';
import { useRealtimeReloj } from '@/hooks/useRealtimeRelojPorUbicacion';
import { registrarChequeoPrueba } from '@/app/(shared)/checador/actions';
import { Button } from '@/components/ui/button';
import { Toaster, toast } from 'sonner';
import { List, Clock, Camera } from 'lucide-react';
import { IndicadorUbicacion } from '@/components/reutilizables/IndicadorUbicacion';
import { ScannerBiometrico } from '@/components/reutilizables/ScannerBiometrico';
import { BotonMantenido } from '@/components/reutilizables/MantenidoButton';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import type { RegistroChequeo } from '@/services/asistencias';
import type { config_ubicaciones as ConfigUbicacion } from '@/services/ubicaciones';
import type { Empleado_asignacion_horas_extra as HorasExtraAsignacion } from '@/services/horarios';
import { SolicitudTardiaDialog } from './ChecadorSolicitudTardia';
import type {versolicitud_asistencia_30min_despues} from '@/services/solicitudes-asistenciatardia';

type ChequeoAction = 'entrada' | 'salida_descanso' | 'regreso_descanso' | 'salida' | 'solicitud_tardia';
type Horario = { hora_entrada: string; hora_salida: string; };
type Descanso = { inicio_descanso: string; fin_descanso: string; } | null;

const timeToMins = (time: string): number => {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
};

export function ChecadorCard({ registros, horario, descanso, userId, ubicacionesValidas, horasExtra, solicitudes }: { registros: RegistroChequeo[], horario: Horario, descanso: Descanso, userId: string, ubicacionesValidas: ConfigUbicacion[], horasExtra: HorasExtraAsignacion[], solicitudes: versolicitud_asistencia_30min_despues[] }) {

  const [salidaAnticipada, setSalidaAnticipada] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { userLocation, ubicacionDetectada, guiaUbicacion, errorGps } = useGeocerca(ubicacionesValidas);
  const { horaMinutos, fechaFormateada, formatHorario, getFormatosBD } = useRealtimeReloj(userLocation);

  const { horaEntradaEfectiva, horaSalidaEfectiva } = useMemo(() => {
    const heParaEntrada = horasExtra.find(he => he.hora_inicio && timeToMins(he.hora_fin!) <= timeToMins(horario.hora_entrada));
    const heParaSalida = horasExtra.find(he => he.hora_inicio && timeToMins(he.hora_inicio!) >= timeToMins(horario.hora_salida));
    return {
      horaEntradaEfectiva: heParaEntrada?.hora_inicio ?? horario.hora_entrada,
      horaSalidaEfectiva: heParaSalida?.hora_fin ?? horario.hora_salida
    };
  }, [horario, horasExtra]);

  const tieneEntrada = registros.some(r => r.tipo_registro === 'entrada');
  const tieneSalidaDescanso = registros.some(r => r.tipo_registro === 'salida_descanso');
  const tieneRegresoDescanso = registros.some(r => r.tipo_registro === 'regreso_descanso');
  const tieneSalida = registros.some(r => r.tipo_registro === 'salida');

  const chequeoState = useMemo(() => {
    if (tieneSalida) return { action: null, label: "Jornada Completada", message: "¡Nos vemos mañana!", horaEsperada: null };
    let currentMins = 0;
    if (horaMinutos && horaMinutos !== '--:--') currentMins = timeToMins(horaMinutos);
    const minEntradaEfectiva = timeToMins(horaEntradaEfectiva);
    const minSalidaEfectiva = timeToMins(horaSalidaEfectiva);
    const minInicioDescanso = descanso ? timeToMins(descanso.inicio_descanso) : null;

    const puedeSalirAnticipado = tieneEntrada && (!descanso || tieneRegresoDescanso);

    if (currentMins === 0) return { action: null, label: "Sincronizando...", message: "Obteniendo hora del servidor...", horaEsperada: null };
    if (!tieneEntrada) {

      if ((currentMins > minEntradaEfectiva + 30)&& solicitudes.length == 0 ) {
        return {
          action: 'solicitud_tardia' as const,
          label: "Pedir Acceso por Retardo",
          message: "Límite excedido. Tu entrada debe ser autorizada por RH.",
          horaEsperada: horario.hora_entrada
        };
      }
      if (solicitudes.length > 0) {
        return {
          label: "Solicitud en Espera de Autorización",
          message: "Solicitud de entrada por retardo recibida por RH. Espera la autorizacion.",
        };
      }

      return { action: 'entrada' as const, label: "Registrar Entrada", message: `Turno inicia ${formatHorario(horaEntradaEfectiva)}`, horaEsperada: horario.hora_entrada };
    }
    if (minInicioDescanso && !tieneSalidaDescanso) {
      if (currentMins >= minInicioDescanso) return { action: 'salida_descanso' as const, label: "Iniciar Comida", message: "Tu periodo de comida ha comenzado.", horaEsperada: descanso!.inicio_descanso };
    }
    if (tieneSalidaDescanso && !tieneRegresoDescanso) {
      return { action: 'regreso_descanso' as const, label: "Terminar Comida", message: "Registra tu regreso de comida.", horaEsperada: descanso!.fin_descanso };
    }
    if (currentMins >= minSalidaEfectiva - 5) {
      return { action: 'salida' as const, label: "Registrar Salida", message: "Ya puedes registrar tu salida final.", horaEsperada: horario.hora_salida };
    }
    return { action: null, label: 'Trabajando', message: `Tu salida es a las ${formatHorario(horaSalidaEfectiva)}`, horaEsperada: null };
  }, [registros, horario, descanso, horaMinutos, formatHorario, horaEntradaEfectiva, horaSalidaEfectiva, salidaAnticipada, tieneEntrada, tieneRegresoDescanso, tieneSalida]);

  const handleAction = (action: ChequeoAction, faceDescriptor?: number[]) => {
    if (action !== 'solicitud_tardia') {
      startTransition(async () => {
        const formatosBD = getFormatosBD();
        if (!ubicacionDetectada || !formatosBD) {
          toast.error("No se pudo obtener la ubicación o la hora. Intenta de nuevo.");
          return;
        }

        // 1. Calculamos la hora dinámicamente según la acción recibida
        // en lugar de depender de lo que diga "chequeoState"
        let horaEsperadaEnvio: string | null = null;
        switch (action) {
          case 'entrada':
            horaEsperadaEnvio = horario.hora_entrada;
            break;
          case 'salida_descanso':
            horaEsperadaEnvio = descanso?.inicio_descanso ?? null;
            break;
          case 'regreso_descanso':
            horaEsperadaEnvio = descanso?.fin_descanso ?? null;
            break;
          case 'salida':
            horaEsperadaEnvio = horario.hora_salida; 
            break;
        }

        // 2. Enviamos "horaEsperadaEnvio" en lugar de "chequeoState.horaEsperada"
        const result = await registrarChequeoPrueba(
          action, 
          formatosBD.dateInTimezone, 
          formatosBD.timeInTimezone, 
          ubicacionDetectada.id, 
          horaEsperadaEnvio, // <-- Variable calculada
          faceDescriptor
        );

        if (result.success) {
          toast.success(result.message);
          setSalidaAnticipada(false); // Apagamos el switch tras el éxito
        } else {
          toast.error(result.message);
        }
      });
    }
  };

  const renderActionButtons = () => {
    if (!chequeoState.action) {
      return (<div className="flex items-center justify-center gap-2 text-gray-600 font-semibold p-3 rounded-md bg-gray-100"><Clock size={18} /><span>{chequeoState.label}</span></div>);
    }


    if (chequeoState.action === 'solicitud_tardia') {
      return (
        <SolicitudTardiaDialog
          id_empleado={userId}
          hora_esperada={chequeoState.horaEsperada!}
          formatosBD={getFormatosBD()}
          id_ubicacion ={ ubicacionDetectada?.id}
          solicitud = {solicitudes}
        />
      );
    }

    const esBiometrico = chequeoState.action === 'entrada' || chequeoState.action === 'salida';
    if (esBiometrico) {
      return (
        <ScannerBiometrico onResult={(desc) => handleAction(chequeoState.action!, desc)}>
          <Button className="w-full text-lg py-6" disabled={isPending || !ubicacionDetectada} size="lg">
            <Camera className="mr-2 h-6 w-6" /> {chequeoState.label}
          </Button>
        </ScannerBiometrico>
      );
    } else {
      return (
        <BotonMantenido label={chequeoState.label} disabled={isPending || !ubicacionDetectada} onComplete={() => handleAction(chequeoState.action!)} segundos={2} />
      );
    }
  };
  const currentMinsLocal = horaMinutos && horaMinutos !== '--:--' ? timeToMins(horaMinutos) : 0;
  const esHoraDeSalidaOficial = currentMinsLocal > 0 && currentMinsLocal >= timeToMins(horaSalidaEfectiva) - 5;

  const puedeHabilitarSalidaAnticipada = tieneEntrada && !tieneSalida && !esHoraDeSalidaOficial;

  const formatTipoRegistro = (tipo: string) => tipo.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  return (
    <>
      <Toaster richColors position="top-center" />
      <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
        <div className="w-full max-w-sm mx-auto bg-white rounded-xl shadow-lg p-8 space-y-4 text-center">
          <p className="text-gray-500 capitalize">{fechaFormateada}</p>
          <div className="font-bold text-6xl text-gray-800">{horaMinutos}</div>
          <div className="h-12">{renderActionButtons()}</div>
          <p className="text-sm text-gray-500 h-5">{chequeoState.message}</p>

          {registros.length > 0 && (<div className="text-left space-y-2 pt-4"><h3 className="font-semibold text-center flex items-center justify-center gap-2"><List size={16} /> Mis Registros de Hoy</h3><div className="border rounded-lg p-3 bg-gray-50/50 space-y-2">{registros.map((reg) => (<div key={reg.id} className="flex justify-between items-center text-sm border-b last:border-b-0 pb-1"><span className="text-gray-600">{formatTipoRegistro(reg.tipo_registro as string)}</span><span className="font-mono font-semibold text-gray-800">{reg.registro ? formatHorario(reg.registro) : '--:--'}</span></div>))}</div></div>)}

          <IndicadorUbicacion ubicacionDetectada={ubicacionDetectada?.nombre_ubicacion} guiaUbicacion={guiaUbicacion} buscando={!userLocation} errorGps={errorGps} />

          {puedeHabilitarSalidaAnticipada && (
            <div className="flex flex-col w-full gap-3 mt-4 pt-4 border-t border-dashed">
              <div className="flex items-center justify-center space-x-2">
                <Label htmlFor="salida-anticipada" className="text-sm font-semibold text-red-500 cursor-pointer">
                  Habilitar Salida Anticipada
                </Label>
                <Switch id="salida-anticipada" checked={salidaAnticipada} onCheckedChange={setSalidaAnticipada} />
              </div>

              {salidaAnticipada && (
                <ScannerBiometrico onResult={(desc) => handleAction('salida', desc)}>
                  <Button variant="destructive" className="w-full text-lg py-6 mt-2" disabled={isPending || !ubicacionDetectada} size="lg">
                    <Camera className="mr-2 h-6 w-6" /> Salida Anticipada
                  </Button>
                </ScannerBiometrico>
              )}
            </div>
          )}

          <p className="text-xs text-gray-400 pt-2">
            Turno de hoy: {formatHorario(horaEntradaEfectiva)} a {formatHorario(horaSalidaEfectiva)}
            {(horaEntradaEfectiva !== horario.hora_entrada || horaSalidaEfectiva !== horario.hora_salida) &&
              <span className="text-blue-500 font-bold" title="Horario modificado por horas extra"> *</span>
            }
          </p>
        </div>
      </div>
    </>
  );
}