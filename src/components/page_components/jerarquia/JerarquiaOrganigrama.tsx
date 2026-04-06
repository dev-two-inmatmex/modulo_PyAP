/*'use client'

import React, { useState, useMemo } from 'react';
import { ChevronRight, ChevronDown, Building2, FolderTree, Users } from 'lucide-react';

// 1. Definimos los tipos basados en tu tabla
export interface JerarquiaRow {
  id: number;
  nombre_seccion: string | null;
  id_tipo: number | null;
  id_padre: number | null;
  id_empresa: number | null;
}

// Interfaz extendida para el árbol (incluye los hijos)
interface JerarquiaNode extends JerarquiaRow {
  children: JerarquiaNode[];
}

interface OrganigramaEmpresaProps {
  jerarquiaCruda: JerarquiaRow[]; // Todos los datos de la tabla
  id_empresa: number;             // El ID de la empresa que queremos mostrar
  nombre_empresa?: string;        // Opcional, para ponerle título
}

// ==========================================
// COMPONENTE RECURSIVO (Dibuja cada "ramita" del árbol)
// ==========================================
const NodoJerarquia = ({ nodo, nivel = 0 }: { nodo: JerarquiaNode; nivel?: number }) => {
  // Por defecto, abrimos el primer nivel (0), y cerramos los demás
  const [expandido, setExpandido] = useState(nivel === 0);
  const tieneHijos = nodo.children && nodo.children.length > 0;

  // Elegimos un ícono dependiendo del nivel para que se vea más jerárquico
  const Icono = nivel === 0 ? Building2 : (tieneHijos ? FolderTree : Users);

  return (
    <div className="select-none">
      <div 
        className={`flex items-center py-1.5 px-2 rounded-md hover:bg-slate-100 cursor-pointer transition-colors ${nivel === 0 ? 'bg-slate-50 font-bold border pb-2 mt-2' : ''}`}
        onClick={() => tieneHijos && setExpandido(!expandido)}
      >
        <div className="w-5 flex items-center justify-center mr-1">
          {tieneHijos ? (
            expandido ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronRight className="w-4 h-4 text-slate-500" />
          ) : (
            <span className="w-4 h-4" /> // Espacio en blanco si no tiene hijos para alinear
          )}
        </div>

        <Icono className={`w-4 h-4 mr-2 ${nivel === 0 ? 'text-blue-600' : 'text-slate-400'}`} />
        
        <span className={`text-sm ${nivel === 0 ? 'text-slate-800 uppercase tracking-wide' : 'text-slate-700'}`}>
          {nodo.nombre_seccion || 'Sin nombre'}
        </span>
      </div>

      {expandido && tieneHijos && (
        <div className="ml-5 pl-2 border-l border-slate-200 mt-1 space-y-1">
          {nodo.children.map(hijo => (
            <NodoJerarquia key={hijo.id} nodo={hijo} nivel={nivel + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================
export default function OrganigramaEmpresa({ jerarquiaCruda, id_empresa, nombre_empresa }: OrganigramaEmpresaProps) {
  
  // 2. El algoritmo que convierte la lista plana en Árbol (Usamos useMemo para no recalcularlo a cada rato)
  const arbolJerarquia = useMemo(() => {
    // A. Filtramos solo los datos de ESTA empresa
    const datosEmpresa = jerarquiaCruda.filter(item => item.id_empresa === id_empresa);

    // B. Preparamos el mapa y el árbol base
    const mapa = new Map<number, JerarquiaNode>();
    const raices: JerarquiaNode[] = [];

    // Llenamos el mapa con todos los nodos y les agregamos el arreglo vacío de "children"
    datosEmpresa.forEach(item => {
      mapa.set(item.id, { ...item, children: [] });
    });

    // C. Armamos el árbol conectando hijos con padres
    datosEmpresa.forEach(item => {
      const nodoActual = mapa.get(item.id)!;
      
      // Si no tiene padre, o su padre no existe en esta empresa, es un nodo raíz (Nivel 0)
      if (item.id_padre === null || !mapa.has(item.id_padre)) {
        raices.push(nodoActual);
      } else {
        // Si tiene padre, lo buscamos y le metemos este nodo en su pancita (children)
        const nodoPadre = mapa.get(item.id_padre)!;
        nodoPadre.children.push(nodoActual);
      }
    });

    return raices;
  }, [jerarquiaCruda, id_empresa]);

  if (arbolJerarquia.length === 0) {
    return (
      <div className="p-4 border rounded-lg bg-slate-50 text-slate-500 text-sm text-center">
        No hay jerarquía definida para esta empresa.
      </div>
    );
  }

  return (
    <div className="border rounded-xl shadow-sm bg-white p-4 h-full">
      {nombre_empresa && (
        <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2">
          Organigrama: {nombre_empresa}
        </h3>
      )}
      
      <div className="overflow-x-auto">
        <div className="min-w-max">
          {arbolJerarquia.map(nodoRaiz => (
            <NodoJerarquia key={nodoRaiz.id} nodo={nodoRaiz} />
          ))}
        </div>
      </div>
    </div>
  );
}*/
'use client'

