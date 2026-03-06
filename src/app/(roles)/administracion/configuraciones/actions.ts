'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

interface UbicacionData {
  id?: number; // Opcional: si no se provee, se crea una nueva ubicación
  nombre_ubicacion: string;
  latitud: number;
  longitud: number;
  radio_permitido: number;
}

export async function guardarUbicacion(data: UbicacionData) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('config_ubicaciones')
    .upsert(data) // upsert maneja la lógica de inserción o actualización automáticamente
    .select()
    .single();

  if (error) {
    console.error('Error al guardar la ubicación:', error);
    return { success: false, message: `Error de base de datos: ${error.message}` };
  }

  // Invalidamos el caché de la página para que la tabla se actualice con los nuevos datos
  revalidatePath('/administracion/configuraciones');

  return { success: true, message: 'Ubicación guardada correctamente.' };
}
