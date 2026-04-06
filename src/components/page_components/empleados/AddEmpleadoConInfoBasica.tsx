'use client'
import React, { useState, useEffect, useRef, startTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { addUserIncomplet } from '@/app/(roles)/rh/empleados/actions';
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
import { SelectField } from '@/components/reutilizables/SelectField';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';

const UserSchema = z.object({
  //DatosPersonales
  nombres: z.string().min(1, "Nombres es requerido"),
  a_paterno: z.string().min(1, "Apellido Paterno es requerido"),
  a_materno: z.string().optional(),
  fecha_nacimiento: z.string().optional(),
  sexo: z.enum(['true', 'false'], { required_error: 'Sexo es requerido.' }),

  //DatosEmpresariales
  email: z.string().email("Email inválido").optional(),
  id_ubicacion: z.string().min(1, "Ubicación es requerida"),
  id_empresa: z.string().min(1, "Empresa es requerida"),
  //Turno
  id_ext_horario: z.string().min(1, "Horario es requerido"),
  id_ext_descanso: z.string().min(1, "Descanso es requerido"),
});

type UserFormValues = z.infer<typeof UserSchema>;

type Horario = { id: number; hora_entrada: string; hora_salida: string; };
type Descanso = { id: number; inicio_descanso: string; fin_descanso: string; };
type Ubicacion = { id: number; nombre_ubicacion: string; };
type Estatus = { id: number; nombre_estatus: string; };
type Empresas = { id: number; nombre_empresa: string; };

interface AddUserProps {
  horarios: Horario[];
  descansos: Descanso[];
  ubicaciones: Ubicacion[];
  estatuses: Estatus[];
  empresas: Empresas[];
  n_empleados: string;
}

interface ActionState {
  message: string;
}

const removeAccents = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export function AddEmployeeInfoBasica({ horarios, descansos, ubicaciones, empresas, n_empleados }: AddUserProps) {
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = React.useActionState<ActionState, FormData>(addUserIncomplet, { message: '' });

  const form = useForm<UserFormValues>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      //DatosPersonales
      nombres: '',
      a_paterno: '',
      a_materno: '',
      fecha_nacimiento: '',
      sexo: 'false',
      //DatosEmpresariales
      email: '',
      id_ubicacion: '',
      id_empresa: '',
      //Turno
      id_ext_horario: '',
      id_ext_descanso: '',
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

  const handleFormSubmit = async (data: UserFormValues) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    startTransition(() => {
      formAction(formData);
    });
  };

  useEffect(() => {
    if (state.message) {
      const isError = /error|inválido/i.test(state.message);
      if (isError) {
        toast.error('Error', {
          description: state.message,
          position: "top-center"
        });
      } else {
        toast.success('Éxito', {
          description: state.message,
          position: "top-center"
        });
        setOpen(false);
        form.reset();
      }
    }
  }, [state, form, setOpen]);


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className='bg-green-600 hover:bg-green-700 text-white'>Agregar Empleado Con Informacion Incompleta</Button>
      </DialogTrigger>
      <DialogContent className='max-h-[90dvh] max-w-3xl w-[95vw] flex flex-col p-0'>
        <DialogHeader className='px-6 pt-6 pb-2 shrink-0 z-10'>
          <DialogTitle>Agregar Nuevo Empleado Con Informacion Incompleta</DialogTitle>
          <DialogDescription>
            Complete el formulario para registrar un nuevo empleado en el sistema.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id="add-employee-form"
            ref={formRef}
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="flex flex-col flex-1 min-h-0"
          >

            <Tabs defaultValue='foto' className="flex flex-col flex-1 min-h-0">
              <div className='px-6 pb-2 shrink-0'>
                <TabsList className='flex flex-wrap h-auto justify-start'>
                  <TabsTrigger value="datosP">Datos Personales</TabsTrigger>
                  <TabsTrigger value="datosE">Datos Empresariales</TabsTrigger>
                  <TabsTrigger value='turnos'>Turnos</TabsTrigger>
                </TabsList>
              </div>
              <div className="flex-1 overflow-y-auto min-h-0 px-6">
                <div className="pb-6">

                  <TabsContent value='datosP' className="mt-2 space-y-4">
                    <FormField control={form.control} name="nombres" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombres</FormLabel>
                        <FormControl>
                          <Input placeholder="Juan" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>)} />

                    <FormField control={form.control} name="a_paterno" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Apellido Paterno</FormLabel>
                        <FormControl>
                          <Input placeholder="Pérez" {...field} />
                        </FormControl><FormMessage />
                      </FormItem>)} />

                    <FormField control={form.control} name="a_materno" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Apellido Materno</FormLabel>
                        <FormControl>
                          <Input placeholder="García" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>)} />

                    <FormField control={form.control} name="fecha_nacimiento" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fecha de Nacimiento</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl><FormMessage />
                      </FormItem>)} />
                    <FormField control={form.control} name="sexo" render={({ field }) => (

                      <FormItem>
                        <FormLabel>Sexo</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione el sexo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="true">Masculino</SelectItem>
                            <SelectItem value="false">Femenino</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage /></FormItem>)} />
                  </TabsContent>

                  <TabsContent value='datosE' className="mt-2 space-y-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="email@generado.com" {...field} readOnly />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <SelectField
                      control={form.control}
                      name="id_ubicacion"
                      label="Ubicación de Trabajo"
                      placeholder="Seleccione una ubicación"
                      options={ubicaciones.map(ubi => ({ id: ubi.id, label: ubi.nombre_ubicacion }))}
                    />

                    <SelectField
                      control={form.control}
                      name="id_empresa"
                      label="Ubicación de Trabajo"
                      placeholder="Seleccione una ubicación"
                      options={empresas.map(empre => ({ id: empre.id, label: empre.nombre_empresa }))}
                    />

                  </TabsContent>

                  <TabsContent value='turnos' className="mt-2 space-y-4">
                    <SelectField
                      control={form.control}
                      name="id_ext_horario"
                      label="Horario"
                      placeholder="Seleccione un horario"
                      options={horarios.map((horario) => ({
                        id: horario.id,
                        label: `${horario.hora_entrada.slice(0, 5)} - ${horario.hora_salida.slice(0, 5)}`
                      }))}
                    />

                    <SelectField
                      control={form.control}
                      name="id_ext_descanso"
                      label="Descanso"
                      placeholder="Seleccione un descanso"
                      options={descansos.map((descanso) => ({
                        id: descanso.id,
                        label: `${descanso.inicio_descanso.slice(0, 5)} - ${descanso.fin_descanso.slice(0, 5)}`
                      }))}
                    />
                  </TabsContent>

                </div>
              </div>
            </Tabs>
            <DialogFooter className="m-2 px-6 py-4 bg-white shrink-0 mt-auto relative z-20">
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
