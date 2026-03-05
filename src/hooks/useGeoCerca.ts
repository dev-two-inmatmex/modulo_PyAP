import { useState, useEffect, useCallback } from 'react';
import { ConfigUbicacion } from '@/services/types';
import { calcularDistanciaMetros, calcularRumbo } from '@/utils/geo';
import { useToast } from '@/hooks/use-toast';

export function useGeocerca(ubicacionesValidas: ConfigUbicacion[]) {
  const [userLocation, setUserLocation] = useState<any | null>(null);
  const [ubicacionDetectada, setUbicacionDetectada] = useState<ConfigUbicacion | null>(null);
  const [guiaUbicacion, setGuiaUbicacion] = useState<string | null>(null);
  const [errorGps, setErrorGps] = useState<string | null>(null);
  const [intento, setIntento] = useState(0);
  const { toast } = useToast();

  // NUEVO: Función que podemos llamar desde el botón
  const reintentarGps = useCallback(() => {
    setErrorGps(null);
    setGuiaUbicacion(null);
    setIntento(prev => prev + 1); // Al cambiar este número, el useEffect de abajo se reinicia
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        reintentarGps();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [reintentarGps]);

  useEffect(() => {
    let intervalo: NodeJS.Timeout;

    // Si tenemos un error de GPS (ej. está apagado), iniciamos un temporizador
    if (errorGps) {
        intervalo = setInterval(() => {
            console.log("Buscando señal GPS en segundo plano...");
            reintentarGps(); // Forzamos el reinicio del watchPosition
        }, 5000); // 5000 milisegundos = 5 segundos
    }

    // Limpieza: Si el GPS ya se conectó (errorGps es null) o el componente se desmonta, apagamos el temporizador
    return () => {
        if (intervalo) clearInterval(intervalo);
    };
}, [errorGps, reintentarGps]);

  useEffect(() => {
    // 1. Verificamos que el navegador/celular soporte GPS
    if (!navigator.geolocation) {
      console.error("El navegador no soporta geolocalización");
      return;
    }

    // 2. Configuramos el GPS en "Modo Deportivo" (Alto rendimiento)
    const opcionesGPS = {
      enableHighAccuracy: true, // Fuerza a encender el chip GPS (usa más batería, pero es exacto)
      timeout: 5000,           // Le damos 10 segundos para responder antes de lanzar error
      maximumAge: 0             // 0 = No uses ubicaciones guardadas en caché, dame la real AHORA
    };

    // 3. watchPosition se queda "escuchando" cada vez que el usuario da un paso
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setErrorGps(null);
        // Cada vez que el celular detecta movimiento, actualiza tu estado al instante
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (error) => {
        console.error("Error obteniendo la ubicación:", error.message);
        setUserLocation(null);
        setUbicacionDetectada(null);
        setGuiaUbicacion(null);

        let mensajeAmigable = "Error desconocido de GPS.";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            mensajeAmigable = "Permiso denegado. Autoriza el GPS en tu navegador o enciende tu ubicación.";
            break;
          case error.POSITION_UNAVAILABLE:
            mensajeAmigable = "Señal GPS no disponible o apagada. Enciende tu ubicación.";
            break;
          case error.TIMEOUT:
            mensajeAmigable = "Tiempo de espera agotado buscando señal.";
            break;
        }

        setErrorGps(mensajeAmigable);

        // Opcional: También puedes mostrar el toast aquí
        toast({ title: 'Atención', description: mensajeAmigable, variant: 'destructive' });
      },
      opcionesGPS
    );
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [intento]);

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
          //break;
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

  return {
    userLocation,
    ubicacionDetectada,
    guiaUbicacion,
    errorGps,
    estaEnRango: !!ubicacionDetectada,
    reintentarGps,
  };
}