import { Suspense } from "react";
import { HorarioVista } from "@/components/reutilizables/HorarioVista";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getEmpleadoDatos } from "@/services/empleados";
import { getEmpresas } from "@/services/empresas";
import { getHorariosEmpleado } from "@/services/horarios";

async function CargarHorarioEmpleado({ empleadoId }: { empleadoId: string }) {
    const turnos = await getHorariosEmpleado(empleadoId);
    return <HorarioVista turnos={turnos} />;
}

export default async function HorariosPage() {
    const empresas = await getEmpresas();
    const empleados = await getEmpleadoDatos();

    return (
        <div className="container space-y-4 mx-auto py-1">
            <h1 className="text-3xl font-bold tracking-tight mb-6">Horarios</h1>
            <Tabs defaultValue="0" className="grid w-full">
                <TabsList className="mb-4">
                    <TabsTrigger value="0">Todos</TabsTrigger>
                    {empresas.map((empresa) => (
                        <TabsTrigger key={empresa.id} value={empresa.id.toString()}>
                            {empresa.nombre_empresa}
                        </TabsTrigger>
                    ))}
                </TabsList>
                <TabsContent value="0" className="space-y-4">
                    <Accordion type="single" collapsible>
                        {empleados.map((empleado) => (
                            <AccordionItem key={empleado.id} value={empleado.id.toString()}>
                                <AccordionTrigger >
                                    {empleado?.nombres}
                                </AccordionTrigger>
                                <AccordionContent>
                                    <Suspense fallback={<div className="p-4 text-center text-muted-foreground animate-pulse">Cargando horario...</div>}>
                                        <CargarHorarioEmpleado empleadoId={empleado.id} />
                                    </Suspense>
                                </AccordionContent>
                            </AccordionItem>))}
                    </Accordion>
                </TabsContent>
            </Tabs>
        </div>
    );
}