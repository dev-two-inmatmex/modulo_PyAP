
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { logout } from './actions'

async function LogoutButton() {
  return (
    <form action={logout}>
      <Button variant="secondary" type="submit">Cerrar Sesión</Button>
    </form>
  )
}

export default async function PerfilLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-card border-b sticky top-0 z-10">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <h1 className="text-xl font-bold">Sistema de Gestión</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {user.email}
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="flex-grow">{children}</main>
    </div>
  )
}
