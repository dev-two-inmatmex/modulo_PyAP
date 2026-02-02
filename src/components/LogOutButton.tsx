'use client';

import { logout } from "@/app/(shared)/perfil/actions";

export default function LogoutButton() {
  return (
    <form action={logout}>
      <button
        type="submit"
        className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
      >
        Cerrar Sesión
      </button>
    </form>
  );
}
