import { format } from 'date-fns-tz';

export function useHoy() {
  // Esta es ahora una función síncrona (un hook válido)
  const getFormatosBD = () => {
    const now = new Date();
    const timeZone = 'America/Mexico_City';
    
    // Usamos date-fns-tz para un formato más robusto
    const fecha = format(now, 'yyyy-MM-dd', { timeZone });
    const hora = format(now, 'HH:mm:ss', { timeZone });

    return {
      fecha,
      hora,
    };
  };

  // El hook devuelve un objeto que contiene la función para generar la fecha/hora
  return { getFormatosBD };
}
