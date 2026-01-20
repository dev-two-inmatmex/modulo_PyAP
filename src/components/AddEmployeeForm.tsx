'use client'

import { useFormStatus } from 'react-dom'
import { addEmployee } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useActionState, useEffect, useRef, useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const initialState = {
  message: null,
  errors: {},
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Agregando...' : 'Agregar Empleado'}
    </Button>
  )
}

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

export function AddEmployeeForm({ horarios, descansos }: { horarios: Horario[] | null, descansos: Descanso[] | null }) {
  const [state, formAction] = useActionState(addEmployee, initialState)
  const { toast } = useToast()
  const formRef = useRef<HTMLFormElement>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (state?.message && !state.errors) {
      toast({
        title: "Éxito",
        description: state.message,
      })
      formRef.current?.reset()
      setOpen(false)
    } else if (state?.message && state.errors) {
        const errorMessages = Object.values(state.errors).flat().join(', ')
        toast({
            variant: "destructive",
            title: "Error de validación",
            description: errorMessages,
        })
    }
  }, [state, toast])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Agregar Nuevo Empleado</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Empleado</DialogTitle>
          <DialogDescription>Complete el formulario para añadir un nuevo empleado a la lista.</DialogDescription>
        </DialogHeader>
        <form ref={formRef} action={formAction}>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombres">Nombres</Label>
                <Input id="nombres" name="nombres" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="a_paterno">Apellido Paterno</Label>
                <Input id="a_paterno" name="a_paterno" required />
              </div>
               <div className="space-y-2">
                <Label htmlFor="a_materno">Apellido Materno</Label>
                <Input id="a_materno" name="a_materno" required />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono</Label>
                <Input id="telefono" name="telefono" type="tel" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fecha_nacimiento">Fecha de Nacimiento</Label>
                <Input id="fecha_nacimiento" name="fecha_nacimiento" type="date" required />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="id_ext_horario">Horario</Label>
                <Select name="id_ext_horario">
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un horario" />
                  </SelectTrigger>
                  <SelectContent>
                    {horarios?.map((horario) => (
                      <SelectItem key={horario.id} value={String(horario.id)}>
                        {horario.h_entrada.slice(0, 5)} - {horario.h_salida.slice(0, 5)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="id_ext_descanso">Descanso</Label>
                <Select name="id_ext_descanso">
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un descanso" />
                  </SelectTrigger>
                  <SelectContent>
                    {descansos?.map((descanso) => (
                      <SelectItem key={descanso.id} value={String(descanso.id)}>
                        {descanso.d_salida.slice(0, 5)} - {descanso.d_regreso.slice(0, 5)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <SubmitButton />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
