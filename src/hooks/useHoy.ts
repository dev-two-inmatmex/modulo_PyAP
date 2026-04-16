/**
 * Obtiene la fecha y hora actual en formato de base de datos.
 * @returns {Object} Un objeto con la fecha y hora en formato de base de datos.
 * @example
 * const { getFormatosBD } = useHoy();
 * const { fecha, hora } = getFormatosBD();
 * ó
 * const fecha = getFormatosBD().fecha;
 * const hora = getFormatosBD().hora;
 * const nombredeldiaES = getFormatosBD().nombredeldiaES; ideal para el nombre del dia ej.: Sábado
 * const nombredeldiaDBEs = getFormatosBD().nombredeldiaDBEs; ideal para el nombre del dia en la base de datos ej.: sabado
 */
export function useHoy() {
  const getFormatosBD = () => {
    const now = new Date();
    const timeZone = 'America/Mexico_City';
    
    // Usamos Intl.DateTimeFormat (nativo de JS) para obtener la fecha
    // El formato 'sv-SE' (Suecia) nos da convenientemente YYYY-MM-DD
    const fecha = new Intl.DateTimeFormat('sv-SE', {
        timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).format(now);

    // Hacemos lo mismo para la hora en formato 24h
    const hora = new Intl.DateTimeFormat('sv-SE', {
        timeZone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    }).format(now);

    const nombredeldiaES = new Intl.DateTimeFormat('es-MX', {
      timeZone: 'America/Mexico_City',
      weekday: 'long'
    }).format(new Date());

    const nombredeldiaDBEs = nombredeldiaES.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

    return {
      fecha,
      hora,
      nombredeldiaES,
      nombredeldiaDBEs,
    };
  };

  // El hook sigue devolviendo un objeto con la función para generar los formatos
  return { getFormatosBD };
}
