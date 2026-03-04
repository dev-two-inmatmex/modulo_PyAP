'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


// Datos mockeados para el histograma
const data = [
  { date: '2024-07-22', '07:00': 18, '08:00': 22, '09:00': 15 },
  { date: '2024-07-23', '07:00': 20, '08:00': 25, '09:00': 12 },
  { date: '2024-07-24', '07:00': 19, '08:00': 21, '09:00': 18 },
  { date: '2024-07-25', '07:00': 21, '08:00': 23, '09:00': 17 },
  { date: '2024-07-26', '07:00': 22, '08:00': 20, '09:00': 16 },
];

export function HistogramaAsistencia() {
  // Aquí iría la lógica para cambiar el periodo de tiempo (semana, mes, etc.)

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Histograma de Asistencia</CardTitle>
        <Select defaultValue="this-week">
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
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="07:00" stackId="a" fill="#8884d8" name="07:00 AM" />
            <Bar dataKey="08:00" stackId="a" fill="#82ca9d" name="08:00 AM" />
            <Bar dataKey="09:00" stackId="a" fill="#ffc658" name="09:00 AM" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
