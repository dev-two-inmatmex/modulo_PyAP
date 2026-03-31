'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/components/providers/SupabaseProviderClient';

/**
 * Hook que escucha cambios en la tabla 'empleados'
 * y ejecuta router.refresh() para forzar una re-sincronización de los datos
 * en los Server Components y re-renderizar los Client Components.
 */
export const useRealtimeEmpleados = () => {
    const { supabase } = useSupabase();
    const router = useRouter();

    useEffect(() => {
        const channel = supabase
            .channel('empleados')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'empleados'
                },
                (payload) => {
                    console.log('Cambio detectado en la tabla "empleados", refrescando la ruta...', payload.eventType);
                    router.refresh();
                }
            )
            .subscribe();
        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase, router]);
};