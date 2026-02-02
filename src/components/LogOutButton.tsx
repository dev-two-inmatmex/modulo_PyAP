'use client';

import { useTransition } from 'react';
import { logout } from "@/app/(shared)/perfil/actions";

export default function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => {
        startTransition(() => {
          logout();
        });
      }}
      disabled={isPending}
      className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
    >
      {isPending ? 'Cerrando Sesión...' : 'Cerrar Sesión'}
    </button>
  );
}
