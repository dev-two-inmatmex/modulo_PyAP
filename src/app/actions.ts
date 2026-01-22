'use server'

import { z } from 'zod'
import { supabase } from '@/lib/supabaseClient'
import { revalidatePath } from 'next/cache'

const UserSchema = z.object({
  nombres: z.string().min(1, 'El nombre es requerido'),
  a_paterno: z.string().min(1, 'El apellido paterno es requerido'),
  a_materno: z.string().min(1, 'El apellido materno es requerido'),
  telefono: z.string().min(1, 'El teléfono es requerido'),
  fecha_nacimiento: z.string().min(1, 'La fecha de nacimiento es requerida'),
  id_ext_turno: z.coerce.number().min(1, 'El turno es requerido'),
  id_ext_rol: z.coerce.number().min(1, 'El rol es requerido'),
})

export async function addUser(prevState: any, data: unknown) {
  const validatedFields = UserSchema.safeParse(data)

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Error de validación.',
    }
  }

  const { error } = await supabase
    .from('usuarios')
    .insert({ 
      ...validatedFields.data, 
      creacion_usuario: new Date().toISOString(), 
      id_ext_estado: 1 
    })

  if (error) {
    console.error('Error al insertar usuario:', error)
    return {
      message: 'Error de base de datos: No se pudo crear el usuario.',
    }
  }

  revalidatePath('/')
  return {
    message: 'Usuario agregado exitosamente.',
  }
}
