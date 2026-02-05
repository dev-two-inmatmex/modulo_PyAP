import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { RegistroChequeo } from "@/lib/types";
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

const tipoRegistroMap: Record<string, string> = {
    'entrada': 'Entrada',
    'salida_descanso': 'Salida a Descanso',
    'regreso_descanso': 'Regreso de Descanso',
    'salida': 'Salida',
};

export function ChecadorHistorial({ registros }: { registros: RegistroChequeo[] | null }) {
    const hasRecords = registros && registros.length > 0;

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
                                <TableHead className="font-semibold">Tipo de Registro</TableHead>
                                <TableHead className="font-semibold text-right">Hora</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {hasRecords && registros ? (
                                registros.map((registro) => (
                                    <TableRow key={registro.id}>
                                        <TableCell className="capitalize">{tipoRegistroMap[registro.tipo] || registro.tipo.replace(/_/g, ' ')}</TableCell>
                                        <TableCell className="text-right">{formatTimestamp(registro.registro)}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={2} className="text-center text-muted-foreground h-24">
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
