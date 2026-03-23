'use client';

import { useState, useMemo } from 'react';
import { EmployeeCard } from './EmployeeCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import type { Vista_Lista_Empleados } from '@/services/types';
import {AddEmployee} from "@/components/page_components/empleados/AddEmployee";
interface DirectorioEmpleadosProps {
  empleados: Vista_Lista_Empleados[];
  puestos: { id: number; nombre_puesto: string }[];
  areas: { id: number; nombre_area: string }[];
  ubicaciones: { id: number; nombre_ubicacion: string }[];
  estatuses: { id: number; nombre_estatus: string }[];
  horarios: { id: number; hora_entrada: string; hora_salida: string }[];
  descansos: { id: number; inicio_descanso: string; fin_descanso: string }[];
  n_empleados: number;
}
const removeAccents = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
const ITEMS_PER_PAGE = 6;

export default function DirectorioEmpleados({
  empleados,
  puestos,
  areas,
  ubicaciones,
  estatuses,
  horarios,
  descansos,
  n_empleados,
}: DirectorioEmpleadosProps) {
  const [busqueda, setBusqueda] = useState('');
  const [filtroPuesto, setFiltroPuesto] = useState('all');
  const [filtroArea, setFiltroArea] = useState('all');
  const [filtroEstatus, setFiltroEstatus] = useState('all');
  const [orden, setOrden] = useState('asc');
  const [paginaActual, setPaginaActual] = useState(1);

  const empleadosFiltrados = useMemo(() => {
    let empleadosResult = [...empleados];

    if (busqueda) {
      const busquedaSinAcentos = removeAccents(busqueda.toLowerCase());
      empleadosResult = empleadosResult.filter((empleado) => {
        const nombreLimpio = removeAccents(empleado.nombre_completo.toLowerCase());
        return nombreLimpio.includes(busquedaSinAcentos);
      });
    }

    if (filtroPuesto !== 'all') {
      empleadosResult = empleadosResult.filter(
        (empleado) => empleado.puesto === filtroPuesto
      );
    }

    if (filtroArea !== 'all') {
      empleadosResult = empleadosResult.filter(
        (empleado) => empleado.area === filtroArea
      );
    }
    if (filtroEstatus !== 'all') {
      empleadosResult = empleadosResult.filter(
        (empleado) => empleado.estatus === filtroEstatus
      );
    }

    empleadosResult.sort((a, b) => {
      if (orden === 'asc') {
        return a.nombre_completo.localeCompare(b.nombre_completo);
      }
      else {
        return b.nombre_completo.localeCompare(a.nombre_completo);
      }
    });

    return empleadosResult;
  }, [busqueda, filtroPuesto, filtroArea, filtroEstatus,  orden, empleados]);

  const paginatedEmpleados = useMemo(() => {
    const startIndex = (paginaActual - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return empleadosFiltrados.slice(startIndex, endIndex);
  }, [empleadosFiltrados, paginaActual]);

  const totalPaginas = Math.ceil(empleadosFiltrados.length / ITEMS_PER_PAGE);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
        <Input
          placeholder="Buscar por nombre..."
          value={busqueda}
          onChange={(e) => {
            setBusqueda(e.target.value);
            setPaginaActual(1);
          }}
          className="md:col-span-5"
        />
        <Select value={filtroPuesto} onValueChange={(value) => { setFiltroPuesto(value); setPaginaActual(1); }}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrar por puesto" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los puestos</SelectItem>
            {puestos.map((puesto) => (
              <SelectItem key={puesto.id} value={String(puesto.nombre_puesto)}>
                {puesto.nombre_puesto}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filtroArea} onValueChange={(value) => { setFiltroArea(value); setPaginaActual(1); }}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrar por área" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las áreas</SelectItem>
            {areas.map((area) => (
              <SelectItem key={area.id} value={String(area.nombre_area)}>
                {area.nombre_area}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filtroEstatus} onValueChange={(value) => { setFiltroEstatus (value); setPaginaActual(1); }}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrar por Estatus" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estatus</SelectItem>
            {estatuses.map((estatus) => (
              <SelectItem key={estatus.id} value={String(estatus.nombre_estatus)}>
                {estatus.nombre_estatus}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={orden} onValueChange={setOrden}>
          <SelectTrigger>
            <SelectValue placeholder="Ordenar" />
          </SelectTrigger>
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
          />
        ))}
      </div>

        {totalPaginas > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-8">
                <Button
                    onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
                    disabled={paginaActual === 1}
                >
                    Anterior
                </Button>
                <span>
                    Página {paginaActual} de {totalPaginas}
                </span>
                <Button
                    onClick={() => setPaginaActual((prev) => Math.min(prev + 1, totalPaginas))}
                    disabled={paginaActual === totalPaginas}
                >
                    Siguiente
                </Button>
            </div>
        )}
    </div>
  );
}
