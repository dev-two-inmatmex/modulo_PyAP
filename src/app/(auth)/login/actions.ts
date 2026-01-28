'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

const LoginSchema = z.object({
  email: z.string().email('El email no es válido.'),
  password: z.string().min(3, 'La contraseña debe tener al menos 6 caracteres.'),
})

export async function login(prevState: any, formData: FormData) {
  const supabase = await createClient()

  const validatedFields = LoginSchema.safeParse(
    Object.fromEntries(formData.entries())
  )

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Error de validación.',
    }
  }

  const { email, password } = validatedFields.data

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error('Error de inicio de sesión:', error)
    return {
      message: 'Credenciales inválidas. Por favor, intente de nuevo.',
    }
  }

  revalidatePath('/')
  redirect('/perfil')
}