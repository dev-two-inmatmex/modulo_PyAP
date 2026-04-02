'use client';

import { useTransition, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { registrarChequeo } from '@/app/(shared)/checador/actions';
import type { RegistroChequeo, ConfigUbicacion } from '@/services/types';
import { toast } from 'sonner';
import { ScannerBiometrico } from '@/components/reutilizables/ScannerBiometrico';
import { Camera } from 'lucide-react';
import { useRealtimeChecadorRegistrosUsuario } from '@/hooks/useRealtimeChecadorRegistrosUsuario';
import { useRealtimeReloj } from '@/hooks/useRealtimeReloj';
import { useGeocerca } from '@/hooks/useGeoCerca';
import { IndicadorUbicacion } from '@/components/reutilizables/IndicadorUbicacion';
import { BotonMantenido } from '@/components/reutilizables/MantenidoButton';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Database } from "@/types/database.types";
type EmpleadoTurno = Database["public"]["Views"]["vista_horarios_empleados"]["Row"];
export function ChecadorReloj({
  registros,
  turnoAsignado,
  userId, // <-- NUEVO
  ubicacionesValidas
}: {
  registros: RegistroChequeo[],
  turnoAsignado: EmpleadoTurno,
  userId: string,
  ubicacionesValidas: ConfigUbicacion[]
}) {
  const [isPending, startTransition] = useTransition();
  const [SalidaAnticipada, setSalidaAnticipada] = useState(false);
  const registrosLocales = useRealtimeChecadorRegistrosUsuario(registros, userId);
  const {
    userLocation, ubicacionDetectada, guiaUbicacion, errorGps, reintentarGps
  } = useGeocerca(ubicacionesValidas);
  const { serverDateTime, horaMinutos, segundos, fechaFormateada, formatHorario, getFormatosBD } = useRealtimeReloj(userLocation);

  const getChequeoState = () => {
    if (!registrosLocales || registrosLocales.length === 0) {
      return { action: 'entrada' as const, label: 'Entrada', message: 'No has checado entrada', canLeaveEarly: false };
    }

    const tieneEntrada = registrosLocales.some(r => r.tipo_registro === 'entrada');
    const tieneSalidaDescanso = registrosLocales.some(r => r.tipo_registro === 'salida_descanso');
    const tieneRegresoDescanso = registrosLocales.some(r => r.tipo_registro === 'regreso_descanso');
    const tieneSalida = registrosLocales.some(r => r.tipo_registro === 'salida');
    if (tieneSalida) {
      return { action: null, label: 'Turno Terminado', message: 'Has completado tu turno de hoy', canLeaveEarly: false };
    }
    // 2. Si no ha entrado
    if (!tieneEntrada) {
      return { action: 'entrada' as const, label: 'Entrada', message: 'No has checado entrada', canLeaveEarly: false };
    }

    if (!serverDateTime || !turnoAsignado) {
      return { action: null, label: 'Cargando...', message: 'Calculando tus horarios...' };
    }

    const currentMins = serverDateTime.getHours() * 60 + serverDateTime.getMinutes();

    // Función auxiliar para convertir las horas del turno a minutos
    const getMins = (t: string | null | undefined) => {
      if (!t) return 0;
      const [h, m] = t?.split(':').map(Number);
      return h * 60 + m;
    };

    const minSalidaDescanso = getMins(turnoAsignado.salida_descanso);
    const minRegresoDescanso = getMins(turnoAsignado.regreso_descanso);
    const minSalida = getMins(turnoAsignado.salida);

    // 3. Si ya entró, pero no ha salido a descanso
    /*if (!tieneSalidaDescanso) {
      return { action: 'salida_descanso' as const, label: 'Salida a Descanso', message: 'Turno iniciado', canLeaveEarly: true };
    }
    // 4. Si ya salió a descanso, pero no ha regresado
    if (!tieneRegresoDescanso) {
      return { action: 'regreso_descanso' as const, label: 'Regreso de Descanso', message: 'En descanso', canLeaveEarly: true };
    }
    // 5. Si ya regresó de descanso (y sabemos que no tiene salida por la regla #1)
    return { action: 'salida' as const, label: 'Salida', message: 'Turno reanudado', canLeaveEarly: false };*/

    if (!tieneSalidaDescanso) {
      // Regla: Se quita 10 minutos antes del regreso de descanso
      const pasoVentanaDescanso = currentMins > (minRegresoDescanso - 10);

      if (!pasoVentanaDescanso) {
        // Regla: Aparece solo 5 min antes de la hora oficial de salir a comer
        if (currentMins >= (minSalidaDescanso - 5)) {
          return { action: 'salida_descanso' as const, label: 'Salida a Descanso', message: 'Es hora de tu descanso' };
        } else {
          return { action: null, label: 'Trabajando', message: `Tu descanso es a las ${formatHorario(turnoAsignado.salida_descanso)}` };
        }
      }
      // Si `pasoVentanaDescanso` es TRUE, automáticamente ignoramos el descanso y saltamos a evaluar la salida.
    } else if (!tieneRegresoDescanso) {
      // Si ya salió a comer, DEBE regresar. No hay límite de tiempo estricto aquí para no dejarlo fuera.
      return { action: 'regreso_descanso' as const, label: 'Regreso de Descanso', message: 'En descanso' };
    }

    // -- B. LÓGICA DE SALIDA OFICIAL --
    // Regla: Solo se muestra si falta 1 min para la salida (o si ya es más tarde)
    if (currentMins >= (minSalida - 5)) {
      return { action: 'salida' as const, label: 'Salida', message: 'Puedes registrar tu salida oficial' };
    } else {
      return { action: null, label: 'Trabajando', message: `Tu salida oficial es a las ${formatHorario(turnoAsignado.salida)}` };
    }

  };

  const { action, label, message, canLeaveEarly } = getChequeoState();
  const tieneEntrada = registrosLocales?.some(r => r.tipo_registro === 'entrada');
  const tieneSalida = registrosLocales?.some(r => r.tipo_registro === 'salida');
  const puedeSalirAnticipado = tieneEntrada && !tieneSalida && action !== 'salida';

  const handleBioSuccess = (descriptor: number[], actionToPerform: 'entrada' | 'salida_descanso' | 'regreso_descanso' | 'salida') => {
    const formatos = getFormatosBD();
    if (actionToPerform && formatos && userLocation && ubicacionDetectada) {
      startTransition(async () => {
        const { dateInTimezone, timeInTimezone } = formatos;

        let horaEsperada = null;
        if (turnoAsignado) {
          switch (actionToPerform) {
            case 'entrada':
              horaEsperada = turnoAsignado.entrada;
              break;
            case 'salida_descanso':
              horaEsperada = turnoAsignado.salida_descanso;
              break;
            case 'regreso_descanso':
              horaEsperada = turnoAsignado.regreso_descanso;
              break;
            case 'salida':
              horaEsperada = turnoAsignado.salida;
              break;
          }
        }

        const result = await registrarChequeo(
          actionToPerform,
          dateInTimezone,
          timeInTimezone,
          ubicacionDetectada.id,
          userLocation.latitude,
          userLocation.longitude,
          userLocation.accuracy,
          descriptor,
          horaEsperada,
        );

        if (result?.error) {
          toast.error('Error', {
            description: result.error,
            position: "top-center",
            style: {background: 'red',}
          });
          setSalidaAnticipada(false)
        }
        else if (result?.success) toast.success('Éxito', {
          description: result.success,
          position: "top-center",
          style: {background: 'green',}
        });
      });
    } else {
      toast('Cargando', {
        description: 'Obteniendo ubicación y zona horaria...',
        position: "top-center"
      });
    }
  }

  return (
    <Card className="w-full max-w-sm mx-auto shadow-lg border-2">
      <CardHeader className="text-center pb-2">
        <CardDescription className="text-lg text-foreground/80">{fechaFormateada}</CardDescription>
        <CardTitle className="text-7xl font-bold tracking-tighter text-green-700">
          {horaMinutos}<span className="text-4xl font-medium ml-2">{segundos}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center">

        <IndicadorUbicacion
          ubicacionDetectada={ubicacionDetectada?.nombre_ubicacion}
          guiaUbicacion={guiaUbicacion}
          buscando={!userLocation}
          errorGps={errorGps}
        />

        <p className="text-lg text-muted-foreground">{message}</p>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 px-6 pb-6">
        {/* BOTÓN PRINCIPAL */}
        {action && (
          (action === 'entrada' || action === 'salida') ? (
            <ScannerBiometrico onResult={(desc) => handleBioSuccess(desc, action)}>
              <Button className="w-full text-lg py-6 bg-green-600 hover:bg-green-700 text-white"
                disabled={isPending || !userLocation || !ubicacionDetectada} size="lg">
                <Camera className="mr-2 h-6 w-6" /> {label}
              </Button>
            </ScannerBiometrico>
          ) : (
            // 2. Condición: Si es descanso, usamos el botón de mantener pulsado
            <BotonMantenido
              label={label}
              disabled={isPending || !userLocation || !ubicacionDetectada}
              // Le mandamos un arreglo vacío [] porque no hay biometría esta vez
              onComplete={() => handleBioSuccess([], action)}
              segundos={2}
            />
          )
        )}

        {/* BOTÓN SECUNDARIO (Salida Anticipada) */}
        {//canLeaveEarly && (
          puedeSalirAnticipado && (
            <div className="flex flex-col w-full gap-3 mt-4 pt-4 border-t border-dashed">
              <div className="flex items-center justify-between">
                <Label htmlFor="salida-switch" className="text-sm font-semibold text-red-500 cursor-pointer">
                  Habilitar Salida Anticipada
                </Label>
                <Switch
                  id="salida-switch"
                  checked={SalidaAnticipada}
                  onCheckedChange={setSalidaAnticipada}
                />
              </div>

              {SalidaAnticipada && (
                <ScannerBiometrico onResult={(desc) => handleBioSuccess(desc, 'salida')}>
                  <Button variant="destructive" className="w-full text-lg py-6" disabled={isPending || !userLocation || !ubicacionDetectada} size="lg">
                    <Camera className="mr-2 h-6 w-6" />
                    Salida Anticipada
                  </Button>
                </ScannerBiometrico>
              )}
            </div>
          )}
        {turnoAsignado && (
          <>
            <p className="text-sm text-muted-foreground">
              Recuerda: Horario de {formatHorario(turnoAsignado?.entrada)} a {formatHorario(turnoAsignado?.salida)}
            </p>
            <p className="text-sm text-muted-foreground">
              Recuerda: Descanso de {formatHorario(turnoAsignado?.salida_descanso)} a {formatHorario(turnoAsignado?.regreso_descanso)}
            </p>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
