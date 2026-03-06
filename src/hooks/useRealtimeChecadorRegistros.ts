// src/hooks/useRealtimeAsistencia.ts
import { useState, useEffect } from 'react';
import { useSupabase } from '@/components/providers/SupabaseProviderClient'; // Ajusta la ruta a tu Provider
import type { RegistroChequeo } from '@/services/types';

export function useRealtimeAsistencia(registrosIniciales: RegistroChequeo[]) {
  const { supabase } = useSupabase();
  const [registros, setRegistros] = useState<RegistroChequeo[]>(registrosIniciales);

  useEffect(() => {
    setRegistros(registrosIniciales);
  }, [registrosIniciales]);

  useEffect(() => {
    const channel = supabase
      // Nombre de canal global para todos los que vean este panel
      .channel('realtime-asistencia-global') 
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'registro_checador',
        },
        (payload: any) => {
          if (payload.eventType === 'INSERT') {
            const nuevoRegistro = payload.new as RegistroChequeo;
            setRegistros((prev) => {
              if (prev.some((r) => r.id === nuevoRegistro.id)) return prev;
              // Lo agregamos al principio para que los más recientes salgan arriba
              return [nuevoRegistro, ...prev]; 
            });
          }
          if (payload.eventType === 'DELETE') {
            const idBorrado = payload.old.id;
            setRegistros((prev) => prev.filter((r) => r.id !== idBorrado));
          }
          if (payload.eventType === 'UPDATE') {
             const registroActualizado = payload.new as RegistroChequeo;
             setRegistros((prev) => prev.map(r => r.id === registroActualizado.id ? registroActualizado : r));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return registros;
}