'use client';

import { useState, useTransition } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { AlertCircle, Camera } from "lucide-react";
// Importamos tu escáner
import { ScannerBiometrico } from '@/components/reutilizables/ScannerBiometrico';
import { enviarSolicitudRetardo } from '@/app/(shared)/checador/actions';

export function SolicitudTardiaDialog({ id_empleado, hora_esperada, ubicacion, formatosBD, solicitud }: any) {
    const [open, setOpen] = useState(false);
    const [motivo, setMotivo] = useState("");
    const [isPending, startTransition] = useTransition();

    // Ahora recibimos el descriptor facial del escáner
    const handleSubmit = (faceDescriptor: number[]) => {
        if (motivo.trim().length < 10) {
            toast.error("Por favor, explica brevemente el motivo de tu retardo.");
            return;
        }

        startTransition(async () => {
            const result = await enviarSolicitudRetardo(
                id_empleado, 
                formatosBD.dateInTimezone, 
                formatosBD.timeInTimezone, 
                hora_esperada,
                ubicacion.id, 
                motivo,
                faceDescriptor // Pasamos el rostro al backend
            );
            
            if (result.success) {
                toast.success("Solicitud enviada a Recursos Humanos.");
                setOpen(false);
                setMotivo(""); // Limpiamos por si acaso
            } else {
                toast.error(result.message);
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="w-full text-lg py-6 bg-amber-600 hover:bg-amber-700 text-white" size="lg" disabled={!ubicacion || solicitud.length > 0}>
                    <AlertCircle className="mr-2 h-6 w-6" /> Pedir Acceso por Retardo
                </Button>
            </DialogTrigger>
            
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Registro de Retardo</DialogTitle>
                    <DialogDescription>
                        Has excedido el límite de tolerancia de 30 minutos. Escribe el motivo y usa el escáner facial para enviar la solicitud a Recursos Humanos.
                    </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                    <Textarea 
                        placeholder="Escribe el motivo de tu retardo (Ej. Tráfico pesado, accidente en el transporte...)" 
                        value={motivo}
                        onChange={(e) => setMotivo(e.target.value)}
                        className="min-h-25"
                        disabled={isPending}
                    />
                </div>
                
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
                        Cancelar
                    </Button>
                    
                    {/* AQUÍ ESTÁ LA MAGIA: El botón de enviar ahora dispara la cámara */}
                    <ScannerBiometrico onResult={handleSubmit}>
                        <Button disabled={isPending || motivo.trim().length < 10} className="bg-amber-600 hover:bg-amber-700">
                            {isPending ? "Enviando..." : <><Camera className="mr-2 h-4 w-4" /> Escanear y Enviar</>}
                        </Button>
                    </ScannerBiometrico>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}