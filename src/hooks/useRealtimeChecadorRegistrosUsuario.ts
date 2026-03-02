import { useState, useEffect } from 'react';
import { useSupabase } from '@/components/providers/SupabaseProvider'; // Ajusta la ruta a tu Provider
import type { RegistroChequeo } from '@/services/types';

export function useRealtimeChecadorRegistrosUsuario(registrosIniciales: RegistroChequeo[], userId: string) {
  const { supabase } = useSupabase();
  const [registros, setRegistros] = useState<RegistroChequeo[]>(registrosIniciales);

  // Sincroniza si cambian los props desde el servidor
  useEffect(() => {
    setRegistros(registrosIniciales);
  }, [registrosIniciales]);

  // Lógica de Supabase Realtime
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      // Le damos un nombre de canal único por usuario para evitar choques
      .channel(`realtime-checador-${userId}-${Math.random()}`) 
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'registro_checador',
          filter: `id_empleado=eq.${userId}`,
        },
        (payload: any) => {
          if (payload.eventType === 'INSERT') {
            const nuevoRegistro = payload.new as RegistroChequeo;
            setRegistros((prev) => {
              if (prev.some((r) => r.id === nuevoRegistro.id)) return prev;
              return [...prev, nuevoRegistro];
            });
          }
          if (payload.eventType === 'DELETE') {
            const idBorrado = payload.old.id;
            setRegistros((prev) => prev.filter((r) => r.id !== idBorrado));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, userId]);

  // El hook simplemente devuelve el arreglo de registros actualizado
  return registros; 
}