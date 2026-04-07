'use client';

import { useState, useMemo } from 'react';
import { EmployeeCard } from './EmployeeCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { AddEmployee } from "@/components/page_components/empleados/AddEmployee";

interface DirectorioEmpleadosProps {
  empleados: any[];
  puestos: any[];
  secciones: any[];
  ubicaciones: any[];
  estatuses: any[];
  horarios: any[];
  descansos: any[];
  empresas: any[];
  n_empleados: number;
  empleado_puestos_map: Record<string, number[]>;
  puestos_map: Record<number, { nombre: string, id_seccion: number, id_empresa: number }>;
  secciones_map: Record<number, {nombre: string, id_empresa: number}>;
  empresas_map: Record<number, {nombre:string}>;
}

const removeAccents = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
const ITEMS_PER_PAGE = 6;

export default function DirectorioEmpleados({
  empleados,
  puestos,
  secciones,
  ubicaciones,
  estatuses,
  horarios,
  descansos,
  empresas,
  n_empleados,
  empleado_puestos_map,
  puestos_map,
  secciones_map,
  empresas_map,
}: DirectorioEmpleadosProps) {

  const [busqueda, setBusqueda] = useState('');
  const [filtroPuesto, setFiltroPuesto] = useState('all');
  const [filtroSeccion, setFiltroSeccion] = useState('all');
  const [filtroEmpresa, setFiltroEmpresa] = useState('all');
  const [orden, setOrden] = useState('asc');
  const [paginaActual, setPaginaActual] = useState(1);

  const empleadosFiltrados = useMemo(() => {
    let empleadosResult = [...empleados];

    // 1. Filtrar por Nombre
    if (busqueda) {
      const busquedaSinAcentos = removeAccents(busqueda.toLowerCase());
      empleadosResult = empleadosResult.filter((empleado) => {
        const nombreCompleto = `${empleado.nombres} ${empleado.apellido_paterno} ${empleado.apellido_materno || ''}`;
        const nombreLimpio = removeAccents(nombreCompleto.toLowerCase());
        return nombreLimpio.includes(busquedaSinAcentos);
      });
    }

    // 2. Filtrar por Puesto (Buscamos si AL MENOS UNO de sus puestos coincide)
    if (filtroPuesto !== 'all') {
      empleadosResult = empleadosResult.filter((empleado) => {
        const puestosDelEmpleadoIds = empleado_puestos_map[empleado.id] || [];
        return puestosDelEmpleadoIds.some(id => puestos_map[id]?.nombre === filtroPuesto);
      });
    }

    // 3. Filtrar por Área/Sección (Buscamos si AL MENOS UNA de sus secciones coincide)
    if (filtroSeccion !== 'all') {
      empleadosResult = empleadosResult.filter((empleado) => {
        const puestosDelEmpleadoIds = empleado_puestos_map[empleado.id] || [];
        return puestosDelEmpleadoIds.some(id => {
          const idSeccion = puestos_map[id]?.id_seccion;
          return puestos_map[idSeccion]?.nombre === filtroSeccion;
        });
      });
    }

    if (filtroEmpresa !== 'all') {
      empleadosResult = empleadosResult.filter((empleado) => {
        const puestosDelEmpleadoIds = empleado_puestos_map[empleado.id] || [];
        return puestosDelEmpleadoIds.some(idPuesto => {
          const idSeccion = puestos_map[idPuesto]?.id_seccion;
          const idEmpresa = secciones_map[idSeccion]?.id_empresa;
          return empresas_map[idEmpresa]?.nombre === filtroEmpresa;
        });
      });
    }

    // 4. Ordenar Alfabéticamente
    empleadosResult.sort((a, b) => {
      const nombreA = `${a.nombres} ${a.apellido_paterno}`;
      const nombreB = `${b.nombres} ${b.apellido_paterno}`;
      if (orden === 'asc') return nombreA.localeCompare(nombreB);
      return nombreB.localeCompare(nombreA);
    });

    return empleadosResult;
  }, [busqueda, filtroPuesto, filtroSeccion, filtroEmpresa, orden, empleados, empleado_puestos_map, puestos_map, secciones_map]);

  const paginatedEmpleados = useMemo(() => {
    const startIndex = (paginaActual - 1) * ITEMS_PER_PAGE;
    return empleadosFiltrados.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [empleadosFiltrados, paginaActual]);

  const totalPaginas = Math.ceil(empleadosFiltrados.length / ITEMS_PER_PAGE);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <Input
          placeholder="Buscar por nombre..."
          value={busqueda}
          onChange={(e) => { setBusqueda(e.target.value); setPaginaActual(1); }}
          className="md:col-span-5"
        />
        <Select value={filtroPuesto} onValueChange={(value) => { setFiltroPuesto(value); setPaginaActual(1); }}>
          <SelectTrigger><SelectValue placeholder="Filtrar por puesto" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los puestos</SelectItem>
            {puestos.map((puesto) => (
              <SelectItem key={puesto.id} value={puesto.nombre_puesto}>{puesto.nombre_puesto}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filtroSeccion} onValueChange={(value) => { setFiltroSeccion(value); setPaginaActual(1); }}>
          <SelectTrigger><SelectValue placeholder="Filtrar por área" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las áreas</SelectItem>
            {secciones.map((area) => (
              <SelectItem key={area.id} value={area.nombre_seccion}>{area.nombre_seccion}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filtroEmpresa} onValueChange={(value) => { setFiltroEmpresa(value); setPaginaActual(1); }}>
          <SelectTrigger><SelectValue placeholder="Filtrar por empresa" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las empresas</SelectItem>
            {empresas.map((empresa) => (
              <SelectItem key={empresa.id} value={empresa.nombre_empresa}>{empresa.nombre_empresa}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={orden} onValueChange={setOrden}>
          <SelectTrigger><SelectValue placeholder="Ordenar" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">A-Z</SelectItem>
            <SelectItem value="desc">Z-A</SelectItem>
          </SelectContent>
        </Select>

        <AddEmployee
          horarios={horarios || []}
          descansos={descansos || []}
          puestos={puestos || []}
          ubicaciones={ubicaciones || []}
          estatuses={estatuses || []}
          n_empleados={String(n_empleados)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedEmpleados.map((empleado) => (
          <EmployeeCard
            key={empleado.id}
            empleado={empleado}
            empleado_puestos_map={empleado_puestos_map}
            puestos_map={puestos_map}
            secciones_map={secciones_map}
            empresas_map={empresas_map}
          />
        ))}
      </div>

      {totalPaginas > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-8">
          <Button variant="outline" onClick={() => setPaginaActual((p) => Math.max(p - 1, 1))} disabled={paginaActual === 1}>Anterior</Button>
          <span className="text-sm font-medium text-slate-600">Página {paginaActual} de {totalPaginas}</span>
          <Button variant="outline" onClick={() => setPaginaActual((p) => Math.min(p + 1, totalPaginas))} disabled={paginaActual === totalPaginas}>Siguiente</Button>
        </div>
      )}
    </div>
  );
}