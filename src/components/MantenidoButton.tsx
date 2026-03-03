import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Timer } from 'lucide-react';

interface BotonMantenidoProps {
  label: string;
  onComplete: () => void;
  disabled: boolean;
  segundos?: number; // Lo dejamos configurable por si 5s se siente muy largo después
}

export function BotonMantenido({ label, onComplete, disabled, segundos = 5 }: BotonMantenidoProps) {
  const [progreso, setProgreso] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const iniciarPresion = () => {
    if (disabled) return;
    
    setProgreso(0);
    const tiempoTotalMs = segundos * 1000;
    const intervaloMs = 100; // Actualizamos la barra cada 100ms para que se vea fluido
    const avancePorIntervalo = 100 / (tiempoTotalMs / intervaloMs);

    intervalRef.current = setInterval(() => {
      setProgreso((prev) => {
        if (prev >= 100) return 100;
        return prev + avancePorIntervalo;
      });
    }, intervaloMs);

    timerRef.current = setTimeout(() => {
      cancelarPresion(); // Limpiamos los timers
      setProgreso(100);
      onComplete(); // ¡Ejecutamos el chequeo!
    }, tiempoTotalMs);
  };

  const cancelarPresion = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setProgreso(0); // Reiniciamos la barra si soltó el dedo antes de tiempo
  };

  return (
    <Button
      className="w-full text-lg py-6 relative overflow-hidden bg-blue-600 hover:bg-blue-700 text-white select-none transition-colors"
      disabled={disabled}
      // Cubrimos tanto clics de mouse (PC) como toques de pantalla (Celular)
      onMouseDown={iniciarPresion}
      onMouseUp={cancelarPresion}
      onMouseLeave={cancelarPresion}
      onTouchStart={iniciarPresion}
      onTouchEnd={cancelarPresion}
      size="lg"
    >
      {/* Esta es la barra de progreso oscura que va llenando el botón */}
      <div
        className="absolute left-0 top-0 bottom-0 bg-blue-800 transition-all duration-100 ease-linear"
        style={{ width: `${progreso}%` }}
      />
      
      {/* El texto y el ícono van por encima (z-10) */}
      <span className="relative z-10 flex items-center justify-center">
        <Timer className="mr-2 h-6 w-6" />
        {progreso > 0 && progreso < 100 ? 'Mantén presionado...' : label}
      </span>
    </Button>
  );
}