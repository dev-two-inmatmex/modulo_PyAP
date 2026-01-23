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
    .select("*, usuarios_horarios ( horario_entrada, horario_salida ), usuarios_descansos ( descanso_inicio, descanso_final ), usuarios_estados ( estado ), usuarios_roles ( rol ), telefonos_usuarios (numero_telefonico)");

  const { data: turnos } = await supabase.from('usuarios_turnos').select('*');
  const { data: roles } = await supabase.from('usuarios_roles').select('*');

  if (error) {
    console.error("Error al obtener usuarios:", error.message);
    return <main className="container mx-auto py-10"><p>Error al cargar los usuarios.</p></main>;
  }

  return (
    <main className="container mx-auto py-10">
      <div className="flex justify-end mb-4">
        {/*<AddEmployee turnos={turnos || []} roles={roles || []} />*/}
      </div>
      <Table>
        <TableCaption>Lista de usuarios.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>NOMBRE COMPLETO</TableHead>
            <TableHead>DIRECCIÓN</TableHead>
            <TableHead>TELÉFONO</TableHead>
            <TableHead>EMAIL</TableHead>
            <TableHead>HORARIO</TableHead>
            <TableHead>DESCANSO</TableHead>
            <TableHead>ROL</TableHead>
            <TableHead>ESTADO</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {usuarios && (usuarios as any[]).map((usuario) => (
            <TableRow key={usuario.id}>
              <TableCell>{`${usuario.nombres} ${usuario.a_paterno} ${usuario.a_materno}`}</TableCell>
              <TableCell>{usuario.direccion}</TableCell>
              <TableCell></TableCell>
              <TableCell>{usuario.email}</TableCell>
              <TableCell>{(usuario.usuarios_horarios?.horario_entrada && usuario.usuarios_horarios?.horario_salida) ? `${usuario.usuarios_horarios.horario_entrada.slice(0,5)} - ${usuario.usuarios_horarios.horario_salida.slice(0,5)}` : 'N/A'}</TableCell>
              <TableCell>{(usuario.usuarios_descansos?.descanso_inicio && usuario.usuarios_descansos?.descanso_final) ? `${usuario.usuarios_descansos.descanso_inicio.slice(0,5)} - ${usuario.usuarios_descansos.descanso_final.slice(0,5)}` : 'N/A'}</TableCell>
              <TableCell>{(usuario.usuarios_roles?.rol ?? 'N/A')}</TableCell>
              <TableCell>{usuario.usuarios_estados?.estado ?? 'N/A'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </main>
  );
}
