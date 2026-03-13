
'use client';

import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
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
  const { supabase } = useSupabase();
  const router = useRouter();
  const handleLogout = async () => {
    await supabase.auth.signOut({ scope: 'local' });
    router.refresh();
  };
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
