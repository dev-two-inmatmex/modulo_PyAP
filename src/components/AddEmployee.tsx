
'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useEffect, useState, useTransition, useCallback } from 'react'

import { addUser } from '@/app/(roles)/rh/empleados/actions'
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
  email: z.string().email('El email no es válido').min(1, 'El email es requerido'),
  direccion: z.string().min(1, 'La dirección es requerida'),
  telefono1: z.string().min(1, 'Se requiere al menos un teléfono'),
  telefono2: z.string().optional(),
  fecha_nacimiento: z.string().min(1, 'La fecha de nacimiento es requerida'),
  pago_dia: z.string().min(1, 'El pago por día es requerido'),
  id_ext_horario: z.string().min(1, 'El horario es requerido'),
  id_ext_descanso: z.string().min(1, 'El descanso es requerido'),
  id_ext_rol: z.string().min(1, 'El rol es requerido'),
})

type UserFormValues = z.infer<typeof UserSchema>

type Horario = {
  id: number;
  horario_entrada: string;
  horario_salida: string;
};

type Descanso = {
  id: number;
  descanso_inicio: string;
  descanso_final: string;
}

type Rol = {
  id: number;
  rol: string;
}

interface AddUserProps {
  horarios: Horario[];
  descansos: Descanso[];
  roles: Rol[];
}

export function AddEmployee({ horarios, descansos, roles }: AddUserProps) {
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
      email: '',
      direccion: '',
      telefono1: '',
      telefono2: '',
      fecha_nacimiento: '',
      pago_dia: '',
      id_ext_horario: '',
      id_ext_descanso: '',
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
      // @ts-ignore
      formAction(data)
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>Agregar Nuevo Usuario</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
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
            <div className="grid grid-cols-2 gap-4">
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
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="usuario@ejemplo.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="direccion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dirección</FormLabel>
                  <FormControl>
                    <Input placeholder="Av. Siempre Viva 123" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="telefono1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono Principal</FormLabel>
                    <FormControl>
                      <Input placeholder="1234567890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="telefono2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono Secundario (Opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="0987654321" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
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
                name="pago_dia"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pago por Día</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="100.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
                          {`${horario.horario_entrada.slice(0,5)} - ${horario.horario_salida.slice(0,5)}`}
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
                          {`${descanso.descanso_inicio.slice(0,5)} - ${descanso.descanso_final.slice(0,5)}`}
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