import React, { useState, useMemo } from 'react';
import { ChevronRight, ChevronDown, Building2, FolderTree, Briefcase, User } from 'lucide-react';
import { useNombreEmpleado } from "@/components/providers/NombreEmpleadoProvider";
// ==========================================
// 1. INTERFACES (Tus tablas de la BD)
// ==========================================
export interface JerarquiaRow {
  id: number;
  nombre_seccion: string | null;
  id_tipo: number | null;
  id_padre: number | null;
  id_empresa: number | null | undefined;
}

export interface PuestoRow {
  id: number;
  nombre_puesto: string | null;
  id_seccion_jerarquica: number | null;
  id_empresa: number | null;
}

// Representa la unión entre empleado_puesto y empleados
export interface EmpleadoPuestoInfo {
  id_puesto: number | null;
  id_empleado: string | null;
}

// Interfaces extendidas para armar el Árbol en memoria
interface PuestoNode extends PuestoRow {
  empleados: EmpleadoPuestoInfo[];
}

interface JerarquiaNode extends JerarquiaRow {
  children: JerarquiaNode[];
  puestos: PuestoNode[]; // 👈 ¡Nueva propiedad!
}

interface OrganigramaEmpresaProps {
  jerarquiaCruda: JerarquiaRow[];
  puestosCrudos: PuestoRow[];
  empleadosAsignados: EmpleadoPuestoInfo[];
  id_empresa: number;
  nombre_empresa?: string;
}

