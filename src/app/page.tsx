
import { createClient } from '@/lib/supabaseServer'
import { redirect } from 'next/navigation'

export default async function RootPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect('/perfil')
  } else {
    redirect('/login')
  }
}
