import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

type roles_sistema = {
    nombre_rol: string;
}

export default async function RootPage() {
  const supabase = await createClient()

  // 1. Validar sesión activa
  const { data: { user } } = await supabase.auth.getUser()
  if (!user){ 
    redirect('/login')
  }else if (user){
    redirect('/perfil')
  }
  
}