'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { addEmployee } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { useEffect, useRef } from 'react'
import { useToast } from '@/hooks/use-toast'

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

export function AddEmployeeForm() {
  const [state, formAction] = useFormState(addEmployee, initialState)
  const { toast } = useToast()
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state?.message && !state.errors) {
      toast({
        title: "Éxito",
        description: state.message,
      })
      formRef.current?.reset()
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
    <Card className="mb-10">
      <CardHeader>
        <CardTitle>Agregar Nuevo Empleado</CardTitle>
        <CardDescription>Complete el formulario para añadir un nuevo empleado a la lista.</CardDescription>
      </CardHeader>
      <form ref={formRef} action={formAction}>
        <CardContent className="space-y-4">
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
        </CardContent>
        <CardFooter className="flex justify-end">
          <SubmitButton />
        </CardFooter>
      </form>
    </Card>
  )
}
