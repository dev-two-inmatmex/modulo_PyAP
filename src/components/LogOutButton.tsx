
'use client';

import { useTransition } from 'react';
import { logout } from "@/app/(shared)/perfil/actions";
import { Button } from './ui/button';
import { LogOut } from 'lucide-react';
import { useSidebar } from './ui/sidebar';
import { useSupabase } from './providers/SupabaseProviderClient';
import { useRouter } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
export default function LogoutButton() {
  //const [isPending, startTransition] = useTransition();
  //const { state } = useSidebar();
  const { supabase } = useSupabase();
  const router = useRouter();
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };
  /*return (
    <Button
      variant="ghost"
      size="icon"
      className="ml-auto text-muted-foreground hover:text-foreground"
      onClick={() => {
        startTransition(() => {
          logout();
        });
      }}
      disabled={isPending}
      aria-label={isPending ? 'Cerrando Sesión...' : 'Cerrar Sesión'}
    >
      <LogOut className="size-5" />
    </Button>
  );*/
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <LogOut className="h-5 w-5" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        {/* SECCIÓN CORREGIDA: Se añadió el Header con Título y Descripción */}
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro de que quieres salir?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción cerrará tu sesión actual. Para volver a acceder, deberás iniciar sesión de nuevo.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleLogout}>Cerrar Sesión</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
