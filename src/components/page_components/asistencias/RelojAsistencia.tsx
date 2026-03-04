'use client';

import { useState, useEffect } from 'react';

export function RelojAsistencia() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  return (
    <div className="text-5xl font-bold text-gray-800 dark:text-white">
      {time.toLocaleTimeString('es-MX')}
    </div>
  );
}
