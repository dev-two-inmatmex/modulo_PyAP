'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useEffect, useState, useTransition, useCallback } from 'react'

import { addUser } from '@/app/actions'
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

const UserSchema = z.object({
  nombres: z.string().min(1, 'El nombre es requerido'),
  a_paterno: z.string().min(1, 'El apellido paterno es requerido'),
  a_materno: z.string().min(1, 'El apellido materno es requerido'),
  telefono: z.string().min(1, 'El teléfono es requerido'),
  fecha_nacimiento: z.string().min(1, 'La fecha de nacimiento es requerida'),
  id_ext_turno: z.string().min(1, 'El turno es requerido'),
  id_ext_rol: z.string().min(1, 'El rol es requerido'),
})

type UserFormValues = z.infer<typeof UserSchema>

type Turno = {
  id: number;
  horario_entrada: string;
  horario_salida: string;
};

type Rol = {
  id: number;
  rol: string;
};

interface AddUserProps {
  turnos: Turno[];
  roles: Rol[];
}

export function AddEmployee({ turnos, roles }: AddUserProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast()
  const [state, formAction] = React.useActionState(addUser, {
    message: '',
    errors: {},
  })
  const [isPending, startTransition] = useTransition();

  const form = useForm<UserFormValues>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      nombres: '',
      a_paterno: '',
      a_materno: '',
      telefono: '',
      fecha_nacimiento: '',
      id_ext_turno: '',
      id_ext_rol: '',
    },
  })

  const handleOpenChange = useCallback((isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      form.reset();
    }
  }, [form]);

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

  const onSubmit = (data: UserFormValues) => {
    startTransition(() => {
      formAction(data)
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>Agregar Nuevo Usuario</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Usuario</DialogTitle>
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
              name="id_ext_turno"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Turno</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione un turno" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {turnos.map((turno) => (
                        <SelectItem key={turno.id} value={String(turno.id)}>
                          {turno.horario_entrada.slice(0,5)} - {turno.horario_salida.slice(0,5)}
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
              name="id_ext_rol"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rol</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione un rol" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roles.map((rol) => (
                        <SelectItem key={rol.id} value={String(rol.id)}>
                          {rol.rol}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Agregando...' : 'Agregar Usuario'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
