'use client';

import { useState, useEffect, useTransition } from 'react';
import { useFormStatus } from 'react-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { registrarChequeo } from '@/app/(shared)/checador/actions';
import type { TurnoUsuario, Horario } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

const formatTime = (date: Date) => {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

const formatDate = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
  const formatted = new Intl.DateTimeFormat('es-ES', options).format(date);
  return `Hoy, ${formatted.charAt(0).toUpperCase() + formatted.slice(1)}`;
};

function SubmitButton({ label, disabled }: { label: string, disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full text-lg py-6 bg-green-600 hover:bg-green-700 text-white" disabled={pending || disabled} size="lg">
      {pending ? 'Registrando...' : label}
    </Button>
  );
}

export function ChecadorReloj({ latestTurno, turno }: { latestTurno: TurnoUsuario | null, turno: Horario | null }) {
  const [time, setTime] = useState<Date | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    // This effect runs only on the client, after hydration, preventing a mismatch.
    setTime(new Date());
    const timerId = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  const getChequeoState = () => {
    if (!latestTurno?.entrada) {
      return { action: 'entrada' as const, label: 'Entrada', message: 'No has checado entrada' };
    }
    if (!latestTurno?.salida_descanso) {
      return { action: 'salida_descanso' as const, label: 'Salida a Descanso', message: 'Turno iniciado' };
    }
    if (!latestTurno?.regreso_descanso) {
      return { action: 'regreso_descanso' as const, label: 'Regreso de Descanso', message: 'En descanso' };
    }
    if (!latestTurno?.salida) {
      return { action: 'salida' as const, label: 'Salida', message: 'Turno reanudado' };
    }
    return { action: null, label: 'Turno Terminado', message: 'Has completado tu turno de hoy' };
  };

  const { action, label, message } = getChequeoState();

  const formatHorario = (timeStr: string | undefined) => {
    if (!timeStr) return '';
    const [h, m] = timeStr.split(':');
    const date = new Date();
    date.setHours(parseInt(h), parseInt(m), 0);
    return formatTime(date);
  };
  
  const handleAction = async () => {
      if (action) {
          startTransition(async () => {
              const result = await registrarChequeo(action);
              if (result?.error) {
                  toast({ title: 'Error', description: result.error, variant: 'destructive' })
              }
          })
      }
  }

  return (
    <Card className="w-full max-w-sm mx-auto shadow-lg border-2">
      <CardHeader className="text-center pb-2">
        <CardDescription className="text-lg text-foreground/80">{time ? formatDate(time) : 'Cargando...'}</CardDescription>
        <CardTitle className="text-7xl font-bold tracking-tighter text-green-700">
          {time ? (
            <>
              {formatTime(time).split(' ')[0]}
              <span className="text-4xl font-medium ml-2">{formatTime(time).split(' ')[1]}</span>
            </>
          ) : (
            '--:--'
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-lg text-muted-foreground">{message}</p>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 px-6 pb-6">
        <form action={handleAction} className="w-full">
            <SubmitButton label={label} disabled={!action || isPending} />
        </form>
        {turno && (
            <p className="text-sm text-muted-foreground">
                Recuerda: Horario de {formatHorario(turno.horario_entrada)} a {formatHorario(turno.horario_salida)}
            </p>
        )}
      </CardFooter>
    </Card>
  );
}
