
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function RootPage() {
  const supabase = await createClient()

  // 1. Verificamos la sesión del usuario
  const { data: { user }, error } = await supabase.auth.getUser()

  // 2. Si no hay usuario o hay error, mandamos al login
  // El middleware también protege esto, pero aquí aseguramos el flujo inicial
  if (error || !user) {
    redirect('/login')
  }

  // 3. Consultamos tu tabla 'usuario_rol' para decidir el destino
  const { data: userRoleData, error: roleError } = await supabase
    .from('usuario_rol')
    .select(`
      id_rol,
      roles_sistema (
        nombre_rol
      )
    `)
    .eq('id_usuario', user.id)
    .single()

  // Si hay un error consultando el rol, o si no se encuentra un rol, redirigir a perfil
  if (roleError || !userRoleData) {
    if (roleError) console.error('Error fetching user role:', roleError.message);
    return redirect('/perfil');
  }

  // 4. Lógica de redirección por roles definidos
  // Como `roles_sistema` es una relación, Supabase lo devuelve como un objeto o null.
  const rol = userRoleData.roles_sistema?.nombre_rol

  if (!rol) {
    return redirect('/perfil');
  }

  if (rol === 'Administrador') {
    redirect('/admin')
  } else if (rol === 'Dirección') {
    redirect('/direccion')
  } else if (rol === 'RH') {
    redirect('/rh')
  } else if (rol === 'Supervisor') {
    redirect('/supervisor')
  } else if (rol === 'Usuario Operativo') {
    redirect('/operativo')
  }

  // 5. Destino por defecto si no tiene un rol asignado o no coincide
  // Usamos la carpeta (shared) que ya tienes en tu estructura
  redirect('/perfil')
}
