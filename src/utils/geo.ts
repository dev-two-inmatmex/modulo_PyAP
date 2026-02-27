/**
 * Calcula la distancia en metros entre dos coordenadas.
 */
export const calcularDistanciaMetros = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371000; // Radio de la Tierra en metros
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
      
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

/**
 * Compara dos descriptores faciales y devuelve true si son similares.
 */
export const verifyFace = (descriptor1: number[], descriptor2: number[]): boolean => {
    if (descriptor1.length !== descriptor2.length) {
        return false;
    }

    const dotProduct = descriptor1.reduce((acc, val, i) => acc + val * descriptor2[i], 0);
    const magnitude1 = Math.sqrt(descriptor1.reduce((acc, val) => acc + val * val, 0));
    const magnitude2 = Math.sqrt(descriptor2.reduce((acc, val) => acc + val * val, 0));

    const similarity = dotProduct / (magnitude1 * magnitude2);

    // El umbral de similitud puede variar dependiendo de la librería de reconocimiento facial
    return similarity > 0.9;
};