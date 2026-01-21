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
})

export async function addEmployee(prevState: any, formData: FormData) {
  const validatedFields = EmployeeSchema.safeParse({
    nombres: formData.get('nombres'),
    a_paterno: formData.get('a_paterno'),
    a_materno: formData.get('a_materno'),
    telefono: formData.get('telefono'),
    fecha_nacimiento: formData.get('fecha_nacimiento'),
    id_ext_horario: formData.get('id_ext_horario'),
    id_ext_descanso: formData.get('id_ext_descanso'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Error de validación.',
    }
  }

  const { nombres, a_paterno, a_materno } = validatedFields.data;

  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  const c_empleado = `${nombres.charAt(0)}${a_paterno.charAt(0)}${a_materno.charAt(0)}${year}${month}${day}${hours}${minutes}`;

  const { error } = await supabase
    .from('empleados')
    .insert({ ...validatedFields.data, c_empleado, id_ext_estado: 1 })

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
