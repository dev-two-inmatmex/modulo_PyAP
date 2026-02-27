'use client'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmployeeCardProps } from "@/services/types";
import { EditEmployee } from './EditEmployee'; // Import the new component


export function EmployeeCard({ empleado, edit_empleado, avatarUrl }: EmployeeCardProps) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="w-24 h-24 mb-4">
              {/* Added a timestamp to the URL to bypass browser cache */}
              <AvatarImage 
                src={avatarUrl}
                alt={empleado.nombre_completo} 
              />
              <AvatarFallback>{empleado.nombre_completo.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{empleado.nombre_completo}</CardTitle>
              <p className="text-sm text-gray-500">{empleado.puesto}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
          <p><strong>Puesto:</strong> {empleado.puesto ||'ninguno'}</p>
            <p><strong>Área:</strong> {empleado.area || 'ninguno'}</p>
            <p><strong>Estatus:</strong> {empleado.estatus}</p>
            <div className="flex space-x-2">
              <Button variant="outline">Ver Ficha</Button>
              <EditEmployee 
              empleado={empleado}
              edit_empleado={edit_empleado} 
              avatarUrl={avatarUrl}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    );
}
