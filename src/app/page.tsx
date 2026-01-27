// app/page.tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function RootPage() {
  const supabase = await createClient()

  // 1. Obtenemos el usuario de la sesión
  const { data: { user } } = await supabase.auth.getUser()

  // 2. Si no hay usuario, el middleware eventualmente lo mandará a /login, 
  // pero es buena práctica manejarlo aquí también para evitar bucles.
  if (!user) {
    redirect('/login')
  }

  // 3. Consultamos tu tabla 'usuario_rol' para obtener el rol del usuario.
  const { data: infoRol, error: rolError } = await supabase
    .from('usuario_rol')
    .select('roles_sistema ( nombre_rol )')
    .eq('id_usuario', user.id)
    .single()

  // Si hay un error al obtener el rol o el usuario no tiene uno, lo mandamos a /perfil.
  if (rolError || !infoRol || !infoRol.roles_sistema) {
    redirect('/perfil')
  }
  
  // Supabase puede devolver la relación como objeto o array. Este código maneja ambos.
  const rolesSistema = infoRol.roles_sistema
  const nombreRol = Array.isArray(rolesSistema)
    ? rolesSistema[0]?.nombre_rol
    : rolesSistema?.nombre_rol

  // 4. Redirección inteligente basada en el rol del usuario.
  switch (nombreRol) {
    case 'Administrador':
      redirect('/admin')
    case 'Dirección':
      redirect('/direccion')
    case 'RH':
      redirect('/rh')
    case 'Supervisor':
      redirect('/supervisor')
    case 'Usuario Operativo':
      redirect('/operativo')
    default:
      // Si el rol no existe o no coincide, lo mandamos a su perfil.
      redirect('/perfil')
  }
}
