'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { getEmpleadoNombreCompleto } from '@/services/empleados-nombre_completo';

interface NombresEmpleado {
  id: string;
  nombre_completo: string;
  nombre_corto: string;
}
interface EmpleadoContextType {
  getNombreEmpleadoPorId: (id: string) => NombresEmpleado | undefined;
  isLoading: boolean;
}

const EmpleadoContext = createContext<EmpleadoContextType | undefined>(undefined);

export function NombreEmpleadoProvider({ children }: { children: ReactNode }) {
  const [empleadosMap, setEmpleadosMap] = useState<Map<string, NombresEmpleado>>(new Map());
  const [isLoading, setIsLoading] = useState(true);

  const fetchEmpleados = useCallback(async () => {
    setIsLoading(true);
    console.log("Cargando/Refrescando caché de empleados...");
    try {
      const empleadosData = await getEmpleadoNombreCompleto();
      const newMap = new Map<string, NombresEmpleado>();
      for (const emp of empleadosData) {
        const nombre_completo = `${emp.nombres} ${emp.apellido_paterno} ${emp.apellido_materno}`.trim().replace(/ +/g, ' ');
        const nombre_corto = `${emp?.nombres?.split(' ')[0]} ${emp.apellido_paterno}`.trim().replace(/ +/g, ' ');
        newMap.set(emp.id, { id: emp.id, nombre_completo, nombre_corto });
      }
      setEmpleadosMap(newMap);
    } catch (error) {
      console.error('Error al cargar nombres de empleados:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchEmpleados();
  }, [fetchEmpleados]);

  const getNombreEmpleadoPorId = (id: string): NombresEmpleado | undefined => {
    return empleadosMap.get(id);
  };
  const value = { getNombreEmpleadoPorId, isLoading };

  return (
    <EmpleadoContext.Provider value={value}>
      {children}
    </EmpleadoContext.Provider>
  );
}

export function useNombreEmpleado() {
  const context = useContext(EmpleadoContext);
  if (context === undefined) {
    throw new Error('useNombreEmpleado debe ser usado dentro de un EmployeeProvider');
  }
  return context;
}
