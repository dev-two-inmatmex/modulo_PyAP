'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmployeeCardProps } from "@/services/types";
import { EditEmployee } from './EditEmployee'; // Import the new component
import { UserAvatar } from "@/components/reutilizables/UserAvatar";

export function EmployeeCard({ empleado, avatarUrl }: EmployeeCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-4">
          <UserAvatar
            url={avatarUrl}
            name={empleado.nombre_completo}
            className="w-24 h-24 mb-4"
          />
          <div>
            <CardTitle>{empleado.nombre_completo}</CardTitle>
            <p className="text-sm text-gray-500">{empleado.puesto}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p><strong>Puesto:</strong> {empleado.puesto || 'ninguno'}</p>
          <p><strong>Área:</strong> {empleado.area || 'ninguno'}</p>
          <p><strong>Estatus:</strong> {empleado.estatus}</p>
          <div className="flex space-x-2">
            <Button variant="outline">Ver Ficha</Button>
            <EditEmployee
              empleado={empleado}
              avatarUrl={avatarUrl}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
