import { createServidorClient } from "@/lib/supabase/server";
import DirectorioEmpleados from "@/components/page_components/empleados/DirectorioEmpleados";
import { getEmpleados, getEmpleadoPuestos } from "@/services/empleados";
import { getPuestos, getSecciones } from "@/services/puestos-secciones";
import { getEmpresas } from "@/services/empresas";

export default async function EmpleadosPage() {
  const supabase = await createServidorClient();
  
  // 1. Traemos los datos desde los servicios
  const empleados = await getEmpleados();
  const puestos = await getPuestos();
  const secciones = await getSecciones();
  const empleado_puestos = await getEmpleadoPuestos();
  const empresas = await getEmpresas();

  // 2. Traemos catálogos adicionales directamente con Supabase (como en tu código original)
  const { data: horarios } = await supabase.from('horarios').select('id, hora_entrada, hora_salida');
  const { data: descansos } = await supabase.from('descansos').select('id, inicio_descanso, fin_descanso');
  const { data: ubicaciones } = await supabase.from('config_ubicaciones').select('id, nombre_ubicacion');
  const { data: estatuses } = await supabase.from('estatus').select('id, nombre_estatus');

  const { count } = await supabase.from('empleados').select('*', { count: 'exact', head: true });
  const n_empleados = count || 0;

  // 3. MAPAS (Diccionarios) para cruzar datos ultra rápido
  // Un empleado puede tener VARIOS puestos, así que el valor será un Array de IDs: Record<string, number[]>
  const empleado_puestos_map = (empleado_puestos || []).reduce((acc, curr: any) => {
    if (!acc[curr.id_empleado]) acc[curr.id_empleado] = [];
    acc[curr.id_empleado].push(curr.id_puesto);
    return acc;
  }, {} as Record<string, number[]>);

  const puestos_map = (puestos || []).reduce((acc, curr: any) => {
    acc[curr.id] = { nombre: curr.nombre_puesto, id_seccion: curr.id_seccion_jerarquica, id_empresa: curr.id_empresa };
    return acc;
  }, {} as Record<number, { nombre: string, id_seccion: number, id_empresa: number }>);

  const secciones_map = (secciones || []).reduce((acc, curr: any) => {
    acc[curr.id] = {nombre:curr.nombre_seccion, id_empresa:curr.id_empresa};
    return acc;
  }, {} as Record<number, {nombre:string, id_empresa:number}>);
  
  const empresas_map = (empresas || []).reduce((acc, curr: any) => {
    acc[curr.id] = {nombre:curr.nombre_empresa};
    return acc;
  }, {} as Record<number, {nombre:string}>);

  return (
    <div className="container mx-auto py-1">
      <h1 className="text-2xl font-bold mb-4">Directorio de Empleados</h1>
      <DirectorioEmpleados
        empleados={empleados || []}
        ubicaciones={ubicaciones || []}
        estatuses={estatuses || []}
        puestos={puestos || []}
        secciones={secciones || []}
        horarios={horarios || []}
        descansos={descansos || []}
        empresas={empresas || []}
        n_empleados={n_empleados}
        empleado_puestos_map={empleado_puestos_map}
        puestos_map={puestos_map}
        secciones_map={secciones_map}
        empresas_map={empresas_map}
      />
    </div>
  );
}