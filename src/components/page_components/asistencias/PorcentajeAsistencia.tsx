'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface PorcentajeAsistenciaProps {
  checkedInCount: number;
  totalCount: number;
}

export function PorcentajeAsistencia({ checkedInCount, totalCount }: PorcentajeAsistenciaProps) {
  const percentage = totalCount > 0 ? (checkedInCount / totalCount) * 100 : 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Asistencia Hoy</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-5xl font-bold">{`${Math.round(percentage)}%`}</div>
        <p className="text-xs text-muted-foreground">
          {`${checkedInCount} de ${totalCount} empleados han registrado su entrada`}
        </p>
        <Progress value={percentage} className="mt-4" />
      </CardContent>
    </Card>
  );
}
