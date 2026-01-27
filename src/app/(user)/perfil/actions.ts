
'use server'

import { z } from 'zod'
import { supabase } from '@/lib/Supabase/client'
import { revalidatePath } from 'next/cache'

const UserSchema = z.object({
  nombres: z.string().min(1, 'El nombre es requerido'),
  a_paterno: z.string().min(1, 'El apellido paterno es requerido'),
  a_materno: z.string().min(1, 'El apellido materno es requerido'),
  email: z.string().email('El email no es válido').min(1, 'El email es requerido'),
  direccion: z.string().min(1, 'La dirección es requerida'),
  telefono1: z.string().min(1, 'Se requiere al menos un teléfono'),
  telefono2: z.string().optional().or(z.literal('')),
  fecha_nacimiento: z.string().min(1, 'La fecha de nacimiento es requerida'),
  pago_dia: z.coerce.number().min(0, 'El pago por día debe ser un número positivo'),
  id_ext_horario: z.coerce.number().min(1, 'El horario es requerido'),
  id_ext_descanso: z.coerce.number().min(1, 'El descanso es requerido'),
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

  const { telefono1, telefono2, ...userData } = validatedFields.data

  const { data: newUser, error: userError } = await supabase
    .from('usuarios')
    .insert({ 
      ...userData,
      creacion_usuario: new Date().toISOString(), 
      id_ext_estado: 1 
    })
    .select('id')
    .single()

  if (userError) {
    console.error('Error al insertar usuario:', userError)
    return {
      message: 'Error de base de datos: No se pudo crear el usuario.',
    }
  }

  if (!newUser) {
    return {
      message: 'Error de base de datos: No se pudo obtener el ID del nuevo usuario.',
    }
  }

  const telefonosToInsert = []
  if (telefono1) {
      telefonosToInsert.push({ id_ext_usuario: newUser.id, numero_telefonico: telefono1 })
  }
  if (telefono2 && telefono2.length > 0) {
      telefonosToInsert.push({ id_ext_usuario: newUser.id, numero_telefonico: telefono2 })
  }

  if (telefonosToInsert.length > 0) {
      const { error: phoneError } = await supabase
          .from('telefonos_usuarios')
          .insert(telefonosToInsert)

      if (phoneError) {
          console.error('Error al insertar teléfonos:', phoneError)
          revalidatePath('/')
          return {
            message: 'Usuario agregado, pero hubo un error al guardar los teléfonos.',
          }
      }
  }

  revalidatePath('/')
  return {
    message: 'Usuario agregado exitosamente.',
  }
}
