'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { RegistroChequeo } from "@/services/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRealtimeChecadorRegistrosUsuario } from '@/hooks/useRealtimeChecadorRegistrosUsuario';


function formatTimestamp(timestamp: string | null | undefined): string {
    if (!timestamp) return '---';
    try {
        const [hours, minutes, seconds] = timestamp.split(':');
        const date = new Date();
        date.setHours(parseInt(hours), parseInt(minutes), parseInt(seconds || '0'));
        if (isNaN(date.getTime())) {
            return 'Hora inválida';
        }
        return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch (e) {
        return "---";
    }
}

export function ChecadorHistorial({ registros, userId }: { registros: RegistroChequeo[], userId: string }) {
    const registrosLocales = useRealtimeChecadorRegistrosUsuario(registros, userId);
    return (
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>Mis Chequeos de Hoy</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="border rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="font-semibold">Registro</TableHead>
                                <TableHead className="font-semibold">Tipo</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {registrosLocales?.map((registro) => (
                                <TableRow key={registro?.id}>
                                <TableCell>{formatTimestamp(registro?.registro)}</TableCell>
                                <TableCell>{registro?.tipo_registro}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
