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
type Usuario = {
  id: string;
  creacion_usuario: string;
  nombres: string;
  a_paterno: string;
  a_materno: string;
  telefono: string;
  fecha_nacimiento: string;
  id_ext_rol: string;
  id_ext_estado: number;
  id_ext_turno: number | null;
  // Relaciones (pueden ser null si no tienen dato asignado)
  usuarios_turnos: {
    horario_entrada: string;
    horario_salida: string;
  } | null;
  usuarios_estados: {
    estado: string;
    descripcion: string;
  } | null;
  usuarios_roles: {
    rol: string;
    descripcion: string;
  } | null;
};

export default async function Home() {
  // Obtiene los datos de la tabla 'empleados'
  const { data: usuarios, error } = await supabase
    .from("usuarios")
    .select("*, usuarios_turnos ( horario_entrada, horario_salida ), usuarios_estados ( estado )");

  const { data: turnos } = await supabase.from('usuarios_turnos').select('*');

  if (error) {
    console.error("Error al obtener empleados:", error.message);
    return <main className="container mx-auto py-10"><p>Error al cargar los empleados.</p></main>;
  }

  return (
    <main className="container mx-auto py-10">
      <div className="flex justify-end mb-4">
      </div>
      <Table>
        <TableCaption>Lista de empleados.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>NOMBRE COMPLETO</TableHead>
            <TableHead>HORARIO</TableHead>
            <TableHead>DESCANSO</TableHead>
            <TableHead>TELÉFONO</TableHead>
            <TableHead>ESTADO</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {usuarios && (usuarios as any[]).map((usuario) => (
            <TableRow key={usuario.id}>
              <TableCell>{`${usuario.nombres} ${usuario.a_paterno} ${usuario.a_materno}`}</TableCell>
              <TableCell>{usuario.usuarios_turnos?.horario_entrada && usuario.usuarios_turnos?.horario_salida ? `${usuario.usuarios_turnos.horario_entrada.slice(0,5)} - ${usuario.usuarios_turnos.horario_salida.slice(0,5)}` : 'N/A'}</TableCell>
              <TableCell>{usuario.usuarios_turnos?.salida_descanso && usuario.usuarios_turnos?.regreso_descanso ? `${usuario.usuarios_turnos.salida_descanso.slice(0,5)} - ${usuario.usuarios_turnos.regreso_descanso.slice(0,5)}` : 'N/A'}</TableCell>
              <TableCell>{usuario.telefono}</TableCell>
              <TableCell>{usuario.usuarios_estados?.estado ?? 'N/A'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </main>
  );
}
