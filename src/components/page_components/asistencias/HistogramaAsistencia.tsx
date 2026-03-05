'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from 'react';
import { createClient } from "@/lib/supabase/client";

interface ChartData {
  date: string;
  [key: string]: string | number; // Permite llaves dinámicas como '07:00': 15, '08:00': 20
}

export function HistogramaAsistencia() {
  const [periodo, setPeriodo] = useState<string>('this-week');
  const [data, setData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const supabase = createClient();

      // 1. Calcular las fechas de inicio y fin según el periodo seleccionado
      const hoy = new Date();
      let fechaInicio = new Date();

      if (periodo === 'this-week') {
        const diaSemana = hoy.getDay();
        fechaInicio.setDate(hoy.getDate() - (diaSemana === 0 ? 6 : diaSemana - 1)); // Lunes de esta semana
      } else if (periodo === 'this-month') {
        fechaInicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1); // Día 1 de este mes
      } else if (periodo === 'last-3-months') {
        fechaInicio = new Date(hoy.getFullYear(), hoy.getMonth() - 3, 1);
      }

      const strInicio = fechaInicio.toISOString().slice(0, 10);
      const strFin = hoy.toISOString().slice(0, 10);

      // 2. Consultar la base de datos (Usamos tu vista resumida para que sea rápido)
      const { data: registros, error } = await supabase
        .from('vista_registro_checador_resumida')
        .select('fecha, tipo_registro, registro, hora_esperada') // Aquí lo ideal sería traer también 'hora_esperada' si la agregaste a la vista
        .gte('fecha', strInicio)
        .lte('fecha', strFin)
        .eq('tipo_registro', 'entrada');

      if (error) {
        console.error("Error cargando datos del histograma:", error);
        setIsLoading(false);
        return;
      }

      // 3. "Amasar" los datos para Recharts
      // Recharts necesita un arreglo así: [{ date: '2026-03-01', '07:00': 5, '08:00': 10 }]
      const agrupadoPorDia: Record<string, ChartData> = {};

      registros?.forEach(reg => {
        const fecha = reg.fecha;
        // Agrupamos por la HORA en la que llegaron (Ej. '07:15:00' -> '07:00')
        // Si tienes 'hora_esperada' en tu vista, es MEJOR usar esa para las barras
        //const horaBloque = reg.hora_esperada.slice(0, 3) + '00';
        const horaBloque = reg.hora_esperada; 

        if (!agrupadoPorDia[fecha]) {
          agrupadoPorDia[fecha] = { date: fecha };
        }

        if (!agrupadoPorDia[fecha][horaBloque]) {
          agrupadoPorDia[fecha][horaBloque] = 0;
        }

        (agrupadoPorDia[fecha][horaBloque] as number) += 1;
      });

      // Convertir el objeto a arreglo y ordenarlo por fecha
      const chartDataArray = Object.values(agrupadoPorDia).sort((a, b) => a.date.localeCompare(b.date));
      
      setData(chartDataArray);
      setIsLoading(false);
    };

    fetchData();
  }, [periodo]);

  // Extraer dinámicamente qué horas existen para crear las Barras de colores
  // Ejemplo: Si en la data hay '07:00' y '08:00', creamos dos <Bar />
  const horasUnicas = Array.from(new Set(
    data.flatMap(item => Object.keys(item).filter(key => key !== 'date'))
  )).sort();

  // Colores predefinidos para los turnos
  const colores = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE'];

  return (
    <Card className="w-full shadow-sm">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b pb-4 mb-4">
        <CardTitle>Histórico de Entradas</CardTitle>
        <Select value={periodo} onValueChange={setPeriodo}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Seleccionar periodo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="this-week">Esta semana</SelectItem>
            <SelectItem value="this-month">Este mes</SelectItem>
            <SelectItem value="last-3-months">Últimos 3 meses</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      
      <CardContent className="pl-0">
        {isLoading ? (
          <div className="flex h-[350px] items-center justify-center text-muted-foreground">
            Cargando gráfico...
          </div>
        ) : data.length === 0 ? (
          <div className="flex h-[350px] items-center justify-center text-muted-foreground">
            No hay registros en este periodo.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="date" 
                tickFormatter={(val) => {
                  // Formatear la fecha a algo más corto, ej: '05 Mar'
                  const d = new Date(val + 'T12:00:00'); // Evita desfase horario
                  return d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short' });
                }}
              />
              <YAxis allowDecimals={false} />
              <Tooltip 
                cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                labelFormatter={(label) => new Date(label + 'T12:00:00').toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}
              />
              <Legend />
              
              {/* Renderizar una barra por cada turno dinámicamente */}
              {horasUnicas.map((hora, index) => (
                <Bar 
                  key={hora} 
                  dataKey={hora} 
                  stackId="a" // Apila las barras una sobre otra. Quita esto si las quieres lado a lado.
                  fill={colores[index % colores.length]} 
                  name={`Entrada ${hora}`} 
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
