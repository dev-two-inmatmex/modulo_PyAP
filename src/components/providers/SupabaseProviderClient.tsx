'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { SupabaseClient, Session, AuthChangeEvent } from '@supabase/supabase-js';

// 1. Definimos qué datos va a compartir nuestro contexto
type SupabaseContextType = {
  supabase: SupabaseClient;
  session: Session | null;
};

// 2. Creamos el contexto
const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export function SupabaseProviderClient({ children }: { children: React.ReactNode }) {
  // Inicializamos el cliente una sola vez
  const [supabase] = useState(() => createClient());
  const [session, setSession] = useState<Session | null>(null);
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();


  useEffect(() => {
    // 3. Cargamos la sesión UNA SOLA VEZ al montar la aplicación
    
    const inicializarSesion = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setIsReady(true);
    };

    inicializarSesion();

    // 4. Escuchamos si el usuario hace login/logout para actualizar el estado global
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (_event: AuthChangeEvent, session: Session | null) => {
          setSession(session);
          router.refresh();
        }
      );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, router]);

  // Evitamos renderizar la app hasta que Supabase esté 100% "despierto" y con los tokens listos
  if (!isReady) {
    return <div className="flex justify-center items-center h-screen">Cargando sesión...</div>; 
  }

  return (
    <SupabaseContext.Provider value={{ supabase, session }}>
      {children}
    </SupabaseContext.Provider>
  );
}

// 5. Hook personalizado para usarlo fácilmente en cualquier componente
export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase debe usarse dentro de un SupabaseProviderClient');
  }
  return context;
};