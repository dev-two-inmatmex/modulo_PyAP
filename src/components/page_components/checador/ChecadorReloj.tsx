'use client';

import { useState, useEffect, useTransition } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { registrarChequeo } from '@/app/(shared)/checador/actions';
import type { EmpleadoTurno, RegistroChequeo, ConfigUbicacion } from '@/services/types';
import { useToast } from '@/hooks/use-toast';
import { ScannerBiometrico } from '@/components/ScannerBiometrico';
import { Camera, MapPin } from 'lucide-react';
import { useRealtimeChecadorRegistrosUsuario } from '@/hooks/useRealtimeChecadorRegistrosUsuario';

import { calcularDistanciaMetros, calcularRumbo } from '@/utils/geo';
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
  const [serverDateTime, setServerDateTime] = useState<Date | null>(null);
  const [userTimezone, setUserTimezone] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [ubicacionDetectada, setUbicacionDetectada] = useState<ConfigUbicacion | null>(null);
  const [guiaUbicacion, setGuiaUbicacion] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const registrosLocales = useRealtimeChecadorRegistrosUsuario(registros, userId);
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
  useEffect(() => {
    if (userLocation && ubicacionesValidas.length > 0) {
      let encontrada: ConfigUbicacion | null = null;
      let masCercana: ConfigUbicacion | null = null;
      let distanciaMinima = Infinity;

      for (const ubi of ubicacionesValidas) {
        const distancia = calcularDistanciaMetros(userLocation.latitude, userLocation.longitude, ubi.latitud, ubi.longitud);
        
        // Si está dentro de alguna, nos detenemos
        if (distancia <= ubi.radio_permitido) {
          encontrada = ubi;
          break;
        }

        // Si no, vamos guardando cuál es la que le queda más cerca
        if (distancia < distanciaMinima) {
          distanciaMinima = distancia;
          masCercana = ubi;
        }
      }

      setUbicacionDetectada(encontrada);

      // Si no encontró ninguna válida, calculamos la guía hacia la más cercana
      if (!encontrada && masCercana) {
        const metrosFaltantes = Math.ceil(distanciaMinima - masCercana.radio_permitido);
        const direccion = calcularRumbo(
          userLocation.latitude, 
          userLocation.longitude, 
          masCercana.latitud, 
          masCercana.longitud
        );
        
        // ¡Aquí está la magia! Solo agregamos el nombre de la ubicación al string
        setGuiaUbicacion(
          `Acércate ${metrosFaltantes}m al ${direccion} para entrar en el rango de ${masCercana.nombre_ubicacion}`
        );
      } else {
        setGuiaUbicacion(null);
      }
    }
  }, [userLocation, ubicacionesValidas]);

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

  const handleBioSuccess = (descriptor: number[], actionToPerform: 'entrada' | 'salida_descanso' | 'regreso_descanso' | 'salida') => {
    if (actionToPerform && currentTime && userLocation && userTimezone && ubicacionDetectada) {
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
          actionToPerform,
          dateInTimezone,
          timeInTimezone,
          ubicacionDetectada.id,
          latitude,
          longitude,
          accuracy,
          descriptor,
          turnoAsignado?.entrada,
          turnoAsignado?.regreso_descanso,
          turnoAsignado?.salida
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
      {userLocation ? (
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border ${
            ubicacionDetectada 
              ? 'bg-green-100 text-green-800 border-green-300' 
              : 'bg-orange-100 text-orange-800 border-orange-300'
          }`}>
            <MapPin className="h-4 w-4" />
            {ubicacionDetectada 
              ? ubicacionDetectada.nombre_ubicacion 
              : guiaUbicacion || 'Fuera de rango'}
          </div>
        ) : (
          <div className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-gray-100 text-gray-500 border">
            <MapPin className="h-4 w-4 animate-pulse" />
            Buscando GPS...
          </div>
        )}
        <p className="text-lg text-muted-foreground">{message}</p>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 px-6 pb-6">
        {/* BOTÓN PRINCIPAL */}
        {action && (
          <ScannerBiometrico onResult={(desc) => handleBioSuccess(desc, action)}>
            <Button className="w-full text-lg py-6 bg-green-600 hover:bg-green-700 text-white" disabled={isPending || !userLocation || !userTimezone || !ubicacionDetectada} size="lg">
              <Camera className="mr-2 h-6 w-6" />
              {label}
            </Button>
          </ScannerBiometrico>
        )}

        {/* BOTÓN SECUNDARIO (Salida Anticipada) */}
        {canLeaveEarly && (
          <ScannerBiometrico onResult={(desc) => handleBioSuccess(desc, 'salida')}>
            <Button variant="destructive" className="w-full text-lg py-6" disabled={isPending || !userLocation || !userTimezone || !ubicacionDetectada} size="lg">
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
