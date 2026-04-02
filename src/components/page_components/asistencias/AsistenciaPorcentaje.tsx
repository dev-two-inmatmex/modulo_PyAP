"use client"

import * as React from "react"
import { Users, TrendingUp } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

// Definimos cómo debe verse cada "rebanada" de la gráfica
export interface SegmentoAsistencia {
  id: number | string;
  label: string;
  count: number;
  color: string;
}

export interface PorcentajeAsistenciaProps {
  segmentos: SegmentoAsistencia[];
  totalEsperados: number;
}

export function PorcentajeAsistencia({ segmentos, totalEsperados }: PorcentajeAsistenciaProps) {
  // 1. Calculamos totales
  const totalLlegadas = segmentos.reduce((acc, curr) => acc + curr.count, 0)
  const pendientesCount = Math.max(0, totalEsperados - totalLlegadas)
  const percentage = totalEsperados > 0 ? Math.round((totalLlegadas / totalEsperados) * 100) : 0

  // 2. Preparamos la configuración de colores para Shadcn
  const chartConfig = React.useMemo(() => {
    const config: Record<string, { label: string; color: string }> = {
      pendientes: { label: "Faltan", color: "var(--muted)" } // Color gris para los que no llegan
    }
    segmentos.forEach(seg => {
      config[seg.id] = { label: seg.label, color: seg.color }
    })
    return config
  }, [segmentos])

  // 3. Unimos los datos de las empresas con la rebanada de los que faltan
  const chartData = React.useMemo(() => {
    const data = segmentos.map(seg => ({
      name: seg.id,
      value: seg.count,
      fill: seg.color
    }))
    
    // Solo mostramos la rebanada gris si aún falta gente
    if (pendientesCount > 0) {
      data.push({ name: "pendientes", value: pendientesCount, fill: "var(--muted)" })
    }
    return data
  }, [segmentos, pendientesCount])

  return (
    <Card className="flex h-full flex-col shadow-sm">
      <CardHeader className="items-center pb-0">
        <CardTitle>Progreso de Asistencia</CardTitle>
        <CardDescription>Llegadas en tiempo real</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-62.5"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={65}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-4xl font-bold"
                        >
                          {percentage}%
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground text-sm"
                        >
                          Completado
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="mt-4 flex flex-col gap-2 pb-6 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none text-primary">
          {totalLlegadas} de {totalEsperados} empleados registrados <TrendingUp className="h-4 w-4" />
        </div>
        <div className="flex items-center gap-1 text-center leading-none text-muted-foreground">
          <Users className="h-3 w-3" /> Faltan {pendientesCount} por checar
        </div>
      </CardFooter>
    </Card>
  )
}