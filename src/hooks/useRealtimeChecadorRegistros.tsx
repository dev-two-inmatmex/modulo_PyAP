'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/components/providers/SupabaseProviderClient';
import { toast } from 'sonner';
import { useNombreEmpleado } from '@/components/providers/NombreEmpleadoProvider';
import { usePathname } from 'next/navigation';
import { UserAvatar } from '@/components/reutilizables/UserAvatar';
export function RealtimeAsistencias() {
  const pathname = usePathname();
  const { supabase, session } = useSupabase();
  const user = session?.user;
  const router = useRouter();
  const { getNombreEmpleadoPorId: getEmployeeById } = useNombreEmpleado();

  useEffect(() => {
    const channel = supabase
      .channel('cambios_checador')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'registro_checador',
        },
        (payload) => {

          const { tipo_registro, id_empleado } = payload.new;
          const empleado = getEmployeeById(id_empleado);
          const nombre = empleado?.nombre_corto || 'Alguien';

          let mensaje = '';
          if (id_empleado !== user?.id) {
            switch (tipo_registro) {
              case 'entrada':
                mensaje = 'acaba de llegar';
                break;
              case 'salida':
                mensaje = 'acaba de salir';
                break;
              case 'salida_descanso':
                mensaje = 'salió a su descanso';
                break;
              case 'regreso_descanso':
                mensaje = 'regresó de su descanso';
                break;
              default:
                mensaje = 'realizó un registro';
            }
            if (pathname === '/rh/asistencias') {
              router.refresh();
              toast(
                <div className="flex items-center gap-2">
                  <UserAvatar employeeId={id_empleado} name={nombre} />
                  <span className='font-semibold'>{`${nombre} ${mensaje}.`}</span>
                </div>
              );
            }
          } else {
            router.refresh();
            switch (tipo_registro) {
              case 'entrada':
                mensaje = 'se registró tu entrada';
                break;
              case 'salida':
                mensaje = 'se registro tu salida';
                break;
              case 'salida_descanso':
                mensaje = 'se registro tu salida a su descanso';
                break;
              case 'regreso_descanso':
                mensaje = 'se registro tu regreso de descanso';
                break;
              default:
                mensaje = 'realizó un registro';
            }

            toast(

              <div className="flex items-center gap-2">
                <UserAvatar employeeId={id_empleado} name={nombre} />
                <span className='font-semibold'>{`${nombre} ${mensaje}.`}</span>
              </div>
            )
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