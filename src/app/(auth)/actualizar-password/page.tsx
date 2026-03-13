/*'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useActionState, useEffect } from 'react';
import { updatePassword } from './actions';
import { useToast } from '@/hooks/use-toast';

const UpdatePasswordSchema = z
  .object({
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres.'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden.',
    path: ['confirmPassword'],
  });

export default function UpdatePasswordPage() {
  const { toast } = useToast();
  const [state, formAction] = useActionState(updatePassword, null);

  const form = useForm<z.infer<typeof UpdatePasswordSchema>>({
    resolver: zodResolver(UpdatePasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    if (state?.message) {
      toast({
        title: 'Actualización de Contraseña',
        description: state.message,
      });
    }
  }, [state, toast]);

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle>Actualizar Contraseña</CardTitle>
          <CardDescription>
            Ingresa tu nueva contraseña y confírmala para actualizarla.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form action={formAction} className='space-y-4'>
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nueva Contraseña</FormLabel>
                    <FormControl>
                      <Input
                        type='password'
                        placeholder='••••••••'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='confirmPassword'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar Nueva Contraseña</FormLabel>
                    <FormControl>
                      <Input
                        type='password'
                        placeholder='••••••••'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type='submit' className='w-full'>
                Actualizar Contraseña
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}*/
'use client';

import * as React from 'react';
import { useActionState, useEffect } from 'react';
import { updatePassword } from './actions';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function UpdatePasswordPage() {
  // Extraemos isPending de React 19
  const [state, formAction, isPending] = useActionState(updatePassword, {
    message: '',
    errors: {},
  });

  // Mostramos el toast de Sonner solo si hay un error devuelto por el servidor
  useEffect(() => {
    if (state?.message && state.message !== 'Por favor, revisa los errores en el formulario.') {
      toast.error('Error', {
        description: state.message,
      });
    }
  }, [state]);

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100 p-4'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle>Actualizar Contraseña</CardTitle>
          <CardDescription>
            Ingresa tu nueva contraseña y confírmala para actualizarla.
          </CardDescription>
        </CardHeader>
        <form action={formAction}>
          <CardContent className='space-y-4'>
            {/* Alerta general de errores del servidor (Supabase) */}
            {state?.message && (!state.errors || Object.keys(state.errors).length === 0) && (
              <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{state.message}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">Nueva Contraseña</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                disabled={isPending}
              />
              {/* Mensaje de error de Zod para la contraseña */}
              {state?.errors?.password && (
                <p className="text-sm font-medium text-destructive">
                  {state.errors.password[0]}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                required
                disabled={isPending}
              />
              {/* Mensaje de error de Zod para la confirmación */}
              {state?.errors?.confirmPassword && (
                <p className="text-sm font-medium text-destructive">
                  {state.errors.confirmPassword[0]}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button type='submit' className='w-full' disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Actualizando...
                </>
              ) : (
                'Actualizar Contraseña'
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
