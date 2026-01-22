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
  id_ext_horario: z.coerce.number().min(1, 'El horario es requerido'),
  id_ext_descanso: z.coerce.number().min(1, 'El descanso es requerido'),
  registration_timestamp: z.string().min(1, 'Timestamp de registro requerido.'),
})

export async function addEmployee(prevState: any, data: unknown) {
  const validatedFields = EmployeeSchema.safeParse(data)

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Error de validación.',
    }
  }

  const { registration_timestamp, ...employeeData } = validatedFields.data;
  const { nombres, a_paterno, a_materno } = employeeData;

  const c_empleado = `${nombres.charAt(0)}${a_paterno.charAt(0)}${a_materno.charAt(0)}${registration_timestamp}`;

  const { error } = await supabase
    .from('empleados')
    .insert({ ...employeeData, c_empleado, id_ext_estado: 1 })

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
