import { MapPin } from 'lucide-react';

interface Props {
    ubicacionDetectada?: string;
    guiaUbicacion?: string | null;
    buscando: boolean;
}

export function IndicadorUbicacion({ ubicacionDetectada, guiaUbicacion, buscando }: Props) {
    if (buscando) {
      return (
        <div className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-gray-100 text-gray-500 border">
          <MapPin className="h-4 w-4 animate-pulse" />
          Buscando GPS...
        </div>
      );
    }
  
    return (
      <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border ${
        ubicacionDetectada 
          ? 'bg-green-100 text-green-800 border-green-300' 
          : 'bg-orange-100 text-orange-800 border-orange-300'
      }`}>
        <MapPin className="h-4 w-4" />
        {ubicacionDetectada || guiaUbicacion || 'Fuera de rango'}
      </div>
    );
  }