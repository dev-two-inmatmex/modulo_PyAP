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

  // 3. Consultamos tu tabla 'usuario_rol'
  // para decidir a dónde enviarlo apenas entre a la web.
  const { data: infoRol } = await supabase
    .from('usuario_rol')
    .select(`
      id_rol,
      roles_sistema ( nombre_rol )
    `)
    .eq('id_usuario', user.id)
    .single()

  // When fetching related data, Supabase can return it as an array.
  // The error occurs because we're trying to access a property on an array.
  // We need to access the first element of the array.
  const nombreRol = Array.isArray(infoRol?.roles_sistema)
    ? infoRol.roles_sistema[0]?.nombre_rol
    : infoRol?.roles_sistema?.nombre_rol

  // 4. Redirección inteligente basada en tu estructura de carpetas
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
      // Si no tiene un rol asignado aún, lo mandamos a ver sus datos básicos
      redirect('/perfil')
  }
}
