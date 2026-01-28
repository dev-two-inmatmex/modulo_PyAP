"use client";

import { createClient } from "@/lib/supabase/client"; // Tu cliente de navegador
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    // 1. Cerrar sesión directamente desde el navegador
    await supabase.auth.signOut();
    
    // 2. Forzar refresco y redirección
    router.push("/login");
    router.refresh();
  };

  return (
    <button
      onClick={handleSignOut}
      className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
    >
      Cerrar Sesión
    </button>
  );
}