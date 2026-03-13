/*'use client';

import { useState, useTransition, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useToast } from '@/hooks/use-toast';
import { guardarUbicacion } from '@/app/(roles)/administracion/configuraciones/actions';

// Defino un tipo para la configuración de la ubicación
export type UbicacionConfig = {
  id?: number;
  nombre_ubicacion: string;
  latitud: number;
  longitud: number;
  radio_permitido: number;
};

interface UbicacionesTabProps {
  // Puede recibir una ubicación para editarla, o ser nulo para crear una nueva
  ubicacionInicial?: UbicacionConfig | null;
  // Función para notificar al padre que la edición ha terminado
  onFinished: () => void;
}

// Carga dinámica del mapa para evitar problemas de SSR
const MapaEdicion = dynamic(() => import('@/components/page_components/configuracion_Admin/MapaEdicion'), { 
  ssr: false, 
  loading: () => <div className="h-[400px] w-full bg-gray-200 animate-pulse rounded-md"></div> 
});

const DEFAULT_LOCATION = {
  nombre_ubicacion: 'Zócalo, CDMX',
  latitud: 19.432608, // Zócalo, CDMX
  longitud: -99.133209,
  radio_permitido: 100
};

export function UbicacionesTab({ ubicacionInicial, onFinished }: UbicacionesTabProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  // Estado interno del formulario
  const [nombreUbicacion, setNombreUbicacion] = useState(ubicacionInicial?.nombre_ubicacion ?? DEFAULT_LOCATION.nombre_ubicacion);
  const [position, setPosition] = useState<[number, number]>(
    [ubicacionInicial?.latitud ?? DEFAULT_LOCATION.latitud, ubicacionInicial?.longitud ?? DEFAULT_LOCATION.longitud]
  );
  const [radius, setRadius] = useState(ubicacionInicial?.radio_permitido ?? DEFAULT_LOCATION.radio_permitido);

  const handleSave = () => {
    if (!nombreUbicacion) {
        toast({ title: "Error", description: "El nombre de la ubicación es obligatorio.", variant: "destructive" });
        return;
    }
    startTransition(async () => {
      const result = await guardarUbicacion({
        id: ubicacionInicial?.id, // Pasa el ID si estamos editando
        nombre_ubicacion: nombreUbicacion,
        latitud: position[0],
        longitud: position[1],
        radio_permitido: radius,
      });

      toast({
        title: result.success ? "Éxito" : "Error",
        description: result.message,
        variant: result.success ? "default" : "destructive",
      });

      if(result.success) {
        onFinished(); // Regresa a la lista si fue exitoso
      }
    });
  };

  return (
    <div className="space-y-6 pt-4">
      <div className="space-y-4">
        <div className="space-y-2">
            <Label htmlFor="nombre-ubicacion">Nombre de la Ubicación</Label>
            <Input 
                id="nombre-ubicacion" 
                value={nombreUbicacion}
                onChange={(e) => setNombreUbicacion(e.target.value)}
                placeholder="Ej. Oficina Central"
                disabled={isPending}
            />
        </div>

        <MapaEdicion 
          position={position} 
          radius={radius} 
          onPositionChange={setPosition} 
        />
        
        <div className="space-y-2">
          <Label htmlFor="radius-slider">Radio del área ({radius} metros)</Label>
          <Slider
            id="radius-slider"
            min={30}
            max={100}
            step={10}
            value={[radius]}
            onValueChange={(value) => setRadius(value[0])}
            disabled={isPending}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onFinished} disabled={isPending}>Cancelar</Button>
        <Button onClick={handleSave} disabled={isPending}>
            {isPending ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </div>
    </div>
  );
}
*/
'use client';

import { useState, useTransition } from 'react';
import dynamic from 'next/dynamic';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { toast } from 'sonner'; // <-- IMPORTAMOS SONNER
import { guardarUbicacion } from '@/app/(roles)/administracion/configuraciones/actions';

// Defino un tipo para la configuración de la ubicación
export type UbicacionConfig = {
  id?: number;
  nombre_ubicacion: string;
  latitud: number;
  longitud: number;
  radio_permitido: number;
};

interface UbicacionesTabProps {
  ubicacionInicial?: UbicacionConfig | null;
  onFinished: () => void;
}

// Carga dinámica del mapa para evitar problemas de SSR
const MapaEdicion = dynamic(() => import('@/components/page_components/configuracion_Admin/MapaEdicion'), { 
  ssr: false, 
  loading: () => <div className="h-[400px] w-full bg-gray-200 animate-pulse rounded-md"></div> 
});

const DEFAULT_LOCATION = {
  nombre_ubicacion: 'Zócalo, CDMX',
  latitud: 19.432608,
  longitud: -99.133209,
  radio_permitido: 100
};

export function UbicacionesTab({ ubicacionInicial, onFinished }: UbicacionesTabProps) {
  const [isPending, startTransition] = useTransition();

  // Estado interno del formulario
  const [nombreUbicacion, setNombreUbicacion] = useState(ubicacionInicial?.nombre_ubicacion ?? DEFAULT_LOCATION.nombre_ubicacion);
  const [position, setPosition] = useState<[number, number]>(
    [ubicacionInicial?.latitud ?? DEFAULT_LOCATION.latitud, ubicacionInicial?.longitud ?? DEFAULT_LOCATION.longitud]
  );
  const [radius, setRadius] = useState(ubicacionInicial?.radio_permitido ?? DEFAULT_LOCATION.radio_permitido);

  const handleSave = () => {
    if (!nombreUbicacion) {
        // SONNER: Error de validación
        toast.error("Error",
          { description: "El nombre de la ubicación es obligatorio.",
          position: "top-center"
         });
        return;
    }
    
    startTransition(async () => {
      const result = await guardarUbicacion({
        id: ubicacionInicial?.id,
        nombre_ubicacion: nombreUbicacion,
        latitud: position[0],
        longitud: position[1],
        radio_permitido: radius,
      });

      // SONNER: Evaluación del resultado del servidor
      if (result.success) {
        toast.success("Éxito", { description: result.message,
          position: "top-center" });
        onFinished();
      } else {
        toast.error("Error", { description: result.message,
          position: "top-center" });
      }
    });
  };

  return (
    <div className="space-y-6 pt-4">
      <div className="space-y-4">
        <div className="space-y-2">
            <Label htmlFor="nombre-ubicacion">Nombre de la Ubicación</Label>
            <Input 
                id="nombre-ubicacion" 
                value={nombreUbicacion}
                onChange={(e) => setNombreUbicacion(e.target.value)}
                placeholder="Ej. Oficina Central"
                disabled={isPending}
            />
        </div>

        <MapaEdicion 
          position={position} 
          radius={radius} 
          onPositionChange={setPosition} 
        />
        
        <div className="space-y-2">
          <Label htmlFor="radius-slider">Radio del área ({radius} metros)</Label>
          <Slider
            id="radius-slider"
            min={30}
            max={100}
            step={10}
            value={[radius]}
            onValueChange={(value) => setRadius(value[0])}
            disabled={isPending}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onFinished} disabled={isPending}>Cancelar</Button>
        <Button onClick={handleSave} disabled={isPending}>
            {isPending ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </div>
    </div>
  );
}