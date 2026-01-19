import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function Home() {
  return (
    <main className="container mx-auto py-10">
      <Table>
        <TableCaption>Una lista de sus empleados.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>DÍA DE CREACIÓN</TableHead>
            <TableHead>NOMBRE COMPLETO</TableHead>
            <TableHead>HORARIO</TableHead>
            <TableHead>DESCANSO</TableHead>
            <TableHead>FECHA NACIMIENTO</TableHead>
            <TableHead>TELÉFONO</TableHead>
            <TableHead>ESTADO</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>2024-01-15</TableCell>
            <TableCell>Juan Perez</TableCell>
            <TableCell>09:00 - 18:00</TableCell>
            <TableCell>Sábado, Domingo</TableCell>
            <TableCell>1990-05-20</TableCell>
            <TableCell>555-1234</TableCell>
            <TableCell>Activo</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>2024-01-16</TableCell>
            <TableCell>Maria Garcia</TableCell>
            <TableCell>10:00 - 19:00</TableCell>
            <TableCell>Jueves, Viernes</TableCell>
            <TableCell>1988-11-30</TableCell>
            <TableCell>555-5678</TableCell>
            <TableCell>Inactivo</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </main>
  );
}
