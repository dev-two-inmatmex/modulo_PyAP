import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import LogoutButton from "@/components/LogOutButton";
import { Empleado, RolSistema, UsuarioRol } from "@/lib/types";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  // 1. Fetch employee data with type safety
  const { data: empleado, error: dbError } = await supabase
    .from("empleados")
    .select(`nombres, apellido_paterno, apellido_materno`)
    .eq("id", user.id)
    .single<Empleado>();

  if (dbError) {
    console.error("Database error:", dbError.message);
    return <div className="p-4 text-red-500">Error al cargar los datos del perfil.</div>;
  }

  // 2. Fetch user roles with type safety
  const { data: userRoles, error: rolesError } = await supabase
    .from("usuario_rol")
    .select(`roles_sistema(nombre_rol)`)
    .eq("id_usuario", user.id)

  if (rolesError) {
    console.error("Roles error:", rolesError.message);
    return <div className="p-4 text-red-500">Error al cargar los roles del usuario.</div>;
  }

  // 3. Process data with a robust and clean approach
  const fullName = empleado ? `${empleado.nombres} ${empleado.apellido_paterno} ${empleado.apellido_materno}`.trim() : 'Usuario';
  
  const roleNames = userRoles
    ? userRoles
        .map(userRole => userRole.roles_sistema) // -> (RolSistema | RolSistema[] | null)[]
        .flat()                                 // -> (RolSistema | null)[]
        .filter((role): role is RolSistema => !!role) // -> RolSistema[]
        .map(role => role.nombre_rol)           // -> string[]
    : [];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
        <div className="flex flex-col items-center text-center">
          <Avatar className="w-24 h-24 mb-4">
            <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${encodeURIComponent(fullName)}`} />
            <AvatarFallback>{fullName[0]}</AvatarFallback>
          </Avatar>
          <h1 className="text-2xl font-bold text-gray-800">{fullName}</h1>
          <p className="text-sm text-gray-500 mt-1">{user.email}</p>

          <div className="mt-4 w-full border-t border-gray-200 pt-4">
            <h3 className="text-md font-semibold text-gray-700">Roles</h3>
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              {roleNames.length > 0 ? (
                roleNames.map((role, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                    {role}
                  </span>
                ))
              ) : (
                <p className="text-sm text-gray-500">Sin roles asignados</p>
              )}
            </div>
          </div>

        </div>
        <div className="mt-8">
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
