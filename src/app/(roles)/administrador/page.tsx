import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdministradorPage() {
  /*const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
  
    if (authError || !user) {
      redirect("/login");
    }*/
  return (
    <div>
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-4xl font-bold">Administrador</h1>
      </div>
    </div>
  );
}
