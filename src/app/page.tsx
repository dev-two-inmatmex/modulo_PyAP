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

export default async function Home() {
  const { data: usuarios, error } = await supabase
    .from("usuarios")
    .select("*, usuarios_turnos ( horario_entrada, horario_salida, salida_descanso, regreso_descanso ), usuarios_estados ( estado )");

  const { data: turnos } = await supabase.from('usuarios_turnos').select('*');
  const { data: roles } = await supabase.from('usuarios_roles').select('*');

  if (error) {
    console.error("Error al obtener usuarios:", error.message);
    return <main className="container mx-auto py-10"><p>Error al cargar los usuarios.</p></main>;
  }

  return (
    <main className="container mx-auto py-10">
      <div className="flex justify-end mb-4">
        <AddEmployee turnos={turnos || []} roles={roles || []} />
      </div>
      <Table>
        <TableCaption>Lista de usuarios.</TableCaption>
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
              <TableCell>{(usuario.usuarios_turnos?.horario_entrada && usuario.usuarios_turnos?.horario_salida) ? `${usuario.usuarios_turnos.horario_entrada.slice(0,5)} - ${usuario.usuarios_turnos.horario_salida.slice(0,5)}` : 'N/A'}</TableCell>
              <TableCell>{(usuario.usuarios_turnos?.salida_descanso && usuario.usuarios_turnos?.regreso_descanso) ? `${usuario.usuarios_turnos.salida_descanso.slice(0,5)} - ${usuario.usuarios_turnos.regreso_descanso.slice(0,5)}` : 'N/A'}</TableCell>
              <TableCell>{usuario.telefono}</TableCell>
              <TableCell>{usuario.usuarios_estados?.estado ?? 'N/A'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </main>
  );
}
