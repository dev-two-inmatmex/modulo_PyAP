import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ChecadorReloj } from "@/components/ChecadorReloj";
import { ChecadorHistorial } from "@/components/ChecadorHistorial";
import type { EmpleadoTurno, RegistroChequeo, TurnoHoy } from "@/lib/types";

// Helper function to reconstruct the day's turn from individual records
function reconstruirTurno(registros: Pick<RegistroChequeo, 'registro'>[]): TurnoHoy {
    const turno: TurnoHoy = {
        entrada: null,
        salida_descanso: null,
        regreso_descanso: null,
        salida: null,
    };

    const tiempos = registros.map(r => r.registro).filter(Boolean) as string[];

    if (tiempos.length > 0) turno.entrada = tiempos[0];
    if (tiempos.length > 1) turno.salida_descanso = tiempos[1];
    if (tiempos.length > 2) turno.regreso_descanso = tiempos[2];
    if (tiempos.length > 3) turno.salida = tiempos[3];
    
    return turno;
}

export default async function ChecadorPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const today = new Date().toISOString().split("T")[0];

  // Fetch all check-in records for the user for today
  const { data: registrosDeHoy, error: registrosError } = await supabase
    .from("registro_checador")
    .select("registro")
    .eq("id_empleado", user.id)
    .eq("fecha", today)
    .order("registro", { ascending: true });

  if (registrosError) {
      console.error("Error fetching check-in records:", registrosError.message);
      // Optionally, render an error message to the user
  }

  const turnoHoy = reconstruirTurno(registrosDeHoy || []);

  const { data: empleadoTurnoRel, error: horarioError } = await supabase
    .from("empleado_turno")
    .select(
      `
      horarios (
        hora_entrada,
        hora_salida
      )
    `
    )
    .eq("id_empleado", user.id)
    .maybeSingle();

  const turnoAsignado: EmpleadoTurno | null = empleadoTurnoRel?.horarios
    ? {
        entrada: (empleadoTurnoRel.horarios as any).hora_entrada,
        salida: (empleadoTurnoRel.horarios as any).hora_salida,
      }
    : null;

  if (horarioError) console.error("Error fetching horario:", horarioError.message);

  return (
    <div className="container mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
      <div className="md:col-span-1 flex justify-center">
        <ChecadorReloj turnoHoy={turnoHoy} turnoAsignado={turnoAsignado} />
      </div>
      <div className="md:col-span-2">
        <ChecadorHistorial turnoHoy={turnoHoy} />
      </div>
    </div>
  );
}
