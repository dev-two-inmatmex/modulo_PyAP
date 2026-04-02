import { useState, useEffect } from 'react';

export function useRealtimeReloj(userLocation?: { latitude: number; longitude: number } | null) {
    const [serverDateTime, setServerDateTime] = useState<Date | null>(null);

    const [userTimezone, setUserTimezone] = useState<string>(
        Intl.DateTimeFormat().resolvedOptions().timeZone
    );
    const [hasFetchedTz, setHasFetchedTz] = useState(false);

    useEffect(() => {
        let desfase = 0; // Guardará la diferencia de tiempo entre el servidor y el dispositivo local

        const fetchServerTime = async () => {
            try {
                const response = await fetch('/api/time');
                const data = await response.json();

                const serverTime = new Date(data.serverTime).getTime();
                const localTime = Date.now(); // Hora local exacta en este milisegundo

                // Calculamos el desfase (ej. si el server va 2 segs adelantado, desfase = 2000)
                desfase = serverTime - localTime;

                setServerDateTime(new Date(serverTime));
            } catch (error) {
                console.error('Failed to fetch server time:', error);
                desfase = 0; // Si falla la API, confiamos en la hora local del dispositivo
                setServerDateTime(new Date());
            }
        };

        fetchServerTime();

        // El reloj en tiempo real
        const timerId = setInterval(() => {
            // En lugar de sumar +1000ms al valor anterior, tomamos la hora local ACTUAL 
            // y le sumamos el desfase que calculamos al principio. ¡Imposible que se atrase!
            setServerDateTime(new Date(Date.now() + desfase));
        }, 1000);

        // ¡NUEVO! Resincronizar cuando el usuario vuelve a abrir la app o desbloquea el celular
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                fetchServerTime(); // Volvemos a preguntar al servidor para estar 100% seguros
            }
        };
        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            clearInterval(timerId);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, []);

    useEffect(() => {
        if (userLocation && !hasFetchedTz) {
            const fetchTimezone = async () => {
                try {
                    const { latitude, longitude } = userLocation;
                    const tzResponse = await fetch(`https://timeapi.io/api/TimeZone/coordinate?latitude=${latitude}&longitude=${longitude}`);
                    if (tzResponse.ok) {
                        const tzData = await tzResponse.json();
                        setUserTimezone(tzData.timeZone);
                    }
                } catch (e) {
                    console.warn("No se pudo obtener TZ de la API, usando default.", e);
                } finally {
                    setHasFetchedTz(true);
                }
            };
            fetchTimezone();
        }
    }, [userLocation, hasFetchedTz]);

    // 3. Formateadores Visuales (Para la UI)
    const formatClientTime = (date: Date | null) => {
        if (!date) return { horaMinutos: '--:--', segundos: '--' };
        const timeString = date.toLocaleTimeString('es-ES', {
            hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: userTimezone
        });
        const [h, m, s] = timeString.split(':');
        return { horaMinutos: `${h}:${m}`, segundos: s };
    };

    const formatClientDate = (date: Date | null) => {
        if (!date) return 'Cargando...';
        const formatted = new Intl.DateTimeFormat('es-ES', {
            weekday: 'long', day: 'numeric', month: 'long', timeZone: userTimezone
        }).format(date);
        return `Hoy, ${formatted.charAt(0).toUpperCase() + formatted.slice(1)}`;
    };

    const formatHorario = (timeStr: string | null | undefined) => {
        if (!timeStr) return '';
        const [h, m] = timeStr.split(':');
        const date = new Date();
        date.setHours(parseInt(h), parseInt(m), 0);
        return date.toLocaleTimeString('es-ES', {
            hour: '2-digit', minute: '2-digit', hour12: false, timeZone: userTimezone
        });
    };

    // 4. Formateadores para la Base de Datos (Server Actions)
    const getFormatosBD = () => {
        if (!serverDateTime) return null;
        const dateInTimezone = new Intl.DateTimeFormat('sv-SE', {
            year: 'numeric', month: '2-digit', day: '2-digit', timeZone: userTimezone,
        }).format(serverDateTime);

        const timeInTimezone = new Intl.DateTimeFormat('es-ES', {
            hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: userTimezone,
        }).format(serverDateTime);

        return { dateInTimezone, timeInTimezone };
    };

    // Pre-calculamos los valores listos para usar
    const { horaMinutos, segundos } = formatClientTime(serverDateTime);
    const fechaFormateada = formatClientDate(serverDateTime);

    return {
        serverDateTime,
        userTimezone,
        horaMinutos,
        segundos,
        fechaFormateada,
        formatHorario,
        getFormatosBD
    };
}


