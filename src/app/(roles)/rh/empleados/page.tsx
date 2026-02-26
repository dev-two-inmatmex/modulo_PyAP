import { createClient } from "@/lib/supabase/server";
import { EmployeeCard } from '@/components/EmployeeCard';
import { AddEmployee } from '@/components/AddEmployee'
import { SearchBar } from '@/components/SearchBar';

export default async function EmpleadosPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ query?: string }> 
}) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.query || '';
  const supabase = await createClient();
  const { data: empleados, error } = await supabase
    .from('vista_lista_empleados')
    .select('*')
    .ilike('nombre_completo', `%${query}%`)
    .order('nombre_completo', { ascending: true });

  if (error) {
    console.error('Error fetching employees:', error);
  }
  const { data: horarios } = await supabase.from('horarios').select('id, hora_entrada, hora_salida');
  const { data: descansos } = await supabase.from('descansos').select('id, inicio_descanso, fin_descanso');
  const { data: puestos } = await supabase.from('puestos').select('id, nombre_puesto');
  const { data: ubicaciones } = await supabase.from('config_ubicaciones').select('id, nombre_ubicacion');
  const { data: estatuses } = await supabase.from('estatus').select('id, nombre_estatus');
  const { count } = await supabase
    .from('empleados')
    .select('*', { count: 'exact', head: true });
    const n_empleados = (count || 0);
  const {data: edit_empleado} = await supabase
  .from('vista_empleado_datos_editables')
  .select('*')


  const paths = (empleados|| []).map(emp => `${emp.id}/avatar.webp`);
  let urlMap: Record<string, string> = {};
  if (paths.length > 0) {
    const { data: signedData, error: storageError } = await supabase.storage
      .from('avatars')
      .createSignedUrls(paths, 3600);

    if (storageError) {
      console.error('Error fetching signed URLs:', storageError);
    } else {
      // Creamos el mapa: { "id_empleado.webp": "https://..." }
      urlMap = Object.fromEntries(
        signedData?.map((item) => [item.path, item.signedUrl]) || []
      );
    }
  }
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-4xl font-bold mb-4">Empleados</h1>
        <AddEmployee
          horarios={horarios || []}
          descansos={descansos || []}
          puestos={puestos || []}
          ubicaciones={ubicaciones || []}
          estatuses={estatuses || []}
          n_empleados={String(n_empleados)}
        />
      </div>
      <div className="mb-4">
        <SearchBar />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {empleados?.map(empleado => {
          const avatarUrl = urlMap[`${empleado.id}/avatar.webp`];
          return(
          <EmployeeCard
            key={empleado.id}
            empleado={empleado}
            edit_empleado={edit_empleado}
            avatarUrl={avatarUrl}
          />
        )})}
      </div>
      {empleados?.length === 0 && (
        <p className="text-center text-gray-500 mt-10">No se encontraron resultados para "{query}"</p>
      )}
    </div>
  );
}