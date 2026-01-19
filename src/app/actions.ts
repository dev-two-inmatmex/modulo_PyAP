'use server'

import { z } from 'zod'
import { supabase } from '@/lib/supabaseClient'
import { revalidatePath } from 'next/cache'

const EmployeeSchema = z.object({
  nombres: z.string().min(1, 'El nombre es requerido'),
  a_paterno: z.string().min(1, 'El apellido paterno es requerido'),
  a_materno: z.string().min(1, 'El apellido materno es requerido'),
  telefono: z.string().min(1, 'El teléfono es requerido'),
  fecha_nacimiento: z.string().min(1, 'La fecha de nacimiento es requerida'),
})

export async function addEmployee(prevState: any, formData: FormData) {
  const validatedFields = EmployeeSchema.safeParse({
    nombres: formData.get('nombres'),
    a_paterno: formData.get('a_paterno'),
    a_materno: formData.get('a_materno'),
    telefono: formData.get('telefono'),
    fecha_nacimiento: formData.get('fecha_nacimiento'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Error de validación.',
    }
  }

  const { error } = await supabase
    .from('empleados')
    .insert(validatedFields.data)

  if (error) {
    console.error('Error al insertar empleado:', error)
    return {
      message: 'Error de base de datos: No se pudo crear el empleado.',
    }
  }

  revalidatePath('/')
  return {
    message: 'Empleado agregado exitosamente.',
  }
}
