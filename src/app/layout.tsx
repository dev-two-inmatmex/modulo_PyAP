/*import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import Header from "@/components/Header";
import { Toaster } from "@/components/ui/toaster";
import { SupabaseProviderClient } from '@/components/providers/SupabaseProviderClient';
import "./globals.css";

import { getAvatarsMap } from '@/utils/storage';

export const metadata: Metadata = {
  title: "Sistema INMATMEX",
  description: "Proyecto Cerebro V2",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {data: { user }} = await supabase.auth.getUser();
  const { data: { session } } = await supabase.auth.getSession();
  const requiereCambioPassword = user?.user_metadata?.requires_password_change === true
  if (!user || requiereCambioPassword) {
    return (
      <html lang="es" suppressHydrationWarning>
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter&display=swap"
            rel="stylesheet"
          />
        </head>
        <body className="font-body antialiased">
          <SupabaseProviderClient serverSession={session}>
            {children}
            <Toaster />
          </SupabaseProviderClient>
        </body>
      </html>
    );
  }

  const { data: rolesData } = await supabase
    .from("v_usuario_roles")
    .select("nombre_rol")
    .eq("id_usuario", user.id);

  const roles = rolesData?.map((r) => r.nombre_rol) || [];

  const { data: empleado } = await supabase
    .from("empleados")
    .select(`nombres, apellido_paterno, apellido_materno`)
    .eq("id", user.id)
    .single();

  const fullName = empleado
    ? `${empleado.nombres} ${empleado.apellido_paterno} ${empleado.apellido_materno}`.trim()
    : "Usuario";
  
  const avatares = await getAvatarsMap([user.id]);
  const avatarUrl = avatares[user.id];

  const userData = {
    ...user,
    fullName,
    avatarUrl
  };

  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <SupabaseProviderClient serverSession={session}>
          <SidebarProvider>
            <AppSidebar userRoles={roles} user={userData} />
            <SidebarInset>
              <Header />
              <main className="flex-1 p-4 sm:p-6 bg-muted/30">{children}</main>
            </SidebarInset>
          </SidebarProvider>
          <Toaster />
        </SupabaseProviderClient>
      </body>
    </html>
  );
}*/
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import Header from "@/components/Header";
import { Toaster } from "@/components/ui/toaster";
import { SupabaseProviderClient } from '@/components/providers/SupabaseProviderClient';
import "./globals.css";
import { getAvatarsMap } from '@/utils/storage';

export const metadata: Metadata = {
  title: "Sistema INMATMEX",
  description: "Proyecto Cerebro V2",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  
  // 1. Obtenemos el usuario y la sesión en paralelo
  const [
    { data: { user } },
    { data: { session } }
  ] = await Promise.all([
    supabase.auth.getUser(),
    supabase.auth.getSession()
  ]);

  const requiereCambioPassword = user?.user_metadata?.requires_password_change === true;
  const isAuthValid = user && !requiereCambioPassword;

  // 2. Variables para almacenar los datos si el usuario es válido
  let roles: string[] = [];
  let userData = null;

  if (isAuthValid) {
    // 3. Obtenemos roles y datos del empleado en paralelo
    const [
      { data: rolesData },
      { data: empleado }
    ] = await Promise.all([
      supabase.from("v_usuario_roles").select("nombre_rol").eq("id_usuario", user.id),
      // Aprovechamos para traer el url_avatar directamente desde aquí
      supabase.from("empleados").select("nombres, apellido_paterno, apellido_materno").eq("id", user.id).single()
    ]);

    roles = rolesData?.map((r) => r.nombre_rol) || [];
    
    const fullName = empleado
      ? `${empleado.nombres} ${empleado.apellido_paterno} ${empleado.apellido_materno}`.trim()
      : "Usuario";
    
      const avatares = await getAvatarsMap([user.id]);
      const avatarUrl = avatares[user.id];

    userData = {
      ...user,
      fullName,
      avatarUrl: avatarUrl,
    };
  }

  // 4. Retornamos una única estructura HTML limpia
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <SupabaseProviderClient serverSession={session}>
          
          {/* Si NO está autenticado o requiere cambio de contraseña */}
          {!isAuthValid ? (
            <>
              {children}
              <Toaster />
            </>
          ) : (
            
          /* Si está autenticado correctamente */
            <SidebarProvider>
              <AppSidebar userRoles={roles} user={userData!} />
              <SidebarInset>
                <Header />
                <main className="flex-1 p-4 sm:p-6 bg-muted/30">{children}</main>
              </SidebarInset>
              <Toaster />
            </SidebarProvider>
          )}

        </SupabaseProviderClient>
      </body>
    </html>
  );
}
