'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/components/providers/SupabaseProviderClient';
import { toast } from 'sonner';
import { useNombreEmpleado } from '@/components/providers/NombreEmpleadoProvider';
import { UserAvatar } from '@/components/reutilizables/UserAvatar';

export function RealtimeInasistencias() {
    const { supabase } = useSupabase();
    const { session } = useSupabase();
    const user = session?.user;
    const router = useRouter();
    const { getNombreEmpleadoPorId: getEmployeeById } = useNombreEmpleado();
    useEffect(() => {
        const channel = supabase
            .channel(`cambios-inasistencias-${Math.random()}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'registro_inasistencias_confirmadas',
                },
                (payload) => {
                    console.log(payload);
                    router.refresh();
                    const empleado = getEmployeeById(payload.new.id_empleado);
                    const capturo = getEmployeeById(payload.new.capturo);
                    console.log(capturo);
                    if (capturo?.id !== user?.id) {
                        if (empleado && capturo) {
                            toast(
                                <div className="flex items-center gap-2" >
                                    <UserAvatar employeeId={capturo.id} name={capturo.nombre_corto} />
                                    <span className='font-semibold' > {`${capturo.nombre_corto} confirmo la inasistencia de `} </span>
                                    <UserAvatar employeeId={empleado.id} name={empleado.nombre_corto} />
                                    <span className='font-semibold' > {`${empleado.nombre_corto}.`} </span>
                                </div>, {
                                position: "top-center",
                            }
                            );
                        } else {
                            toast.info(`Nueva confirmacion de inasistencia`);
                        }
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
