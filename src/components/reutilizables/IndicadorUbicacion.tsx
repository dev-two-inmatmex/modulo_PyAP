import { AlertTriangle, MapPin, RefreshCw } from 'lucide-react';

interface Props {
  ubicacionDetectada?: string;
  guiaUbicacion?: string | null;
  buscando: boolean;
  errorGps?: string | null;
}

export function IndicadorUbicacion({ ubicacionDetectada, guiaUbicacion, buscando, errorGps }: Props) {
  if (errorGps) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-red-100 text-red-800 border border-red-300">
        <AlertTriangle className="h-4 w-4 shrink-0" />
        <span>{errorGps}</span>
        {/* NUEVO BOTÓN DE REINTENTO */}
        {/*{onRetry && (
          <button 
            onClick={onRetry} 
            className="ml-2 p-1 hover:bg-red-200 rounded-full transition-colors"
            title="Reintentar GPS"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        )}*/}
      </div>
    );
  }
  if (buscando) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-gray-100 text-gray-500 border">
        <MapPin className="h-4 w-4 animate-pulse" />
        Buscando GPS...
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border ${ubicacionDetectada
        ? 'bg-green-100 text-green-800 border-green-300'
        : 'bg-orange-100 text-orange-800 border-orange-300'
      }`}>
      <MapPin className="h-4 w-4" />
      {ubicacionDetectada || guiaUbicacion || 'Fuera de rango'}
    </div>
  );
}