import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingEmpleados() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 w-full">
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-10 w-[300px]" /> {/* Esqueleto del Título */}
        <Skeleton className="h-10 w-[150px]" /> {/* Esqueleto del Botón */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Mostramos 6 tarjetas fantasma mientras carga */}
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-[200px] w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}