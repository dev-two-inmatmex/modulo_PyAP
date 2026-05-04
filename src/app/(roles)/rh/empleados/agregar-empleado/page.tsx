/*import { createServidorClient } from "@/lib/supabase/server";
import {FormularioNuevoEmpleado} from "@/components/page_components/empleados/agregar-empleado/FormularioNuevoEmpleado";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default async function NuevoEmpleadoPage() {
  const supabase = await createServidorClient();

  // Consultas a la base de datos para los catálogos
  const { data: horarios } = await supabase.from('horarios').select('id, hora_entrada, hora_salida');
  const { data: descansos } = await supabase.from('descansos').select('id, inicio_descanso, fin_descanso');
  const { data: ubicaciones } = await supabase.from('config_ubicaciones').select('id, nombre_ubicacion').eq("tipo", 'produccion');
  const { data: puestos } = await supabase.from('puestos').select('id, nombre_puesto, id_empresa');
  const { data: estatuses } = await supabase.from('estatus').select('id, nombre_estatus');
  const { data: empresas } = await supabase.from('empresas').select('id, nombre_empresa');


  // (Opcional) Traer el conteo para generar el correo automático
  const { count } = await supabase.from('empleados').select('*', { count: 'exact', head: true });
  const n_empleados = count || 0;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">

      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/rh/empleados">Empleados</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Agregar Nuevo Empleado</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-3xl font-bold mb-6 text-slate-800">Agregar Nuevo Empleado</h1>

      <FormularioNuevoEmpleado
        horarios={horarios || []}
        descansos={descansos || []}
        ubicaciones={ubicaciones || []}
        puestos={puestos || []}
        estatuses={estatuses || []}
        empresas={empresas || []}
        n_empleados={String(n_empleados)}
      />
    </div>
  );
}*/
import { createServidorClient } from "@/lib/supabase/server";
import { FormularioNuevoEmpleado } from "@/components/page_components/empleados/agregar-empleado/FormularioNuevoEmpleado";
import { ChevronRight } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

export default async function NuevoEmpleadoPage() {
  const supabase = await createServidorClient();
  
  const [
    { data: horarios },
    { data: descansos },
    { data: ubicaciones },
    { data: puestos },
    { data: estatuses },
    { data: empresas },
    // NUEVO: Traemos a los empleados para asignar Jefes
    { data: listaEmpleados }, 
    { count }
  ] = await Promise.all([
    supabase.from('horarios').select('id, hora_entrada, hora_salida'),
    supabase.from('descansos').select('id, inicio_descanso, fin_descanso'),
    supabase.from('config_ubicaciones').select('id, nombre_ubicacion'),
    supabase.from('puestos').select('id, nombre_puesto, id_empresa'), 
    supabase.from('estatus').select('id, nombre_estatus'),
    supabase.from('empresas').select('id, nombre_empresa'),
    supabase.from('empleados').select('id, nombres, apellido_paterno, apellido_materno'), // Traer empleados
    supabase.from('empleados').select('*', { count: 'exact', head: true })
  ]);

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/rh/empleados">Empleados</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Agregar Nuevo Empleado</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className="text-3xl font-bold mb-6 text-slate-800 tracking-tighter">Agregar Nuevo Empleado</h1>
      
      <FormularioNuevoEmpleado 
        horarios={horarios || []} 
        descansos={descansos || []} 
        ubicaciones={ubicaciones || []}
        puestos={puestos || []}
        estatuses={estatuses || []}
        empresas={empresas || []}
        empleadosLista={listaEmpleados || []} 
        n_empleados={String(count || 0)}
      />
    </div>
  );
}