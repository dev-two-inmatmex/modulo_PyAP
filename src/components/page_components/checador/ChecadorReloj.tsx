'use client';

import { useTransition } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { registrarChequeo } from '@/app/(shared)/checador/actions';
import type { EmpleadoTurno, RegistroChequeo, ConfigUbicacion } from '@/services/types';
import { useToast } from '@/hooks/use-toast';
import { ScannerBiometrico } from '@/components/reutilizables/ScannerBiometrico';
import { Camera } from 'lucide-react';
import { useRealtimeChecadorRegistrosUsuario } from '@/hooks/useRealtimeChecadorRegistrosUsuario';
import { useRealtimeReloj } from '@/hooks/useRealtimeReloj';
import { useGeocerca } from '@/hooks/useGeoCerca';
import { IndicadorUbicacion } from '@/components/reutilizables/IndicadorUbicacion';
import { BotonMantenido } from '@/components/reutilizables/MantenidoButton';

export function ChecadorReloj({
  registros,
  turnoAsignado,
  userId, // <-- NUEVO
  ubicacionesValidas
}: {
  registros: RegistroChequeo[],
  turnoAsignado: EmpleadoTurno | undefined,
  userId: string,
  ubicacionesValidas: ConfigUbicacion[]
}) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const registrosLocales = useRealtimeChecadorRegistrosUsuario(registros, userId);
  const {
    userLocation, ubicacionDetectada, guiaUbicacion, errorGps, reintentarGps
  } = useGeocerca(ubicacionesValidas);
  const { horaMinutos, segundos, fechaFormateada, formatHorario, getFormatosBD } = useRealtimeReloj(userLocation);

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
    // 3. Si ya entró, pero no ha salido a descanso
    if (!tieneSalidaDescanso) {
      return { action: 'salida_descanso' as const, label: 'Salida a Descanso', message: 'Turno iniciado', canLeaveEarly: true };
    }
    // 4. Si ya salió a descanso, pero no ha regresado
    if (!tieneRegresoDescanso) {
      return { action: 'regreso_descanso' as const, label: 'Regreso de Descanso', message: 'En descanso', canLeaveEarly: true };
    }
    // 5. Si ya regresó de descanso (y sabemos que no tiene salida por la regla #1)
    return { action: 'salida' as const, label: 'Salida', message: 'Turno reanudado', canLeaveEarly: false };
  };

  const { action, label, message, canLeaveEarly } = getChequeoState();

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

        if (result?.error) toast({ title: 'Error', description: result.error, variant: 'destructive' });
        else if (result?.success) toast({ title: 'Éxito', description: result.success });
      });
    } else {
      toast({ title: 'Cargando', description: 'Obteniendo ubicación y zona horaria...', variant: 'default' });
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
          onRetry={reintentarGps}
        />

        <p className="text-lg text-muted-foreground">{message}</p>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 px-6 pb-6">
        {/* BOTÓN PRINCIPAL */}
        {action && (
          /*<ScannerBiometrico onResult={(desc) => handleBioSuccess(desc, action)}>
            <Button className="w-full text-lg py-6 bg-green-600 hover:bg-green-700 text-white" disabled={isPending || !userLocation || !ubicacionDetectada} size="lg">
              <Camera className="mr-2 h-6 w-6" />
              {label}
            </Button>
          </ScannerBiometrico>*/
          (action === 'entrada' || action === 'salida') ? (
            <ScannerBiometrico onResult={(desc) => handleBioSuccess(desc, action)}>
              <Button className="w-full text-lg py-6 bg-green-600 hover:bg-green-700 text-white" disabled={isPending || !userLocation || !ubicacionDetectada || !!errorGps} size="lg">
                <Camera className="mr-2 h-6 w-6" /> {label}
              </Button>
            </ScannerBiometrico>
          ) : (
            // 2. Condición: Si es descanso, usamos el botón de mantener pulsado
            <BotonMantenido
              label={label}
              disabled={isPending || !userLocation || !ubicacionDetectada || !!errorGps}
              // Le mandamos un arreglo vacío [] porque no hay biometría esta vez
              onComplete={() => handleBioSuccess([], action)}
              segundos={5}
            />
          )
        )}

        {/* BOTÓN SECUNDARIO (Salida Anticipada) */}
        {canLeaveEarly && (
          <ScannerBiometrico onResult={(desc) => handleBioSuccess(desc, 'salida')}>
            <Button variant="destructive" className="w-full text-lg py-6" disabled={isPending || !userLocation || !ubicacionDetectada} size="lg">
              <Camera className="mr-2 h-6 w-6" />
              Salida Anticipada
            </Button>
          </ScannerBiometrico>
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
