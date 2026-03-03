import { createClient } from "@/lib/supabase/server";
import DirectorioEmpleados from "@/components/page_components/empleados/DirectorioEmpleados";

import { getAvatarsMap } from "@/utils/storage";
// TODO: Convertir en client component y mover la logica de supabase a un action.

export default async function EmpleadosPage() {

  const supabase = await createClient();
  const { data: empleados, error } = await supabase
    .from('vista_lista_empleados')
    .select('*');

  if (error) {
    console.error("Error fetching empleados:", error);
    // Handle error appropriately, maybe return an error message
    return <div>Error al cargar los empleados.</div>;
  }

  // Fetch additional data needed for filters
  const { data: puestos } = await supabase.from('puestos').select('id, nombre_puesto');
  const { data: areas } = await supabase.from('areas').select('id, nombre_area');
  const { data: horarios } = await supabase.from('horarios').select('id, hora_entrada, hora_salida');
  const { data: descansos } = await supabase.from('descansos').select('id, inicio_descanso, fin_descanso');
  const { data: ubicaciones } = await supabase.from('config_ubicaciones').select('id, nombre_ubicacion');
  const { data: estatuses } = await supabase.from('estatus').select('id, nombre_estatus');
  const { count } = await supabase
    .from('empleados')
    .select('*', { count: 'exact', head: true });
    const n_empleados = (count || 0);
  const empleadosIds = empleados?.map(empleado => empleado.id) || [];
  const avatarUrls = await getAvatarsMap(empleadosIds);

  return (
    <div className="container mx-auto py-1">
      <h1 className="text-2xl font-bold mb-2">Directorio de Empleados</h1>
      <DirectorioEmpleados 
        empleados={empleados || []}
        avatarUrls={avatarUrls}
        ubicaciones={ubicaciones || []}
        estatuses={estatuses || []}
        puestos={puestos || []}
        areas={areas || []}
        horarios={horarios || []}
        descansos={descansos || []}
        n_empleados={n_empleados}
      />
    </div>
  );
}