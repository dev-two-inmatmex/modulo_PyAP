import { createClient } from "@/lib/supabase/server";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UbicacionesManager } from "@/components/page_components/configuracion_Admin/UbicacionesManager";

export default async function ConfiguracionesPage() {
  const supabase = await createClient();

  // Obtenemos TODAS las configuraciones de la base de datos, ordenadas por nombre.
  const { data: ubicaciones, error } = await supabase
    .from('config_ubicaciones')
    .select('id, nombre_ubicacion, latitud, longitud, radio_permitido')
    .order('nombre_ubicacion', { ascending: true });

  if (error) {
    console.error('Error al obtener las ubicaciones:', error);
    // Aquí podrías mostrar un estado de error más robusto en la UI
    return <div>Error al cargar las configuraciones.</div>;
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <h2 className="text-3xl font-bold tracking-tight">Configuraciones del Sistema</h2>
        <Tabs defaultValue="ubicaciones" className="space-y-4">
            <TabsList>
                <TabsTrigger value="ubicaciones">Ubicaciones</TabsTrigger>
                <TabsTrigger value="general" disabled>General</TabsTrigger>
                <TabsTrigger value="notificaciones" disabled>Notificaciones</TabsTrigger>
            </TabsList>
            <TabsContent value="ubicaciones" className="space-y-4">
                {/* El manager se encarga de toda la lógica de la UI */}
                <UbicacionesManager ubicaciones={ubicaciones || []} />
            </TabsContent>
        </Tabs>
    </div>
  );
}
