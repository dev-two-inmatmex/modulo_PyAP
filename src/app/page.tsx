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
import { AddEmployee } from "@/components/AddEmployee";

// Define el tipo para un registro de empleado
type Empleado = {
  id: number;
  c_empleado: string;
  nombres: string;
  a_paterno: string;
  a_materno: string;
  telefono: string;
  fecha_nacimiento: string;
  id_ext_estado: number;
  id_ext_horario: number | null;
  id_ext_descanso: number | null;
  // Relaciones (pueden ser null si no tienen dato asignado)
  empleados_horarios: {
    h_entrada: string;
    h_salida: string;
  } | null;
  empleados_descansos: {
    d_salida: string;
    d_regreso: string;
  } | null;
  empleados_estados: {
    estado: string;
  } | null;
};

export default async function Home() {
  // Obtiene los datos de la tabla 'empleados'
  const { data: empleados, error } = await supabase
    .from("empleados")
    .select("*, empleados_horarios ( h_entrada, h_salida ), empleados_descansos ( d_salida, d_regreso ), empleados_estados ( estado )");

  const { data: horarios } = await supabase.from('empleados_horarios').select('*');
  const { data: descansos } = await supabase.from('empleados_descansos').select('*');

  if (error) {
    console.error("Error al obtener empleados:", error.message);
    return <main className="container mx-auto py-10"><p>Error al cargar los empleados.</p></main>;
  }

  return (
    <main className="container mx-auto py-10">
      <div className="flex justify-end mb-4">
        <AddEmployee horarios={horarios || []} descansos={descansos || []} />
      </div>
      <Table>
        <TableCaption>nempleados.</TableCaption>
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
              <TableCell>{new Date(empleado.c_empleado).toLocaleDateString()}</TableCell>
              <TableCell>{`${empleado.nombres} ${empleado.a_paterno} ${empleado.a_materno}`}</TableCell>
              <TableCell>{empleado.empleados_horarios ? `${empleado.empleados_horarios.h_entrada.slice(0,5)} - ${empleado.empleados_horarios.h_salida.slice(0,5)}` : 'N/A'}</TableCell>
              <TableCell>{empleado.empleados_descansos ? `${empleado.empleados_descansos.d_salida.slice(0,5)} - ${empleado.empleados_descansos.d_regreso.slice(0,5)}` : 'N/A'}</TableCell>
              <TableCell>{empleado.fecha_nacimiento}</TableCell>
              <TableCell>{empleado.telefono}</TableCell>
              <TableCell>{empleado.empleados_estados?.estado ?? 'N/A'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </main>
  );
}
