import { createClient } from "@/lib/supabase/server";
import { EmployeeCard} from '@/components/EmployeeCard';
import {AddEmployee} from '@/components/AddEmployee'
import { SearchBar } from '@/components/SearchBar';

export default async function EmpleadosPage({ searchParams }: { searchParams: { query?: string } }) {
  const query = searchParams?.query || '';
  const supabase = await createClient();
  const {data: empleados, error } = await supabase
  .from('vista_lista_empleados')
  .select('*')
  .ilike('nombre_completo', `%${query}%`)
  .order('nombre_completo', { ascending: true });

  if (error){
    console.error('Error fetching employees:', error);
  }
  const { data: horarios } = await supabase.from('horarios').select('id, hora_entrada, hora_salida');
  const { data: descansos } = await supabase.from('descansos').select('id, inicio_descanso, final_descanso');
  const { data: puestos } = await supabase.from('puestos').select('id, nombre_puesto');
  const { data: ubicaciones } = await supabase.from('config_ubicaciones').select('id, nombre_ubicacion');
  const { data: estatuses } = await supabase.from('estatus').select('id, nombre_estatus');
  const { data: n_empleados} = await supabase.from('vista_total_empleados').select('n_empleados');

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-4xl font-bold">Empleados</h1>
      </div>
      <SearchBar />
      <AddEmployee
        horarios={horarios || []}
        descansos={descansos || []}
        puestos={puestos || []}
        ubicaciones={ubicaciones || []}
        estatuses={estatuses || []}
        n_empleados={n_empleados || ''}
        />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {empleados?.map(empleado => (
          <EmployeeCard
          key={empleado.id}
          empleado={empleado}
          />
        ))}
      </div>
      {empleados?.length === 0 && (
        <p className="text-center text-gray-500 mt-10">No se encontraron resultados para "{query}"</p>
      )}
    </div>
  );
}