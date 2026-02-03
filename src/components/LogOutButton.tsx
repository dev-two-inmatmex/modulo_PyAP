
'use client';

import { useTransition } from 'react';
import { logout } from "@/app/(shared)/perfil/actions";
import { Button } from './ui/button';
import { LogOut } from 'lucide-react';
import { useSidebar } from './ui/sidebar';

export default function LogoutButton() {
  const [isPending, startTransition] = useTransition();
  const { state } = useSidebar();


  return (
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
  );
}
