/*import { createClient } from "@/lib/supabase/server";

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
}*/
import { createAdminClient } from '@/lib/supabase/admin';
import { unstable_cache as cache } from 'next/cache';

// Esta función interna contiene la lógica original para obtener datos de Supabase.
// Ahora usa el cliente de administrador para ser compatible con el caché.
const getAvatarsFromSupabase = async (employeeIds: string[]): Promise<Record<string, string>> => {
  if (!employeeIds || employeeIds.length === 0) return {};

  // Usamos el cliente de administrador, que no depende de cookies y es seguro para cachear.
  // Se corrigió el error: se debe invocar la función createAdminClient().
  const supabase = createAdminClient();
  const paths = employeeIds.map(id => `${id}/avatar.webp`);
  
  const { data, error } = await supabase.storage
    .from('avatars')
    .createSignedUrls(paths, 3600); // Las URLs son válidas por 1 hora

  if (error) {
    console.error('Error al generar las URLs firmadas con el cliente de admin:', error);
    return {};
  }

  // Creamos el mapa usando el ID del empleado como llave para que sea más fácil de buscar
  // Se corrigió el error: se añadieron tipos explícitos a 'item' e 'index'.
  return Object.fromEntries(
    data?.map((item: { signedUrl: string }, index: number) => [employeeIds[index], item.signedUrl]) || []
  );
};

/**
 * Recibe un arreglo de IDs de empleados y devuelve un diccionario { "id": "url_firmada" }.
 * Los resultados se cachean en el servidor para optimizar las peticiones.
 * Las URLs firmadas y el caché son válidos por 1 hora.
 */
export async function getAvatarsMap(employeeIds: string[]): Promise<Record<string, string>> {
  if (!employeeIds || employeeIds.length === 0) return {};
  
  // Ordena los IDs para asegurar que la clave del caché sea consistente sin importar el orden original.
  const sortedIds = [...employeeIds].sort();
  
  // Usa `unstable_cache` de Next.js para cachear los resultados.
  // La función solo se ejecutará si los datos no están en el caché o si este ha expirado.
  const cachedGetAvatars = cache(
    // La función a ejecutar y cuyo resultado se cacheará. Ahora es segura para cachear.
    async () => getAvatarsFromSupabase(sortedIds),
    // Clave única para esta entrada de caché. 'avatars-map' es un prefijo para evitar colisiones.
    ['avatars-map', ...sortedIds],
    {
      // El caché se invalida y se regenera después de 1 hora.
      revalidate: 3600,
      // Etiqueta opcional para revalidación bajo demanda si se necesita en el futuro.
      tags: ['avatars'], 
    }
  );

  return await cachedGetAvatars();
}

