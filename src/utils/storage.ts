import { createClient } from "@/lib/supabase/server";

// Recibe un arreglo de IDs de empleados y te devuelve un diccionario { "id": "url_firmada" }
export async function getAvatarsMap(employeeIds: string[]): Promise<Record<string, string>> {
  if (!employeeIds || employeeIds.length === 0) return {};

  const supabase = await createClient();
  const paths = employeeIds.map(id => `${id}/avatar.webp`);
  
  const { data, error } = await supabase.storage
    .from('avatars')
    .createSignedUrls(paths, 3600);

  if (error) {
    console.error('Error fetching signed URLs:', error);
    return {};
  }

  // Creamos el mapa usando el ID del empleado como llave para que sea más fácil de buscar
  return Object.fromEntries(
    data?.map((item, index) => [employeeIds[index], item.signedUrl]) || []
  );
}