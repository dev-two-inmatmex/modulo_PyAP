import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { TurnoHoy } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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


export function ChecadorHistorial({ turnoHoy }: { turnoHoy: TurnoHoy | null }) {
    const hasRecords = turnoHoy && Object.values(turnoHoy).some(val => val !== null);

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
                                <TableHead className="font-semibold">Entrada</TableHead>
                                <TableHead className="font-semibold">Salida a Descanso</TableHead>
                                <TableHead className="font-semibold">Regreso de Descanso</TableHead>
                                <TableHead className="font-semibold">Salida</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {hasRecords && turnoHoy ? (
                                <TableRow>
                                    <TableCell>{formatTimestamp(turnoHoy.entrada)}</TableCell>
                                    <TableCell>{formatTimestamp(turnoHoy.salida_descanso)}</TableCell>
                                    <TableCell>{formatTimestamp(turnoHoy.regreso_descanso)}</TableCell>
                                    <TableCell>{formatTimestamp(turnoHoy.salida)}</TableCell>
                                </TableRow>
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center text-muted-foreground h-24">
                                        No hay registros de chequeo para hoy.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
