'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useEffect, useState, useTransition, useCallback } from 'react'

import { addEmployee } from '@/app/actions'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"


const EmployeeSchema = z.object({
  id: z.string().optional(),
  nombres: z.string().min(1, 'El nombre es requerido'),
  a_paterno: z.string().min(1, 'El apellido paterno es requerido'),
  a_materno: z.string().min(1, 'El apellido materno es requerido'),
  telefono: z.string().min(1, 'El teléfono es requerido'),
  fecha_nacimiento: z.string().min(1, 'La fecha de nacimiento es requerida'),
  id_ext_horario: z.string().min(1, 'El horario es requerido'),
  id_ext_descanso: z.string().min(1, 'El descanso es requerido'),
  registration_timestamp: z.string(),
  c_empleado: z.string(),
})

type EmployeeFormValues = z.infer<typeof EmployeeSchema>

type Horario = {
  id: number;
  h_entrada: string;
  h_salida: string;
};

type Descanso = {
  id: number;
  d_salida: string;
  d_regreso: string;
};

interface AddEmployeeProps {
  horarios: Horario[];
  descansos: Descanso[];
}

export function AddEmployee({ horarios, descansos }: AddEmployeeProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast()
  const [state, formAction] = React.useActionState(addEmployee, {
    message: '',
    errors: {},
  })
  const [isPending, startTransition] = useTransition();

  const [registrationTimestamp, setRegistrationTimestamp] = useState('');

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(EmployeeSchema),
    defaultValues: {
      id: '',
      nombres: '',
      a_paterno: '',
      a_materno: '',
      telefono: '',
      fecha_nacimiento: '',
      id_ext_horario: '',
      id_ext_descanso: '',
      registration_timestamp: '',
      c_empleado: '',
    },
  })

  const { watch } = form;
  const [nombres, a_paterno, a_materno] = watch(['nombres', 'a_paterno', 'a_materno']);
  const [idPreview, setIdPreview] = useState('');

  const handleOpenChange = useCallback((isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const timestamp = `${year}${month}${day}${hours}${minutes}`;
      setRegistrationTimestamp(timestamp);
      form.setValue('registration_timestamp', timestamp);
    } else {
      form.reset();
      setIdPreview('');
      setRegistrationTimestamp('');
    }
  }, [form]);


  useEffect(() => {
    const firstInitial = nombres?.[0] || '';
    const paternalInitial = a_paterno?.[0] || '';
    const maternalInitial = a_materno?.[0] || '';

    if (firstInitial && paternalInitial && maternalInitial && registrationTimestamp) {
        const preview = `${firstInitial}${paternalInitial}${maternalInitial}${registrationTimestamp}`;
        setIdPreview(preview);
        form.setValue('c_empleado', preview);
    } else {
        setIdPreview('...YYYYMMDDHHMM');
    }
  }, [nombres, a_paterno, a_materno, registrationTimestamp, form]);


  useEffect(() => {
    if (state.message && !state.errors) {
      toast({
        title: 'Éxito',
        description: state.message,
      })
      handleOpenChange(false)
    } else if (state.message && state.errors) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.message,
      })
    }
  }, [state, toast, handleOpenChange])

  const onSubmit = (data: EmployeeFormValues) => {
    startTransition(() => {
      formAction(data)
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>Agregar Nuevo Empleado</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Empleado</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nombres"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombres</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                      className="uppercase"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="a_paterno"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Apellido Paterno</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Doe"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                      className="uppercase"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="a_materno"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Apellido Materno</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Smith"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                      className="uppercase"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <Label>ID de Empleado (previsualización)</Label>
              <Input
                  placeholder="AQSYYYYMMDDHHMM"
                  readOnly
                  disabled
                  value={idPreview}
                  className="uppercase bg-muted/50"
              />
              <p className="text-sm text-muted-foreground">
                  El ID final se completa con la fecha y hora del registro.
              </p>
            </div>

            <FormField
              control={form.control}
              name="telefono"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono</FormLabel>
                  <FormControl>
                    <Input placeholder="1234567890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fecha_nacimiento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha de Nacimiento</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="id_ext_horario"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Horario</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione un horario" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {horarios.map((horario) => (
                        <SelectItem key={horario.id} value={String(horario.id)}>
                          {horario.h_entrada.slice(0,5)} - {horario.h_salida.slice(0,5)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="id_ext_descanso"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descanso</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione un descanso" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {descansos.map((descanso) => (
                        <SelectItem key={descanso.id} value={String(descanso.id)}>
                          {descanso.d_salida.slice(0,5)} - {descanso.d_regreso.slice(0,5)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Agregando...' : 'Agregar Empleado'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
