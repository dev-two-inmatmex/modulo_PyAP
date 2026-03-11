'use client';

import { useState, useEffect } from 'react';

export default function RelojAsistencia() {
  const [time, setTime] = useState(new Date());
  // 1. Agregamos un estado para saber si ya estamos en el navegador
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // 2. Al ejecutarse useEffect, sabemos con certeza que estamos en el cliente
    setMounted(true);
    
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // 3. Si aún no estamos en el cliente (es decir, en el servidor), 
  // mostramos un texto genérico o vacío para que coincida perfectamente.
  if (!mounted) {
    return (
      <div className="text-5xl font-bold text-gray-800 dark:text-white">
        --:--:--
      </div>
    );
  }

  // 4. Una vez montado, mostramos la hora real sin problemas de hidratación
  return (
    <div className="text-5xl font-bold text-gray-800 dark:text-white">
      {time.toLocaleTimeString('es-MX')}
    </div>
  );
}