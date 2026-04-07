'use client'

import { useState } from "react";
import { UserAvatar } from "@/components/reutilizables/UserAvatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import EmpresaLogo from '../../reutilizables/EmpresaLogo';
import { EditEmployee } from './EditEmployee'; 
import { Briefcase, Building2 } from "lucide-react";
import type { empleados } from "@/services/empleados";

interface EmployeeCardProps {
  empleado: empleados;
  empleado_puestos_map: Record<string, number[]>;
  puestos_map: Record<number, { nombre: string, id_seccion: number, id_empresa: number }>;
  secciones_map: Record<number, {nombre: string, id_empresa: number}>;
  empresas_map: Record<number, {nombre: string}>;
}

export function EmployeeCard({ empleado, empleado_puestos_map, puestos_map, secciones_map }: EmployeeCardProps) {
  // Estado para saber qué puesto se hizo clic para mostrar su sección
  const [puestoActivo, setPuestoActivo] = useState<number | null>(null);

  const nombreCompleto = `${empleado.nombres} ${empleado.apellido_paterno} ${empleado.apellido_materno || ''}`.trim();
  
  // Extraemos todos los IDs de puestos de este empleado específico
  const puestosIdsDelEmpleado = empleado_puestos_map[empleado.id] || [];

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3 border-b border-slate-100 mb-3">
        <div className="flex items-center space-x-4">
          <UserAvatar
            employeeId={empleado.id}
            name={nombreCompleto}
            className="w-16 h-16 shadow-sm border border-slate-100"
          />
          <div>
            <CardTitle className="text-lg leading-tight">{nombreCompleto}</CardTitle>
            <p className="text-xs text-gray-500 font-medium mt-1">
              Ingreso: {new Date(empleado?.fecha_ingreso).toLocaleDateString('es-MX')}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          
          {/* SECCIÓN DE MULTIPLES PUESTOS */}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center">
              <Briefcase className="w-3.5 h-3.5 mr-1"/> Puestos Asignados
            </p>
            
            {puestosIdsDelEmpleado.length === 0 ? (
              <p className="text-sm text-slate-400 italic">Sin puesto asignado</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {puestosIdsDelEmpleado.map(puestoId => (
                  <Badge 
                    key={puestoId} 
                    variant={puestoActivo === puestoId ? "default" : "secondary"}
                    className="cursor-pointer hover:bg-blue-100 transition-colors"
                    onClick={() => setPuestoActivo(puestoActivo === puestoId ? null : puestoId)}
                  > 
                    <EmpresaLogo id={puestos_map[puestoId]?.id_empresa} wyh={20} />
                    {puestos_map[puestoId]?.nombre || 'Puesto Desconocido'}
                  </Badge>
                ))}
              </div>
            )}
            
            {/* Detalle Dinámico: Se muestra al darle clic a una Badge */}
            {puestoActivo !== null && (
              <div className="mt-2 p-2 bg-blue-50/50 border border-blue-100 rounded-md text-sm animate-in fade-in zoom-in-95">
                <span className="flex items-center text-blue-800 font-medium mb-1">
                  <Building2 className="w-3.5 h-3.5 mr-1" /> Área / Departamento
                </span>
                <span className="text-slate-600 pl-4 block">
                  {secciones_map[puestos_map[puestoActivo]?.id_seccion]?.nombre || 'No pertenece a ninguna sección'}
                </span>
              </div>
            )}
          </div>

          {/* BOTONES DE ACCIÓN */}
          <div className="flex space-x-2 pt-2">
            <Button variant="outline" className="flex-1">Ver Ficha</Button>
            <EditEmployee empleado={empleado}/>
            
          </div>
          
        </div>
      </CardContent>
    </Card>
  );
}