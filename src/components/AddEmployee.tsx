'use client'

import React, { useState, useEffect, useRef } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { addUser } from '@/app/(roles)/rh/empleados/actions';
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const UserSchema = z.object({
  nombres: z.string().min(1, "Nombres es requerido"),
  a_paterno: z.string().min(1, "Apellido Paterno es requerido"),
  a_materno: z.string().min(1, "Apellido Materno es requerido"),
  fecha_nacimiento: z.string().min(1, "Fecha de nacimiento es requerida"),
  fecha_ingreso: z.string().min(1, "Fecha de ingreso es requerida"),
  sexo: z.enum(['true', 'false'], { required_error: 'Sexo es requerido.' }),
  direccion: z.string().min(1, "Dirección es requerida"),
  telefono1: z.string().min(10, "Teléfono principal debe tener 10 dígitos"),
  telefono2: z.string().min(10, "Teléfono de emergencia debe tener 10 dígitos").optional().or(z.literal('')),
  propietario_telefono2: z.string().optional(),
  email: z.string().email("Email inválido").optional(),
  id_puesto: z.string().min(1, "Puesto es requerido"),
  id_ubicacion: z.string().min(1, "Ubicación es requerida"),
  id_ext_horario: z.string().min(1, "Horario es requerido"),
  id_ext_descanso: z.string().min(1, "Descanso es requerido"),
  id_estatus: z.string().min(1, "Estatus es requerido"),
}).refine(data => {
    // Si hay un teléfono de emergencia, el propietario es requerido.
    if (data.telefono2 && !data.propietario_telefono2) {
        return false;
    }
    return true;
}, {
    message: "Debe especificar el propietario del teléfono de emergencia",
    path: ["propietario_telefono2"],
});

type UserFormValues = z.infer<typeof UserSchema>;

type Horario = { id: number; hora_entrada: string; hora_salida: string; };
type Descanso = { id: number; inicio_descanso: string; fin_descanso: string; };
type Puesto = { id: number; nombre_puesto: string; };
type Ubicacion = { id: number; nombre_ubicacion: string; };
type Estatus = { id: number; nombre_estatus: string; };

interface AddUserProps {
  horarios: Horario[];
  descansos: Descanso[];
  puestos: Puesto[];
  ubicaciones: Ubicacion[];
  estatuses: Estatus[];
  n_empleados: string;
}


interface ActionState {
  message: string;
}

