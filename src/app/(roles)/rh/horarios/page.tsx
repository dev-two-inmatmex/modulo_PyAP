/*import EmpresaLogo from "@/components/reutilizables/EmpresaLogo";
import { HorarioVista } from "@/components/page_components/horarios/HorarioVista";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getEmpleados } from "@/services/empleados";
import { getEmpresas } from "@/services/empresas";
import { getHorarios } from "@/services/horarios";
import { getOpcionesDescansos, getOpcionesHorarios } from '@/services/horarios';

export default async function HorariosPage() {
    const empresas = await getEmpresas();
    const horariosDisponibles = await getOpcionesHorarios();
    const descansosDisponibles = await getOpcionesDescansos();
    const empleados = await getEmpleados();
    
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
                <TabsContent value="0" className="space-y-4">
                    <HorarioVista
                        empleados={empleadosConTurnos}
                        mostrarLogo={true}
                        horariosDisponibles={horariosDisponibles}
                        descansosDisponibles={descansosDisponibles}
                    />
                </TabsContent>

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
}*/
import EmpresaLogo from "@/components/reutilizables/EmpresaLogo";
import { HorarioVista } from "@/components/page_components/horarios/HorarioVista";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getEmpresas } from "@/services/empresas";

// Importamos tus nuevas funciones
import {
    getHorariosSemanal,
    getDescansosSemanal,
    getOpcionesDescansos,
    getOpcionesHorarios
} from '@/services/horarios';
import { getVistaEmpleadosEmpresa } from "@/services/empleados";

export default async function HorariosPage() {
    // 1. Obtener catálogos base
    const empresas = await getEmpresas();
    const horariosDisponibles = await getOpcionesHorarios();
    const descansosDisponibles = await getOpcionesDescansos();
    
    
    const turnos = await getHorariosSemanal();
    const descansos = await getDescansosSemanal();
    
    // 3. Traer la vista y crear el Diccionario (Map) de Empresa por Empleado
    const empleadoEmpresaView = await getVistaEmpleadosEmpresa(1); // Ajusta el parámetro si es necesario
    
    const empleadoEmpresaMap = (empleadoEmpresaView || []).reduce((acc, curr: any) => {
        acc[curr.id_empleado] = curr.id_empresa;
        return acc;
    }, {} as Record<string, number>);

    // 4. Mapear uniendo todo
    const empleadosConTurnos = (empleadoEmpresaView || []).map((relacion: any) => {
        const idEmpleado = relacion.id_empleado;

        // Buscamos sus turnos y descansos
        const turnoEmp = turnos.find(t => t.id_empleado === idEmpleado);
        const descansoEmp = descansos.find(d => d.id_empleado === idEmpleado);

        return {
            id: idEmpleado,
            nombres: null, // Dejamos esto en nulo porque ya no lo consultamos
            id_empresa: relacion.id_empresa,
            configuracion: {
                turnos: turnoEmp || null,
                descansos: descansoEmp || null
            }
        };
    });

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

                {/* TAB: Todos */}
                <TabsContent value="0" className="space-y-4">
                    <HorarioVista
                        empleados={empleadosConTurnos}
                        mostrarLogo={true}
                        horariosDisponibles={horariosDisponibles}
                        descansosDisponibles={descansosDisponibles}
                    />
                </TabsContent>

                {/* TABS: Por Empresa */}
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