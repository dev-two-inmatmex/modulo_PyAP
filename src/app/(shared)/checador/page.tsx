export const dynamic = 'force-dynamic';
import { createServidorClient } from "@/lib/supabase/server";
import { getDescansoHoyUser, getHorarioHoyUser, getHorasExtra } from "@/services/horarios";
import { getInasistenciaUser, getRegistrosChecadorHoyUser } from "@/services/asistencias";
import { getUbicacionesPermitidas } from "@/services/ubicaciones";
import { useHoy } from "@/hooks/useHoy";
import { AlertCircle } from "lucide-react";
import { ChecadorCard } from "@/components/page_components/checador/ChecadorCard";
import { RealtimeAsistencias } from "@/hooks/useRealtimeChecadorRegistros";

export default async function ChecadorPage() {
  const supabase = await createServidorClient();
  const { getFormatosBD } = useHoy();
  const fecha = getFormatosBD().fecha;
  const hoyEs = getFormatosBD().nombredeldiaDBEs;
  const ubicaciones = await getUbicacionesPermitidas();
  //console.log("ubicaciones", ubicaciones)
  const tienesInasistencias = await getInasistenciaUser(fecha);
  //console.log("inasistencias", tienesInasistencias)
  const registros = await getRegistrosChecadorHoyUser(fecha);
  //console.log("registros", registros)
  const horarioData = await getHorarioHoyUser(hoyEs);
  //console.log("horario", horarioData)
  const descansoData = await getDescansoHoyUser(hoyEs);
  //console.log("descanso", descansoData)
  const horario = horarioData ? horarioData[hoyEs] : null;
  const descanso = descansoData ? descansoData[hoyEs] : null;
  //console.log("horario: ", horarioData, "descanso: ", descanso)

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    console.error("Usuario no autenticado");
    return [];
  }

  const horasExtra = await getHorasExtra(fecha, user.id);
  console.log("horas extra", horasExtra)

  if (tienesInasistencias && tienesInasistencias.length > 0) {
    return (
      <div className="flex flex-col gap-4 justify-center items-center h-screen text-center p-4">
        <AlertCircle className="w-16 h-16 text-blue-500" />
        <p className="font-semibold text-lg">Se considero que no llegaste. Si no es así Contacta a Recursos Humanos.</p>
      </div>
    );
  }

  if (!horario) {
    return (
      <div className="flex flex-col gap-4 justify-center items-center h-screen text-center p-4">
        <AlertCircle className="w-16 h-16 text-yellow-500" />
        <p className="font-semibold text-lg">No tienes un turno de trabajo asignado para el día de hoy.</p>
      </div>
    );
  }

  if (!ubicaciones || ubicaciones.length === 0) {
    return (
      <div className="flex flex-col gap-4 justify-center items-center h-screen text-center p-4">
        <AlertCircle className="w-16 h-16 text-red-500" />
        <p className="font-semibold text-lg">No tienes una ubicación de trabajo configurada. Contacta a Recursos Humanos.</p>
      </div>
    );
  }

  return (
    <>
      <RealtimeAsistencias />
      <ChecadorCard
        userId={user.id}
        horario={horario}
        descanso={descanso}
        registros={registros}
        ubicacionesValidas={ubicaciones}
        horasExtra={horasExtra}
      />
    </>
  );
}