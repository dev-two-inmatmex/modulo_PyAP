import { useState, useEffect, useCallback } from 'react';
import { ConfigUbicacion } from '@/services/types';
import { calcularDistanciaMetros, calcularRumbo } from '@/utils/geo';


export function useGeocerca(ubicacionesValidas: ConfigUbicacion[]) {
  const [userLocation, setUserLocation] = useState<any | null>(null);
  const [ubicacionDetectada, setUbicacionDetectada] = useState<ConfigUbicacion | null>(null);
  const [guiaUbicacion, setGuiaUbicacion] = useState<string | null>(null);
  const [errorGps, setErrorGps] = useState<string | null>(null);
  const [intento, setIntento] = useState(0);
  // --- 1. UTILIDADES INTERNAS ---

  // Reinicia los estados y dispara el useEffect de geolocalización
  const reintentarGps = useCallback(() => {
    setErrorGps(null);
    setGuiaUbicacion(null);
    setIntento(prev => prev + 1);
  }, []);

  // Centralizamos el manejo de errores para limpiar estados y traducir el mensaje
  const manejarErrorGps = useCallback((error: GeolocationPositionError) => {
    //console.error("Error obteniendo la ubicación:", error.message);
    setUserLocation(null);
    setUbicacionDetectada(null);
    setGuiaUbicacion(null);

    let mensajeAmigable = "Error desconocido de GPS.";
    switch (error.code) {
      case error.PERMISSION_DENIED:
        mensajeAmigable = "Permiso de GPS denegado. Para fichar, ve a Ajustes > Safari > Ubicación y autoriza este sitio.";
        break;
      case error.POSITION_UNAVAILABLE:
        mensajeAmigable = "Señal GPS no disponible. Asegúrate de tener la ubicación activada y buena señal.";
        break;
      case error.TIMEOUT:
        mensajeAmigable = "No se pudo obtener tu ubicación a tiempo. Intenta en un lugar con mejor señal.";
        break;
    }
    setErrorGps(mensajeAmigable);
  }, []);

  // --- 2. EFECTOS DE CICLO DE VIDA ---

  // Efecto A: Reintentar al regresar a la pestaña
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') reintentarGps();
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [reintentarGps]);

  // Efecto B: Reintento en segundo plano si hay error
  useEffect(() => {
    if (!errorGps) return; // Solo hacemos polling si hay error

    const intervalo = setInterval(() => {
      console.log("Reintentando conexión GPS en segundo plano...");
      reintentarGps();
    }, 5000);

    return () => clearInterval(intervalo);
  }, [errorGps, reintentarGps]);

  // Efecto C: El "Perro Guardián" (Watchdog) para celulares
  useEffect(() => {
    const pingGps = setInterval(() => {
      if (!navigator.geolocation) return;

      navigator.geolocation.getCurrentPosition(
        () => { /* Todo bien, no hacemos nada */ },
        (error) => manejarErrorGps(error),
        { enableHighAccuracy: true, timeout: 3000, maximumAge: 0 }
      );
    }, 5000);

    return () => clearInterval(pingGps);
  }, [manejarErrorGps]);

  // --- 3. EFECTOS PRINCIPALES DE GEOLOCALIZACIÓN ---

  // El núcleo: Escuchar cambios de ubicación (watchPosition)
  useEffect(() => {
    if (!navigator.geolocation) {
      setErrorGps("El navegador no soporta geolocalización");
      return;
    }

    const opcionesGPS = { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 };

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setErrorGps(null);
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (error) => manejarErrorGps(error),
      opcionesGPS
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [intento, manejarErrorGps]);

  // Calcular la geocerca (Distancia y Guía)
  useEffect(() => {
    if (!userLocation || ubicacionesValidas.length === 0) return;

    let encontrada: ConfigUbicacion | null = null;
    let masCercana: ConfigUbicacion | null = null;
    let distanciaMinima = Infinity;

    for (const ubi of ubicacionesValidas) {
      const distancia = calcularDistanciaMetros(userLocation.latitude, userLocation.longitude, ubi.latitud, ubi.longitud);

      if (distancia <= ubi.radio_permitido) {
        encontrada = ubi;
      }

      if (distancia < distanciaMinima) {
        distanciaMinima = distancia;
        masCercana = ubi;
      }
    }

    setUbicacionDetectada(encontrada);

    if (!encontrada && masCercana) {
      const metrosFaltantes = Math.ceil(distanciaMinima - masCercana.radio_permitido);
      const direccion = calcularRumbo(
        userLocation.latitude, userLocation.longitude, masCercana.latitud, masCercana.longitud
      );
      setGuiaUbicacion(`Acércate ${metrosFaltantes}m al ${direccion} para entrar en el rango de ${masCercana.nombre_ubicacion}`);
    } else {
      setGuiaUbicacion(null);
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