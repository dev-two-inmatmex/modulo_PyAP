import { useState, useEffect } from 'react';
import { ConfigUbicacion } from '@/services/types';
import { calcularDistanciaMetros, calcularRumbo } from '@/utils/geo';

export function useGeocerca(ubicacionesValidas: ConfigUbicacion[]) {
    const [userLocation, setUserLocation] = useState<any | null>(null);
    const [ubicacionDetectada, setUbicacionDetectada] = useState<ConfigUbicacion | null>(null);
    const [guiaUbicacion, setGuiaUbicacion] = useState<string | null>(null);
    const [errorGps, setErrorGps] = useState<string | null>(null);

    useEffect(() => {
        // 1. Verificamos que el navegador/celular soporte GPS
        if (!navigator.geolocation) {
          console.error("El navegador no soporta geolocalización");
          return;
        }
    
        // 2. Configuramos el GPS en "Modo Deportivo" (Alto rendimiento)
        const opcionesGPS = {
          enableHighAccuracy: true, // Fuerza a encender el chip GPS (usa más batería, pero es exacto)
          timeout: 10000,           // Le damos 10 segundos para responder antes de lanzar error
          maximumAge: 0             // 0 = No uses ubicaciones guardadas en caché, dame la real AHORA
        };
    
        // 3. watchPosition se queda "escuchando" cada vez que el usuario da un paso
        const watchId = navigator.geolocation.watchPosition(
          (position) => {
            // Cada vez que el celular detecta movimiento, actualiza tu estado al instante
            setUserLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
            });
          },
          (error) => {
            console.error("Error obteniendo la ubicación:", error.message);
            // Opcional: Podrías mostrar un toast aquí si el usuario denegó el permiso
          },
          opcionesGPS
        );
        return () => {
          navigator.geolocation.clearWatch(watchId);
        };
      }, []);

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
        estaEnRango: !!ubicacionDetectada
    };
}