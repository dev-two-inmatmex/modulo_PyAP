import { createClient } from "@/lib/supabase/server";
import { EmployeeCard, Employee } from '@/components/EmployeeCard';
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

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-4xl font-bold">Empleados</h1>
      </div>
      <SearchBar />
      {/*<AddEmployee/>*/}
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