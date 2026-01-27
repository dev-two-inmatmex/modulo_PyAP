
import { createClient } from '@/lib/Supabase/server'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { AddEmployee } from '@/components/AddEmployee'

// Define interfaces based on the database schema
interface Telefono {
  numero_telefonico: string;
}

interface Horario {
  horario_entrada: string;
  horario_salida: string;
}

interface Descanso {
  descanso_inicio: string;
  descanso_final: string;
}

interface Rol {
  rol: string;
}

interface Estado {
  nombre_estado: string;
}

interface Usuario {
  id: string;
  nombres: string;
  a_paterno: string;
  a_materno: string;
  pago_dia: number;
  telefonos_usuarios: Telefono[];
  usuarios_horarios: Horario | null;
  usuarios_descansos: Descanso | null;
  usuarios_roles: Rol | null;
  usuarios_estados: Estado | null;
}

export default async function PerfilPage() {
  const supabase = await createClient()

  // Fetch data with the server client
  const { data: dataRaw, error } = await supabase
    .from('usuarios')
    .select(`
      id,
      nombres,
      a_paterno,
      a_materno,
      pago_dia,
      telefonos_usuarios ( numero_telefonico ),
      usuarios_horarios ( horario_entrada, horario_salida ),
      usuarios_descansos ( descanso_inicio, descanso_final ),
      usuarios_roles ( rol ),
      usuarios_estados ( nombre_estado )
    `);

  const usuarios = dataRaw as unknown as Usuario[]
  const { data: horarios } = await supabase.from('usuarios_horarios').select('*')
  const { data: descansos } = await supabase.from('usuarios_descansos').select('*')
  const { data: roles } = await supabase.from('usuarios_roles').select('*')

  if (error) {
    console.error('Error al obtener usuarios:', error.message)
    return <main className="container mx-auto py-10"><p>Error al cargar los usuarios.</p></main>
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-end mb-4">
        <AddEmployee 
          horarios={horarios || []} 
          descansos={descansos || []}
          roles={roles || []}
        />
      </div>
      <Table>
        <TableCaption>Lista de usuarios registrados en el sistema.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>NOMBRE COMPLETO</TableHead>
            <TableHead>PAGO POR DÍA</TableHead>
            <TableHead>TELÉFONO</TableHead>
            <TableHead>HORARIO</TableHead>
            <TableHead>DESCANSO</TableHead>
            <TableHead>ROL</TableHead>
            <TableHead>ESTADO</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {usuarios?.map((usuario) => (
            <TableRow key={usuario.id}>
              <TableCell>{`${usuario.nombres} ${usuario.a_paterno} ${usuario.a_materno}`}</TableCell>
              <TableCell>${usuario.pago_dia}</TableCell>
              <TableCell>{usuario.telefonos_usuarios && usuario.telefonos_usuarios.length > 0 ? (
                <ul>{usuario.telefonos_usuarios.map((tel, index) => (
                  <li key={index}>{tel.numero_telefonico}</li>)
                  )}
                </ul>
                ):(<span className="text-gray-400 italic text-xs">Sin teléfonos.</span>)}</TableCell>
              <TableCell>{(usuario.usuarios_horarios?.horario_entrada && usuario.usuarios_horarios?.horario_salida) ? `${usuario.usuarios_horarios.horario_entrada.slice(0,5)} - ${usuario.usuarios_horarios.horario_salida.slice(0,5)}` : 'N/A'}</TableCell>
              <TableCell>{(usuario.usuarios_descansos?.descanso_inicio && usuario.usuarios_descansos?.descanso_final) ? `${usuario.usuarios_descansos.descanso_inicio.slice(0,5)} - ${usuario.usuarios_descansos.descanso_final.slice(0,5)}` : 'N/A'}</TableCell>
              <TableCell>{(usuario.usuarios_roles?.rol ?? 'N/A')}</TableCell>
              <TableCell>{usuario.usuarios_estados?.nombre_estado ?? 'N/A'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
