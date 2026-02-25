import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import Header from "@/components/Header";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

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
  const {
    data: { user },
  } = await supabase.auth.getUser();
  
  if (!user) {
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
          {children}
          <Toaster />
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

  const userData = {
    ...user,
    fullName,
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
        <SidebarProvider>
          <AppSidebar userRoles={roles} user={userData} />
          <SidebarInset>
            <Header />
            <main className="flex-1 p-4 sm:p-6 bg-muted/30">{children}</main>
          </SidebarInset>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
