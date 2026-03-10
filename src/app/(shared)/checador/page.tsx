import { createClient } from "@/lib/supabase/server";
import { ChecadorReloj } from "@/components/page_components/checador/ChecadorReloj";
import { ChecadorHistorial } from "@/components/page_components/checador/ChecadorHistorial";
import type { RegistroChequeo} from "@/services/types";


export default async function ChecadorPage() {
  const supabase = await createClient();
  const {data: { user }} = await supabase.auth.getUser();

  if (!user) {
    return <div>Usuario no autenticado</div>;
  }

  const today = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Mexico_City' });

  const { data: registrosDeHoy, error: registrosError } = await supabase
    .from("registro_checador")
    .select("*")
    .eq("id_empleado", user.id)
    .eq("fecha", today);

  if (registrosError) {
      console.error("Error fetching check-in records:", registrosError.message);
  }
  const registros = registrosDeHoy as unknown as RegistroChequeo[];

  
  const { data: empleadoTurnoRel, error: horarioError } = await supabase
    .from("vista_horarios_empleados")
    .select("*")
    .eq('id', user.id)
    .maybeSingle();

  if (horarioError) console.error("Error fetching horario:", horarioError.message);

  const isAdmin = user.user_metadata?.is_admin === true;

  let queryUbicaciones = supabase
    .from('config_ubicaciones')
    .select('id, nombre_ubicacion, latitud, longitud, radio_permitido, tipo');

  if (!isAdmin) {
    queryUbicaciones = queryUbicaciones.eq("tipo", 'produccion');
  }
  const { data: ubicaciones} = await queryUbicaciones;


  /*const { data: ubicaciones } = await supabase
    .from('config_ubicaciones')
    .select('id, nombre_ubicacion, latitud, longitud, radio_permitido, tipo')
    .eq("tipo", 'produccion');*/
  
  return (
    <div className="container mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
      <div className="md:col-span-1 flex justify-center">
        <ChecadorReloj registros={registros} turnoAsignado={empleadoTurnoRel} userId={user.id} ubicacionesValidas={ubicaciones || []}/>
      </div>
      <div className="md:col-span-2">
        <ChecadorHistorial registros={registros} userId={user.id}/>
      </div>
    </div>
  );
}
