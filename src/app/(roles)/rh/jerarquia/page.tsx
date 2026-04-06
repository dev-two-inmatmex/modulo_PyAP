import OrganigramaEmpresa from "@/components/page_components/jerarquia/JerarquiaOrganigrama";
import { createServidorClient } from "@/lib/supabase/server";


export default async function JerarquiaPage() {
  const supabase = await createServidorClient();
  const { data: empresas } = await supabase.from('empresas').select('*');
  if (!empresas) {
    return <div>Error al cargar las empresas.</div>;
  }
  const { data: todaLaJerarquia } = await supabase.from('jerarquia').select('*');
  if (!todaLaJerarquia) {
    return <div>Error al cargar la jerarquía.</div>;
  }
  const { data: puestos } = await supabase.from('puestos').select('*');
  if (!puestos) {
    return <div>Error al cargar los puestos.</div>;
  }
  const { data: empleados_puestos } = await supabase
    .from('empleado_puesto')
    .select(`
      id_puesto,
      id_empleado
    `);
  if (!empleados_puestos) {
    return <div>Error al cargar los empleados.</div>;
  }


  // Formateamos los empleados para que sean fáciles de leer por el componente
  const empleadosAsignados = empleados_puestos?.map(ep => ({
    id_puesto: ep.id_puesto,
    id_empleado: ep.id_empleado,
    //nombre_empleado: ep.empleados ? `${ep.empleados.nombres} ${ep.empleados.apellido_paterno}` : 'Desconocido'
  })) || [];

  return (
    <div className = "container mx-auto py-6" >
        <h1 className="text-2xl font-bold mb-6">Jerarquías Corporativas</h1>
        
        {/*<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {empresas?.map(empresa => (
            <div key={empresa.id}>
              <OrganigramaEmpresa 
                jerarquiaCruda={todaLaJerarquia || []} 
                id_empresa={empresa.id}
                nombre_empresa={empresa.nombre_empresa}
              />
            </div>
          ))}
        </div>*/}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {empresas?.map(empresa => (
          <div key={empresa.id}>
            <OrganigramaEmpresa 
              jerarquiaCruda={todaLaJerarquia || []} 
              puestosCrudos={puestos || []}
              empleadosAsignados={empleadosAsignados}
              id_empresa={empresa.id}
              nombre_empresa={empresa.nombre_empresa}
            />
          </div>
        ))}
      </div>
      </div >
  );
}