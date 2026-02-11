import { createClient } from "@/lib/supabase/server";
import { ChecadorReloj } from "@/components/ChecadorReloj";
import { ChecadorHistorial } from "@/components/ChecadorHistorial";
import type { RegistroChequeo} from "@/lib/types";

export default async function ChecadorPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <div>Usuario no autenticado</div>;
  }

  const today = new Date().toISOString().split("T")[0];

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

  return (
    <div className="container mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
      <div className="md:col-span-1 flex justify-center">
        <ChecadorReloj registros={registros} turnoAsignado={empleadoTurnoRel} />
      </div>
      <div className="md:col-span-2">
        <ChecadorHistorial registros={registros} />
      </div>
    </div>
  );
}
