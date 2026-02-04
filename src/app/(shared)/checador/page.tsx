import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ChecadorReloj } from "@/components/ChecadorReloj";
import { ChecadorHistorial } from "@/components/ChecadorHistorial";
import type { Turno_Realizandose, EmpleadoTurno } from "@/lib/types";

export default async function ChecadorPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const today = new Date().toISOString().split("T")[0];

  const { data: latestTurno, error: turnoError } = await supabase
    .from("registro_checador")
    .select("*")
    .eq("id_empleado", user.id)
    .eq("fecha", today)
    .order("entrada", { ascending: false })
    .limit(1)
    .maybeSingle<Turno_Realizandose>();

  const { data: turnoshechos, error: turnosError } = await supabase
    .from("registro_checador")
    .select("*")
    .eq("id_empleado", user.id)
    .order("fecha", { ascending: true });

  const turnosCompletos = (turnoshechos as Turno_Realizandose[]) || [];

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

  const turno: EmpleadoTurno | null = empleadoTurnoRel?.horarios
    ? {
        entrada: (empleadoTurnoRel.horarios as any).hora_entrada,
        salida: (empleadoTurnoRel.horarios as any).hora_salida,
      }
    : null;

  if (turnoError) console.error("Error fetching turno:", turnoError.message);
  if (horarioError) console.error("Error fetching horario:", horarioError.message);
  if (turnosError) console.error("Error fetching turnos del dia:", turnosError.message);

  return (
    <div className="container mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
      <div className="md:col-span-1 flex justify-center">
        <ChecadorReloj latestTurno={latestTurno} turno={turno} />
      </div>
      <div className="md:col-span-2">
        <ChecadorHistorial turnos={turnosCompletos} />
      </div>
    </div>
  );
}
