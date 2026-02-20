'use client';

import { useState, useEffect, useTransition } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { registrarChequeo } from '@/app/(shared)/checador/actions';
import type { EmpleadoTurno, RegistroChequeo } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { ScannerBiometrico } from '@/components/ScannerBiometrico';
import { Camera } from 'lucide-react';

const formatClientTime = (date: Date, timeZone?: string | null) => {
  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  };
  if (timeZone) {
    options.timeZone = timeZone;
  }
  return date.toLocaleTimeString('es-ES', options);
};

const formatClientDate = (date: Date, timeZone?: string | null) => {
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
    if (timeZone) {
    options.timeZone = timeZone;
  }
  const formatted = new Intl.DateTimeFormat('es-ES', options).format(date);
  return `Hoy, ${formatted.charAt(0).toUpperCase() + formatted.slice(1)}`;
};

interface UserLocation {
    latitude: number;
    longitude: number;
    accuracy: number;
}

export function ChecadorReloj({ registros, turnoAsignado }: { registros: RegistroChequeo[], turnoAsignado: EmpleadoTurno | undefined }) {
  const [serverDateTime, setServerDateTime] = useState<Date | null>(null);
  const [userTimezone, setUserTimezone] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    const fetchServerTime = async () => {
      try {
        const response = await fetch('/api/time');
        const data = await response.json();
        setServerDateTime(new Date(data.serverTime));
      } catch (error) {
        console.error('Failed to fetch server time:', error);
        setServerDateTime(new Date());
      }
    };

    fetchServerTime();

    const timerId = setInterval(() => {
      setServerDateTime(prevTime => prevTime ? new Date(prevTime.getTime() + 1000) : null);
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        setUserLocation({ latitude, longitude, accuracy });
        try {
          const tzResponse = await fetch(`https://timeapi.io/api/TimeZone/coordinate?latitude=${latitude}&longitude=${longitude}`);
          if (tzResponse.ok) {
            const tzData = await tzResponse.json();
            setUserTimezone(tzData.timeZone);
          } else {
            throw new Error('API request failed');
          }
        } catch (e) {
          console.error("Could not fetch timezone, using device default.", e);
          const fallbackTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
          setUserTimezone(fallbackTz);
          toast({ title: 'Zona Horaria', description: 'No se pudo detectar la zona horaria por ubicación. Usando la del dispositivo.', variant: 'default' });
        }
      },
      (err) => {
        console.warn("Location denied, using device default timezone.");
        const fallbackTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        setUserTimezone(fallbackTz);
        toast({ title: 'Ubicación requerida', description: 'Para registrar la hora correcta, se usará la zona horaria del dispositivo.', variant: 'destructive' });
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [toast]);

  const currentTime = serverDateTime;

  const getChequeoState = () => {
    if (!registros || registros.length === 0) {
      return { action: 'entrada' as const, label: 'Entrada', message: 'No has checado entrada' };
    }
    const tieneEntrada = registros.some(r => r.tipo_registro === 'entrada');
    const tieneSalidaDescanso = registros.some(r => r.tipo_registro === 'salida_descanso');
    const tieneRegresoDescanso = registros.some(r => r.tipo_registro === 'regreso_descanso');
    const tieneSalida = registros.some(r => r.tipo_registro === 'salida');
    if (!tieneEntrada) {
      return { action: 'entrada' as const, label: 'Entrada', message: 'No has checado entrada' };
    }
    if (!tieneSalidaDescanso) {
      return { action: 'salida_descanso' as const, label: 'Salida a Descanso', message: 'Turno iniciado' };
    }
    if (!tieneRegresoDescanso) {
      return { action: 'regreso_descanso' as const, label: 'Regreso de Descanso', message: 'En descanso' };
    }
    if (!tieneSalida) {
      return { action: 'salida' as const, label: 'Salida', message: 'Turno reanudado' };
    }
    return { action: null, label: 'Turno Terminado', message: 'Has completado tu turno de hoy' };
  };

  const { action, label, message } = getChequeoState();

  const formatHorario = (timeStr: string | null | undefined) => {
    if (!timeStr) return '';
    const [h, m] = timeStr.split(':');
    const date = new Date();
    date.setHours(parseInt(h), parseInt(m), 0);
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: userTimezone || undefined
    });
  };

  const handleBioSuccess = (descriptor: number[]) => {
    if (action && currentTime && userLocation && userTimezone) {
        startTransition(async () => {
            const { latitude, longitude, accuracy } = userLocation;

            const dateInTimezone = new Intl.DateTimeFormat('sv-SE', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                timeZone: userTimezone,
            }).format(currentTime);

            const timeInTimezone = new Intl.DateTimeFormat('es-ES', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
                timeZone: userTimezone,
            }).format(currentTime);

            const result = await registrarChequeo(
                action,
                dateInTimezone,
                timeInTimezone,
                latitude,
                longitude,
                accuracy,
                descriptor
            );

            if (result?.error) {
                toast({ title: 'Error', description: result.error, variant: 'destructive' });
            } else if (result?.success) {
                toast({ title: 'Éxito', description: result.success });
            }
        });
    } else {
        toast({ title: 'Por favor, espere', description: 'Obteniendo ubicación y zona horaria...', variant: 'default' });
    }
  }

  return (
    <Card className="w-full max-w-sm mx-auto shadow-lg border-2">
      <CardHeader className="text-center pb-2">
        <CardDescription className="text-lg text-foreground/80">{currentTime && userTimezone ? formatClientDate(currentTime, userTimezone) : 'Cargando...'}</CardDescription>
        <CardTitle className="text-7xl font-bold tracking-tighter text-green-700">
          {currentTime && userTimezone ? (
            <>
              {formatClientTime(currentTime, userTimezone).split(':')[0]}:{formatClientTime(currentTime, userTimezone).split(':')[1]}
              <span className="text-4xl font-medium ml-2">{formatClientTime(currentTime, userTimezone).split(':')[2]}</span>
            </>
          ) : (
            '--:--:--'
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-lg text-muted-foreground">{message}</p>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 px-6 pb-6">
        <ScannerBiometrico onResult={handleBioSuccess}>
            <Button className="w-full text-lg py-6 bg-green-600 hover:bg-green-700 text-white" disabled={!action || isPending || !userLocation || !userTimezone} size="lg">
                <Camera className="mr-2 h-6 w-6" />
                {label}
            </Button>
        </ScannerBiometrico>
        {turnoAsignado && (
            <p className="text-sm text-muted-foreground">
                Recuerda: Horario de {formatHorario(turnoAsignado?.entrada)} a {formatHorario(turnoAsignado?.salida)}
            </p>
        )}
      </CardFooter>
    </Card>
  );
}
