import LogoutButton from "@/components/LogOutButton";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";


export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Tu Perfil</h1>
        <div className="space-y-2">
          <p className="text-sm text-gray-500 font-medium">Email:</p>
          <p className="bg-gray-100 p-2 rounded text-gray-700">{user.email}</p>
        </div>
        <LogoutButton/>
      </div>
    </div>
  );
}
