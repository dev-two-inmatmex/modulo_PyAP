/**
 * Calcula la distancia en metros entre dos coordenadas.
 */
export const calcularDistanciaMetros = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371e3; // Radio de la Tierra en metros
  const rad = Math.PI / 180;
  const dLat = (lat2 - lat1) * rad;
  const dLon = (lon2 - lon1) * rad;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * rad) * Math.cos(lat2 * rad) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const calcularRumbo = (lat1: number, lon1: number, lat2: number, lon2: number): string => {
  const rad = Math.PI / 180;
  const dLon = (lon2 - lon1) * rad;
  const lat1Rad = lat1 * rad;
  const lat2Rad = lat2 * rad;

  const y = Math.sin(dLon) * Math.cos(lat2Rad);
  const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) - Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLon);
  
  let brng = Math.atan2(y, x) * (180 / Math.PI);
  brng = (brng + 360) % 360; // Normalizar a 0-360 grados

  const rumbos = ["Norte", "Noreste", "Este", "Sureste", "Sur", "Suroeste", "Oeste", "Noroeste"];
  // Dividimos 360 grados en 8 rebanadas de 45 grados para saber qué dirección es
  const index = Math.round(brng / 45) % 8; 
  return rumbos[index];
}
