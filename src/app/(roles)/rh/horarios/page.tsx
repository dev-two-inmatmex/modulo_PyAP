import EmpresaLogo from "@/components/reutilizables/EmpresaLogo";
import { HorarioVista } from "@/components/page_components/horarios/HorarioVista";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getEmpleadoDatos } from "@/services/empleados";
import { getEmpresas } from "@/services/empresas";
import { getHorariosEmpleado } from "@/services/horarios";
import { getOpcionesDescansos, getOpcionesHorarios } from '@/services/horarios';


export default async function HorariosPage() {
    const empresas = await getEmpresas();
    const horariosDisponibles = await getOpcionesHorarios();
    const descansosDisponibles = await getOpcionesDescansos();
    const empleados = await getEmpleadoDatos();
    
    // Al llamar la función sin ID, asumimos que te trae TODOS los turnos de la vista
    const todosLosTurnos = await getHorariosEmpleado();

    // Mapeamos los datos: A cada empleado le metemos su arreglo de turnos correspondiente
    const empleadosConTurnos = empleados.map(emp => ({
        id: emp.id,
        nombres: emp.nombres, // o emp.nombres + ' ' + emp.apellidos
        id_empresa: emp.id_empresa, // 👈 IMPORTANTE para los tabs
        turnos: todosLosTurnos.filter(turno => turno.id_empleado === emp.id)
    }));

    return (
        <div className="container mx-auto py-1">
            <h1 className="text-3xl font-bold tracking-tight mb-6">Horarios de Empleados</h1>

            <Tabs defaultValue="0">
                <TabsList className="mb-4">
                    <TabsTrigger value="0">Todos</TabsTrigger>
                    {empresas.map((empresa) => (
                        <TabsTrigger key={empresa.id} value={empresa.id.toString()}>
                            <EmpresaLogo id={empresa.id} wyh={24} />
                            {empresa.nombre_empresa}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {/* TAB: Todos (Muestra la lista completa sin filtrar por empresa) */}
                <TabsContent value="0" className="space-y-4">
                    <HorarioVista
                        empleados={empleadosConTurnos}
                        mostrarLogo={true}
                        horariosDisponibles={horariosDisponibles}
                        descansosDisponibles={descansosDisponibles}
                    />
                </TabsContent>

                {/* TABS: Por Empresa (Filtramos el arreglo de empleados según su id_empresa) */}
                {empresas.map((empresa) => {
                    const empleadosDeEmpresa = empleadosConTurnos.filter(
                        (e) => e.id_empresa === empresa.id
                    );

                    return (
                        <TabsContent key={empresa.id} value={empresa.id.toString()} className="space-y-4">
                            <HorarioVista
                                empleados={empleadosDeEmpresa}
                                mostrarLogo={false}
                                horariosDisponibles={horariosDisponibles}
                                descansosDisponibles={descansosDisponibles}
                            />
                        </TabsContent>
                    );
                })}
            </Tabs>
        </div>
    );
}