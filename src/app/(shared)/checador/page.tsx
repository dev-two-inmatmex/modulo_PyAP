import { createServidorClient } from "@/lib/supabase/server";
import { ChecadorReloj } from "@/components/page_components/checador/ChecadorReloj";
import { ChecadorHistorial } from "@/components/page_components/checador/ChecadorHistorial";
import type { RegistroChequeo } from "@/services/types";
import { getHorarioEmpleadoDelDia } from "@/services/horarios";

export default async function ChecadorPage() {
  const supabase = await createServidorClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <div>Usuario no autenticado</div>;
  }

  const today = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'America/Mexico_City',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date());

  /*const nombreDia = new Intl.DateTimeFormat('es-MX', {
    timeZone: 'America/Mexico_City',
    weekday: 'long'
  }).format(new Date());*/

  //const diaActual = nombreDia.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const { data: registrosDeHoy, error: registrosError } = await supabase
    .from("registro_checador")
    .select("*")
    .eq("id_empleado", user.id)
    .eq("fecha", today);

  if (registrosError) {
    console.error("Error fetching check-in records:", registrosError.message);
  }
  const registros = registrosDeHoy as unknown as RegistroChequeo[];

  const turnoDeHoy = await getHorarioEmpleadoDelDia(user.id);
  const empleadoTurnoRel = turnoDeHoy[0];

  const isAdmin = user.user_metadata?.is_admin === true;
  if (empleadoTurnoRel || isAdmin) {

    /* Le decimos a Supabase: "Tráeme el turno del usuario donde la columna de hoy (ej. 'martes') sea TRUE"
    const { data: turnoData, error: horarioError } = await supabase
      .from("empleado_turno")
      .select(`
        id_empleado,
        horarios ( hora_entrada, hora_salida ),
        descansos ( inicio_descanso, fin_descanso )
      `)
      .eq('id_empleado', user.id)
      .eq(diaActual, true) // 👈 ¡Esta es la magia!
      .maybeSingle();

    if (horarioError) console.error("Error fetching horario:", horarioError.message);
    if (turnoData && turnoData.horarios && turnoData.descansos) {
      // @ts-ignore - Ignoramos tipado estricto aquí por la anidación de Supabase
      const horarios = Array.isArray(turnoData.horarios) ? turnoData.horarios[0] : turnoData.horarios;
      // @ts-ignore
      const descansos = Array.isArray(turnoData.descansos) ? turnoData.descansos[0] : turnoData.descansos;

      empleadoTurnoRel = {
        id: turnoData.id_empleado,
        entrada: horarios.hora_entrada,
        salida_descanso: descansos.inicio_descanso,
        regreso_descanso: descansos.fin_descanso,
        salida: horarios.hora_salida
      };
    }*/

    

    let queryUbicaciones = supabase
      .from('config_ubicaciones')
      .select('id, nombre_ubicacion, latitud, longitud, radio_permitido, tipo');

    if (!isAdmin) {
      queryUbicaciones = queryUbicaciones.eq("tipo", 'produccion');
    }
    const { data: ubicaciones } = await queryUbicaciones;


    return (
      <div className="container mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        <div className="md:col-span-1 flex justify-center">
          <ChecadorReloj registros={registros} turnoAsignado={empleadoTurnoRel} userId={user.id} ubicacionesValidas={ubicaciones || []} />
        </div>
        <div className="md:col-span-2">
          <ChecadorHistorial registros={registros} userId={user.id} />
        </div>
      </div>
    );
  }
}
