import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { redirect } from 'next/navigation'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set({ name, value, ...options })
            response.cookies.set({ name, value, ...options })
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const url = request.nextUrl.clone()
  const { pathname } = url

  // 1. EXTRAER METADATA DEL TRIGGER
  const roles = user?.user_metadata?.roles || []
  const isAdmin = user?.user_metadata?.is_admin || false
  const hasAnyRole = roles.length > 0

  // 2. CASO: NO HAY USUARIO

  if (!user) {
    if (pathname !== '/login') {
      url.pathname = '/login'
      return syncCookiesAndRedirect(request, url)
    }
    return response
  }

  // 3. CASO: USUARIO LOGUEADO
  if (user) {
    if (pathname === '/login' || pathname === '/') {
      url.pathname = '/perfil'
      return syncCookiesAndRedirect(request, url)
    }

    if (pathname.startsWith('/perfil') && pathname === '/login') {
      url.pathname = '/perfil'
      return syncCookiesAndRedirect(request, url)
    }

    // Si no tiene roles y no está en /perfil, forzar /perfil
    if (!hasAnyRole && !pathname.startsWith('/perfil')) {
      url.pathname = '/perfil'
      return syncCookiesAndRedirect(request, url)
    }

    // Protección de rutas por carpeta (RBAC)
    if (!isAdmin) {
      const roleMapping: Record<string, string> = {
        '/administracion': 'Administrador',
        '/direccion': 'Dirección',
        '/rh': 'RH',
        '/supervisor': 'Supervisor',
      }

      const protectedPath = Object.keys(roleMapping).find(path => pathname.startsWith(path));

      if (protectedPath) {
        const requiredRole = roleMapping[protectedPath];
        if (!roles.includes(requiredRole)) {
          url.pathname = '/perfil';
          return syncCookiesAndRedirect(request, url);
        }
      }
    }
  }


  return response
}

function syncCookiesAndRedirect(request: NextRequest, url: URL) {
  const res = NextResponse.redirect(url)
  request.cookies.getAll().forEach((c) => res.cookies.set(c))
  return res
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}