import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ChecadorReloj } from "@/components/ChecadorReloj";
import { ChecadorHistorial } from "@/components/ChecadorHistorial";
import type { TurnoUsuario, Horario } from "@/lib/types";

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
    .from("usuarios_turnos")
    .select("*")
    .eq("id_usuario", user.id)
    .eq("fecha", today)
    .order("entrada", { ascending: false })
    .limit(1)
    .maybeSingle<TurnoUsuario>();

  const { data: turnosDelDia, error: turnosError } = await supabase
    .from("usuarios_turnos")
    .select("*")
    .eq("id_usuario", user.id)
    .eq("fecha", today)
    .order("entrada", { ascending: true })
    .returns<TurnoUsuario[]>();

  const { data: horarioData, error: horarioError } = await supabase
    .from("usuarios")
    .select("horarios ( horario_entrada, horario_salida )")
    .eq("id", user.id)
    .single();

  if (turnoError) console.error("Error fetching turno:", turnoError.message);
  if (horarioError) console.error("Error fetching horario:", horarioError.message);
  if (turnosError) console.error("Error fetching turnos del dia:", turnosError.message);
  
  const horario = horarioData?.horarios ? (horarioData.horarios as Horario) : null;

  return (
    <div className="container mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
      <div className="md:col-span-1 flex justify-center">
        <ChecadorReloj latestTurno={latestTurno} horario={horario} />
      </div>
      <div className="md:col-span-2">
        <ChecadorHistorial turnos={turnosDelDia ?? []} />
      </div>
    </div>
  );
}
