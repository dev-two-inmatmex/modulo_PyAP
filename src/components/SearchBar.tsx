'use client'
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce'; // Opcional: para no saturar la DB
import { Input } from "@/components/ui/input";

export function SearchBar() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // Función que actualiza la URL cada vez que el usuario escribe
  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    // Actualiza la URL sin recargar la página: /empleados?query=juan
    replace(`${pathname}?${params.toString()}`);  
  }, 300);

  return (
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Buscar empleado..."
          onChange={(e) => handleSearch(e.target.value)}
          defaultValue={searchParams.get('query')?.toString()}
        />
      </div>
    );
}