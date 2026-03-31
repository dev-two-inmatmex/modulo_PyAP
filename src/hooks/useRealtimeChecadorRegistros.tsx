'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/components/providers/SupabaseProviderClient';
import { toast } from 'sonner';
import { useNombreEmpleado } from '@/components/providers/NombreEmpleadoProvider';
import { UserAvatar } from '@/components/reutilizables/UserAvatar';
export function RealtimeAsistencias() {
  const { supabase } = useSupabase();
  const router = useRouter();
  const { getNombreEmpleadoPorId: getEmployeeById } = useNombreEmpleado();

  useEffect(() => {
    const channel = supabase
      .channel(`cambios-asistencias-${Math.random()}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'registro_checador',
          filter: 'tipo_registro=eq.entrada'
        },
        (payload) => {
          router.refresh();
          const empleado = getEmployeeById(payload.new.id_empleado);
          if (empleado) {
            toast(
              <div className="flex items-center gap-2">
                <UserAvatar employeeId={empleado.id} name={empleado.nombre_corto} />
                <span className='font-semibold'>{`${empleado.nombre_corto} acaba de llegar.`}</span>
              </div>
            );
          } else {
            toast.info(`Nuevo registro de entrada`);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, router, getEmployeeById]);

  return null; 
}


export function RealtimeSalidas() {
  const { supabase } = useSupabase();
  const router = useRouter();
  const { getNombreEmpleadoPorId: getEmployeeById } = useNombreEmpleado();

  useEffect(() => {
    const channel = supabase
      .channel(`cambios-salidas-${Math.random()}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT', 
          schema: 'public',
          table: 'registro_checador',
          filter: 'tipo_registro=eq.salida'
        },
        (payload) => {
          router.refresh();
          const empleado = getEmployeeById(payload.new.id_empleado);
          /*toast.success('Éxito', { description: "un empleado acaba de llegar",
            position: "top-center", style: {background: 'green',}});*/
          if (empleado) {
            toast(
              <div className="flex items-center gap-2">
                <UserAvatar employeeId={empleado.id} name={empleado.nombre_corto} />
                <span className='font-semibold'>{`${empleado.nombre_corto} acaba de salir.`}</span>
              </div>
            );
          } else {
            toast.info(`Nuevo registro de salida`);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, router, getEmployeeById]);

  return null; 
}