// ==========================================
// COMPONENTE RECURSIVO (Dibuja la rama, los puestos y la gente)
// ==========================================
const NodoJerarquia = ({ nodo, nivel = 0 }: { nodo: JerarquiaNode; nivel?: number }) => {
  const [expandido, setExpandido] = useState(nivel === 0);
  const tieneHijos = nodo.children.length > 0;
  const tienePuestos = nodo.puestos.length > 0;
  const esExpandible = tieneHijos || tienePuestos;
  const { getNombreEmpleadoPorId } = useNombreEmpleado();

  const Icono = nivel === 0 ? Building2 : FolderTree;

  return (
    <div className="select-none">
      {/* NODO DE JERARQUÍA (La Carpeta) */}
      <div 
        className={`flex items-center py-1.5 px-2 rounded-md hover:bg-slate-100 cursor-pointer transition-colors ${nivel === 0 ? 'bg-slate-50 font-bold border pb-2 mt-2' : ''}`}
        onClick={() => esExpandible && setExpandido(!expandido)}
      >
        <div className="w-5 flex items-center justify-center mr-1">
          {esExpandible ? (
            expandido ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronRight className="w-4 h-4 text-slate-500" />
          ) : <span className="w-4 h-4" />}
        </div>
        <Icono className={`w-4 h-4 mr-2 ${nivel === 0 ? 'text-blue-600' : 'text-slate-400'}`} />
        <span className={`text-sm ${nivel === 0 ? 'text-slate-800 uppercase tracking-wide' : 'text-slate-700 font-medium'}`}>
          {nodo.nombre_seccion || 'Sin nombre'}
        </span>
      </div>

      {/* SI ESTÁ EXPANDIDO, DIBUJAMOS SU CONTENIDO */}
      {expandido && esExpandible && (
        <div className="ml-5 pl-2 border-l border-slate-200 mt-1 space-y-1">
          
          {/* 1. Dibujamos los Puestos de esta sección */}
          {nodo.puestos.map(puesto => (
            <div key={`puesto-${puesto.id}`} className="py-1">
              {/* Título del Puesto */}
              <div className="flex items-center text-sm text-slate-600 font-medium px-2 py-1 bg-amber-50/50 rounded-md border border-amber-100/50">
                <Briefcase className="w-3.5 h-3.5 mr-2 text-amber-500" />
                {puesto.nombre_puesto}
              </div>
              
              {/* Empleados dentro del Puesto */}
              <div className="ml-4 mt-1 border-l border-amber-100 pl-2 space-y-1">
                {puesto.empleados.length === 0 ? (
                  <div className="text-xs text-slate-400 italic px-2 py-0.5">Vacante</div>
                ) : (
                  puesto.empleados.map(emp => (
                    <div key={emp.id_empleado} className="flex items-center text-sm text-slate-600 px-2 py-1 hover:bg-slate-50 rounded">
                      <User className="w-3 h-3 mr-2 text-blue-400" />
                      {`${emp.id_empleado ? getNombreEmpleadoPorId(emp.id_empleado)?.nombre_corto:'etc'}`}
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}

          {/* 2. Dibujamos las sub-secciones (Recursividad) */}
          {nodo.children.map(hijo => (
            <NodoJerarquia key={hijo.id} nodo={hijo} nivel={nivel + 1} />
          ))}
          
        </div>
      )}
    </div>
  );
};

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================
export default function OrganigramaEmpresa({ 
  jerarquiaCruda, 
  puestosCrudos, 
  empleadosAsignados, 
  id_empresa, 
  nombre_empresa 
}: OrganigramaEmpresaProps) {
  
  
  // Algoritmo de "Ensamblaje del Árbol"
  const arbolJerarquia = useMemo(() => {
    // 1. Filtramos los datos para esta empresa específica
    const datosEmpresa = jerarquiaCruda.filter(item => item.id_empresa === id_empresa);
    const puestosEmpresa = puestosCrudos.filter(item => item.id_empresa === id_empresa);

    const mapaJerarquia = new Map<number, JerarquiaNode>();
    const mapaPuestos = new Map<number, PuestoNode>();
    const raices: JerarquiaNode[] = [];

    // 2. Preparamos los Puestos (inyectándoles sus empleados)
    puestosEmpresa.forEach(puesto => {
      mapaPuestos.set(puesto.id, { 
        ...puesto, 
        empleados: empleadosAsignados.filter(emp => emp.id_puesto === puesto.id) 
      });
    });

    // 3. Preparamos la Jerarquía (inyectándole arreglos vacíos para hijos y puestos)
    datosEmpresa.forEach(item => {
      mapaJerarquia.set(item.id, { ...item, children: [], puestos: [] });
    });

    // 4. Asignamos los Puestos a su Sección de Jerarquía correspondiente
    mapaPuestos.forEach(puesto => {
      if (puesto.id_seccion_jerarquica && mapaJerarquia.has(puesto.id_seccion_jerarquica)) {
        mapaJerarquia.get(puesto.id_seccion_jerarquica)!.puestos.push(puesto);
      }
    });

    // 5. Asignamos los Hijos a sus Padres (Ensamblaje final del Árbol)
    datosEmpresa.forEach(item => {
      const nodoActual = mapaJerarquia.get(item.id)!;
      
      if (item.id_padre === null || !mapaJerarquia.has(item.id_padre)) {
        raices.push(nodoActual); // Es el jefe máximo
      } else {
        const nodoPadre = mapaJerarquia.get(item.id_padre)!;
        nodoPadre.children.push(nodoActual); // Se mete dentro de su padre
      }
    });

    return raices;
  }, [jerarquiaCruda, puestosCrudos, empleadosAsignados, id_empresa]);

  if (arbolJerarquia.length === 0) {
    return (
      <div className="p-4 border rounded-lg bg-slate-50 text-slate-500 text-sm text-center">
        No hay datos de organigrama para esta empresa.
      </div>
    );
  }

  return (
    <div className="border rounded-xl shadow-sm bg-white p-4 h-full">
      {nombre_empresa && (
        <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2">
          Organigrama: {nombre_empresa}
        </h3>
      )}
      
      <div className="overflow-x-auto">
        <div className="min-w-max">
          {arbolJerarquia.map(nodoRaiz => (
            <NodoJerarquia key={nodoRaiz.id} nodo={nodoRaiz} />
          ))}
        </div>
      </div>
    </div>
  );
}