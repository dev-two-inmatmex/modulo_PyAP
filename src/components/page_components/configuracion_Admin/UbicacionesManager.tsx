'use client';

import { useState } from 'react';
import { UbicacionesTab, UbicacionConfig } from "@/components/page_components/configuracion_Admin/UbicacionesTab";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";

interface UbicacionesManagerProps {
  ubicaciones: UbicacionConfig[];
}

export function UbicacionesManager({ ubicaciones }: UbicacionesManagerProps) {
  const [vistaActual, setVistaActual] = useState<'lista' | 'editor'>('lista');
  const [ubicacionSeleccionada, setUbicacionSeleccionada] = useState<UbicacionConfig | null>(null);

  const handleSelectUbicacion = (ubicacion: UbicacionConfig) => {
    setUbicacionSeleccionada(ubicacion);
    setVistaActual('editor');
  };

  const handleNuevaUbicacion = () => {
    setUbicacionSeleccionada(null); // No hay selección para crear una nueva
    setVistaActual('editor');
  };

  const handleFinishEditing = () => {
    setVistaActual('lista');
    setUbicacionSeleccionada(null);
  };

  if (vistaActual === 'editor') {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{ubicacionSeleccionada ? 'Editar Ubicación' : 'Nueva Ubicación'}</CardTitle>
            </CardHeader>
            <CardContent>
                <UbicacionesTab 
                    ubicacionInicial={ubicacionSeleccionada}
                    onFinished={handleFinishEditing}
                />
            </CardContent>
        </Card>
    );
  }

  return (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Ubicaciones Registradas</CardTitle>
            <Button size="sm" onClick={handleNuevaUbicacion}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Nueva Ubicación
            </Button>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Latitud</TableHead>
                        <TableHead>Longitud</TableHead>
                        <TableHead className="text-right">Radio (m)</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {ubicaciones.map((ubicacion) => (
                        <TableRow key={ubicacion.id} onClick={() => handleSelectUbicacion(ubicacion)} className="cursor-pointer">
                            <TableCell className="font-medium">{ubicacion.nombre_ubicacion}</TableCell>
                            <TableCell>{ubicacion.latitud.toFixed(6)}</TableCell>
                            <TableCell>{ubicacion.longitud.toFixed(6)}</TableCell>
                            <TableCell className="text-right">{ubicacion.radio_permitido}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {ubicaciones.length === 0 && (
                <div className="text-center py-10 text-muted-foreground">
                    No hay ubicaciones registradas. Crea una para empezar.
                </div>
            )}
        </CardContent>
    </Card>
  );
}
