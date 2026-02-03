
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Empleado } from "@/lib/types";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user }} = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const { data: empleado, error: dbError } = await supabase
    .from("empleados")
    .select(`nombres, apellido_paterno, apellido_materno`)
    .eq("id", user.id)
    .single<Empleado>();

  if (dbError) {
    console.error("Database error:", dbError.message);
    return <div className="p-4 text-red-500">Error al cargar los datos del perfil.</div>;
  }

  const roleNames: string[] = user.user_metadata.roles || [];
  
  const fullName = empleado ? `${empleado.nombres} ${empleado.apellido_paterno} ${empleado.apellido_materno}`.trim() : 'Usuario';
  
  return (
    <div className="flex items-start justify-center p-4">
      <div className="w-full max-w-md bg-card rounded-2xl shadow-lg p-8 border">
        <div className="flex flex-col items-center text-center">
          <Avatar className="w-24 h-24 mb-4">
            <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${encodeURIComponent(fullName)}`} />
            <AvatarFallback>{fullName[0]}</AvatarFallback>
          </Avatar>
          <h1 className="text-2xl font-bold text-foreground">{fullName}</h1>
          <p className="text-sm text-muted-foreground mt-1">{user.email}</p>

          <div className="mt-4 w-full border-t border-border pt-4">
            <h3 className="text-md font-semibold text-card-foreground">Roles</h3>
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              {roleNames.length > 0 ? (
                roleNames.map((role, index) => (
                  <span key={index} className="bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full">
                    {role}
                  </span>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Sin roles asignados</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
