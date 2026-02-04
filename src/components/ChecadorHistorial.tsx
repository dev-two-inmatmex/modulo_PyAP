import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { Turno_Realizandose } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function formatTimestamp(timestamp: string | null | undefined): string {
    if (!timestamp) return '---';
    try {
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) {
            return 'Hora inválida';
        }
        return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch (e) {
        return "---";
    }
}


export function ChecadorHistorial({ turnos }: { turnos: Turno_Realizandose[] }) {
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
                            {turnos.length > 0 ? (
                                turnos.map((tc) => (
                                    <TableRow key={tc.id}>
                                        <TableCell>{formatTimestamp(tc.entrada)}</TableCell>
                                        <TableCell>{formatTimestamp(tc.salida_descanso)}</TableCell>
                                        <TableCell>{formatTimestamp(tc.regreso_descanso)}</TableCell>
                                        <TableCell>{formatTimestamp(tc.salida)}</TableCell>
                                    </TableRow>
                                ))
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
