"use client";

import { createContext, useContext, ReactNode } from 'react';

// 1. Definimos el tipo de datos que almacenará nuestro contexto
type AvatarContextType = {
  // Un diccionario que mapea el ID del empleado a la URL de su avatar
  avatarUrls: Record<string, string>;
  // Una función de ayuda para obtener una URL específica
  getAvatarUrl: (employeeId: string) => string | undefined;
};

// 2. Creamos el contexto con un valor inicial por defecto
const AvatarContext = createContext<AvatarContextType | undefined>(undefined);

// 3. Creamos el Proveedor del Contexto
// Este componente envolverá nuestra aplicación y le proporcionará los datos.
export const AvatarProvider = ({
  children,
  value,
}: {
  children: ReactNode;
  value: Record<string, string>;
}) => {
  // Creamos una función de ayuda para simplificar la obtención de URLs
  const getAvatarUrl = (employeeId: string) => value[employeeId];

  return (
    <AvatarContext.Provider value={{ avatarUrls: value, getAvatarUrl }}>
      {children}
    </AvatarContext.Provider>
  );
};

// 4. Creamos el Hook personalizado
// Este hook nos permitirá acceder fácilmente al contexto desde cualquier componente.
export const useAvatars = () => {
  const context = useContext(AvatarContext);
  if (context === undefined) {
    throw new Error('useAvatars debe ser usado dentro de un AvatarProvider');
  }
  return context;
};
