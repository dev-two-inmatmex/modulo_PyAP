'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useEffect, useState, useTransition } from 'react'
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"


const EmployeeSchema = z.object({
  nombres: z.string().min(1, 'El nombre es requerido'),
  a_paterno: z.string().min(1, 'El apellido paterno es requerido'),
  a_materno: z.string().min(1, 'El apellido materno es requerido'),
  telefono: z.string().min(1, 'El teléfono es requerido'),
  fecha_nacimiento: z.date({
    required_error: "La fecha de nacimiento es requerida.",
  }),
  id_ext_horario: z.string().min(1, 'El horario es requerido'),
  id_ext_descanso: z.string().min(1, 'El descanso es requerido'),
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

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(EmployeeSchema),
    defaultValues: {
      nombres: '',
      a_paterno: '',
      a_materno: '',
      telefono: '',
      id_ext_horario: '',
      id_ext_descanso: '',
    },
  })

  useEffect(() => {
    if (state.message && !state.errors) {
      toast({
        title: 'Éxito',
        description: state.message,
      })
      setOpen(false)
      form.reset()
    } else if (state.message && state.errors) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.message,
      })
    }
  }, [state, toast, form])

  const onSubmit = (data: EmployeeFormValues) => {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'fecha_nacimiento' && value instanceof Date) {
        formData.append(key, format(value, 'yyyy-MM-dd'))
      } else {
        formData.append(key, String(value))
      }
    })
    startTransition(() => {
      formAction(formData)
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
                    <Input placeholder="John" {...field} />
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
                    <Input placeholder="Doe" {...field} />
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
                    <Input placeholder="Smith" {...field} />
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
                <FormItem className="flex flex-col">
                  <FormLabel>Fecha de Nacimiento</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Elige una fecha</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
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
