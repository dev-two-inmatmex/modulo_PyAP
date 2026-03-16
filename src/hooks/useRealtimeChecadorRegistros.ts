// src/hooks/useRealtimeAsistencia.ts
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/components/providers/SupabaseProviderClient';
import { toast } from 'sonner';

export function RealtimeAsistencias() {
  const { supabase } = useSupabase();
  const router = useRouter();

  useEffect(() => {
    // Nos suscribimos a los cambios de la tabla base
    const channel = supabase
      .channel(`cambios-asistencias-${Math.random()}`)
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', // 1. Solo escuchamos cuando se CREA un registro nuevo
          schema: 'public', 
          table: 'registro_checador', // <-- PON AQUÍ EL NOMBRE DE TU TABLA BASE
          filter: 'tipo_registro=eq.entrada'
        },
        () => {
          // Cuando alguien checa, forzamos a Next.js a re-ejecutar el page.tsx (Server)
          router.refresh();
          toast.success('Éxito', { description: "un empleado acaba de llegar",
            position: "top-center", style: {background: 'green',}});
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, router]);

  return null; // Este componente no renderiza nada visualmente
}