'use client'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import React, { useState } from 'react';
import { useSupabase } from '@/components/providers/SupabaseProviderClient';
import { useHoy } from '@/hooks/useHoy';
import { Button } from '@/components/ui/button';
import { confirmarInasistencia } from '@/app/(roles)/rh/asistencias/actions';
import { useNombreEmpleado } from '@/components/providers/NombreEmpleadoProvider';
import { toast } from 'sonner';

interface propInasistencia {
  id_empleado: string | null | undefined;
}

export function ConfirmarInasistenciaDialog({ id_empleado }: propInasistencia) {
  const [open, setOpen] = useState(false);
  const { getFormatosBD } = useHoy();
  const { session } = useSupabase();
  const user = session?.user;
  const { getNombreEmpleadoPorId: getEmployeeById } = useNombreEmpleado();
  const empleado = id_empleado ? getEmployeeById(id_empleado) : undefined;
  const capturista = user?.id ? getEmployeeById(user.id) : undefined;
  const handleConfirmar = async () => {
    if (!id_empleado || !user?.id) {
      toast.error('Error de datos', {
        description: 'No se pudo obtener la información del empleado o del usuario.',
        position: 'top-center',
      });
      return;
    }

    const { fecha, hora } = getFormatosBD();

    const result = await confirmarInasistencia({
      id_empleado,
      capturo: user.id,
      fecha,
      hora,
    });

    if (result?.error) {
      toast.error('Error al confirmar inasistencia', {
        description: result.error,
        position: 'top-center',
      });
    } else {
      toast.success('Inasistencia confirmada', {
        description: `Se ha registrado la inasistencia para ${empleado?.nombre_corto || 'el empleado'}.`,
        position: 'top-center',
      });
      setOpen(false); // Cierra el diálogo si tiene éxito
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className=''>Confirmar Falta</Button>
      </DialogTrigger>
      <DialogContent className=''>
        <DialogHeader className=''>
          <DialogTitle>{`Confirmar inasistencia para${empleado?.nombre_corto}`}</DialogTitle>
          <DialogDescription>
            ¿Está seguro de que desea confirmar la inasistencia para {empleado?.nombre_corto}?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">Cancelar</Button>
          </DialogClose>
          <Button type="button" variant="destructive" onClick={handleConfirmar}>
            Confirmar
          </Button>

        </DialogFooter>
      </DialogContent>
    </Dialog>

  );

}