import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ChecadorReloj } from "@/components/ChecadorReloj";
import { ChecadorHistorial } from "@/components/ChecadorHistorial";
import type { EmpleadoTurno, Turno } from "@/lib/types";

export default async function ChecadorPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const today = new Date().toISOString().split("T")[0];

  const { data: registrosDeHoy, error: registrosError } = await supabase
    .from("registro_checador")
    .select("registro, tipo")
    .eq("id_empleado", user.id)
    .eq("fecha", today);

  if (registrosError) {
      console.error("Error fetching check-in records:", registrosError.message);
  }

  const turnoHoy: Turno | null = registrosDeHoy ? Object.fromEntries(registrosDeHoy.map(r => [r.tipo, r.registro])) as Turno : null;

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
