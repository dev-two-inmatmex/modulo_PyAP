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
interface Telefono {
  numero_telefonico: string;
}

interface Empleado {
  id: string;
  nombres: string;
  apellido_paterno: string;
  apellido_materno: string;
  fecha_nacimiento: string;
  sexo: string;
  direccion: string;
  usuario_telefonos: Telefono[];
  fecha_alta_sistema: string;
  fecha_ingreso: string;
  estatus: { nombre_estatus: string } | null;
}

export default async function Home() {
  const { data: dataRaw, error } = await supabase
    .from("empleados")
    .select("*, estatus ( nombre_estatus ), usuario_telefonos ( numero_telefonico )");

  const Empleados = dataRaw as unknown as Empleado[];
  /*const { data: horarios } = await supabase.from('usuarios_horarios').select('*');
  const { data: descansos } = await supabase.from('usuarios_descansos').select('*');
  const { data: roles } = await supabase.from('usuarios_roles').select('*');*/

  if (error) {
    console.error("Error al obtener usuarios:", error.message);
    return <main className="container mx-auto py-10"><p>Error al cargar los usuarios.</p></main>;
  }

  return (
    <main className="container mx-auto py-10">
      <div className="flex justify-end mb-4">
        {/*<AddEmployee horarios={horarios || []} descansos={descansos || []} />*/}
      </div>
      <Table>
        <TableCaption>Lista de usuarios registrado en el sistema.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>NOMBRE COMPLETO</TableHead>
            <TableHead>SEXO</TableHead>
            <TableHead>DIRECCIÓN</TableHead>
            <TableHead>TELÉFONO</TableHead>
            <TableHead>ESTADO</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Empleados?.map((Empleado) => (
            <TableRow key={Empleado.id}>
              <TableCell>{`${Empleado.nombres} ${Empleado.apellido_paterno} ${Empleado.apellido_materno}`}</TableCell>
              <TableCell>{Empleado.sexo}</TableCell>
              <TableCell>{Empleado.direccion}</TableCell>
              <TableCell>{Empleado.usuario_telefonos && Empleado.usuario_telefonos.length > 0 ? (
                <ul>{Empleado.usuario_telefonos.map((tel, index) => (
                  <li key={index}>{tel.numero_telefonico}</li>)
                  )}
                </ul>
                ):(<span className="text-gray-400 italic text-xs">Sin teléfonos.</span>)}</TableCell>
              {/*<TableCell>{(usuario.usuarios_horarios?.horario_entrada && usuario.usuarios_horarios?.horario_salida) ? `${usuario.usuarios_horarios.horario_entrada.slice(0,5)} - ${usuario.usuarios_horarios.horario_salida.slice(0,5)}` : 'N/A'}</TableCell>
              <TableCell>{(usuario.usuarios_descansos?.descanso_inicio && usuario.usuarios_descansos?.descanso_final) ? `${usuario.usuarios_descansos.descanso_inicio.slice(0,5)} - ${usuario.usuarios_descansos.descanso_final.slice(0,5)}` : 'N/A'}</TableCell>
              <TableCell>{(usuario.usuarios_roles?.rol ?? 'N/A')}</TableCell>*/}
              <TableCell>{Empleado.estatus?.nombre_estatus ?? 'N/A'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </main>
  );
}
