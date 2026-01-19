import { supabase } from "@/lib/supabaseClient";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Define el tipo para un registro de empleado
type Empleado = {
  id: number;
  c_empleado: string;
  nombres: string;
  a_paterno: string;
  a_materno: string;
  horario: string;
  descanso: string;
  fecha_nacimiento: string;
  telefono: string;
  estado: number;
};

export default async function Home() {
  // Obtiene los datos de la tabla 'empleados'
  const { data: empleados, error } = await supabase
    .from("empleados")
    .select("*");

  if (error) {
    console.error("Error al obtener empleados:", error.message);
    return <main className="container mx-auto py-10"><p>Error al cargar los empleados.</p></main>;
  }

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
          {empleados && (empleados as Empleado[]).map((empleado) => (
            <TableRow key={empleado.id}>
              <TableCell>{empleado.c_empleado}</TableCell>
              <TableCell>{`${empleado.nombres} ${empleado.a_paterno} ${empleado.a_materno}`}</TableCell>
              <TableCell>{empleado.horario}</TableCell>
              <TableCell>{empleado.descanso}</TableCell>
              <TableCell>{empleado.fecha_nacimiento}</TableCell>
              <TableCell>{empleado.telefono}</TableCell>
              <TableCell>{empleado.estado}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </main>
  );
}