const removeAccents = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export function AddEmployee({ horarios, descansos, puestos, ubicaciones, estatuses, n_empleados }: AddUserProps ) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction] = React.useActionState<ActionState, FormData>(addUser, { message: '' });

  const form = useForm<UserFormValues>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      nombres: '',
      a_paterno: '',
      a_materno: '',
      email: '',
      direccion: '',
      telefono1: '',
      telefono2: '',
      propietario_telefono2: '',
      fecha_nacimiento: '',
      fecha_ingreso: '',
      id_ext_horario: '',
      id_ext_descanso: '',
      id_puesto: '',
      id_ubicacion: '',
      id_estatus: '',
    },
  });

  const { formState: { isSubmitting }, watch, setValue } = form;
  const nombresValue = watch('nombres');

  useEffect(() => {
    if (nombresValue) {
      const primerNombre = nombresValue.split(' ')[0];
      const normalizedNombre = removeAccents(primerNombre).toLowerCase();
      const generatedEmail = `${normalizedNombre}${n_empleados}@inmatmex.com.mx`;
      setValue('email', generatedEmail, { shouldValidate: true });
    }
  }, [nombresValue, n_empleados, setValue]);

  const handleFormSubmit = () => {
    if (formRef.current) {
      const formData = new FormData(formRef.current);
      formAction(formData);
    }
  };

  useEffect(() => {
    if (state.message) {
        const isError = /error|inválido/i.test(state.message);
        if (isError) {
            toast({ variant: 'destructive', title: 'Error', description: state.message });
            
        } else {
            toast({ title: 'Éxito', description: state.message });
            setOpen(false);
            form.reset();
        }
    }
}, [state, form, toast, setOpen]);


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className='bg-green-600 hover:bg-green-700 text-white'>Agregar Empleado</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Empleado</DialogTitle>
          <DialogDescription>
            Complete el formulario para registrar un nuevo empleado en el sistema.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            ref={formRef}
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <FormField control={form.control} name="nombres" render={({ field }) => (<FormItem><FormLabel>Nombres</FormLabel><FormControl><Input placeholder="Juan" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="a_paterno" render={({ field }) => (<FormItem><FormLabel>Apellido Paterno</FormLabel><FormControl><Input placeholder="Pérez" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="a_materno" render={({ field }) => (<FormItem><FormLabel>Apellido Materno</FormLabel><FormControl><Input placeholder="García" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="fecha_nacimiento" render={({ field }) => (<FormItem><FormLabel>Fecha de Nacimiento</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="fecha_ingreso" render={({ field }) => (<FormItem><FormLabel>Fecha de Ingreso</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="sexo" render={({ field }) => (<FormItem><FormLabel>Sexo</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Seleccione el sexo" /></SelectTrigger></FormControl><SelectContent><SelectItem value="true">Masculino</SelectItem><SelectItem value="false">Femenino</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="direccion" render={({ field }) => (<FormItem><FormLabel>Dirección</FormLabel><FormControl><Input placeholder="Calle Falsa 123" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="telefono1" render={({ field }) => (<FormItem><FormLabel>Teléfono Principal</FormLabel><FormControl><Input placeholder="5512345678" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormItem>
              <FormLabel>Propietario Tel. Principal</FormLabel>
              <FormControl>
                <Input value="Propio" disabled />
              </FormControl>
            </FormItem>
            <FormField control={form.control} name="telefono2" render={({ field }) => (<FormItem><FormLabel>Teléfono de Emergencia</FormLabel><FormControl><Input placeholder="5587654321" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="propietario_telefono2" render={({ field }) => (<FormItem><FormLabel>Propietario Tel. Emergencia</FormLabel><FormControl><Input placeholder="Ej: Esposa, Madre" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email@generado.com" {...field} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField control={form.control} name="id_puesto" render={({ field }) => (<FormItem><FormLabel>Puesto</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Seleccione un puesto" /></SelectTrigger></FormControl><SelectContent>{puestos.map((puesto) => (<SelectItem key={puesto.id} value={String(puesto.id)}>{puesto.nombre_puesto}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="id_ubicacion" render={({ field }) => (<FormItem><FormLabel>Ubicación de Trabajo</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Seleccione una ubicación" /></SelectTrigger></FormControl><SelectContent>{ubicaciones.map((ubicacion) => (<SelectItem key={ubicacion.id} value={String(ubicacion.id)}>{ubicacion.nombre_ubicacion}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="id_ext_horario" render={({ field }) => (<FormItem><FormLabel>Horario</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Seleccione un horario" /></SelectTrigger></FormControl><SelectContent>{horarios.map((horario) => (<SelectItem key={horario.id} value={String(horario.id)}>{`${horario.hora_entrada.slice(0, 5)} - ${horario.hora_salida.slice(0, 5)}`}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="id_ext_descanso" render={({ field }) => (<FormItem><FormLabel>Descanso</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Seleccione un descanso" /></SelectTrigger></FormControl><SelectContent>{descansos.map((descanso) => (<SelectItem key={descanso.id} value={String(descanso.id)}>{`${descanso.inicio_descanso.slice(0, 5)} - ${descanso.fin_descanso.slice(0, 5)}`}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="id_estatus" render={({ field }) => (<FormItem><FormLabel>Estatus</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Seleccione un estatus" /></SelectTrigger></FormControl><SelectContent>{estatuses.map((estatus) => (<SelectItem key={estatus.id} value={String(estatus.id)}>{estatus.nombre_estatus}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />

            <DialogFooter className="md:col-span-3">
              <DialogClose asChild>
                <Button type="button" variant="secondary">Cancelar</Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Guardando...' : 'Guardar Empleado'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
