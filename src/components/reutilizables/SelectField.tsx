/*import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Option {
  id: string | number;
  label: string;
}

interface SelectFieldProps {
  control: any;
  name: string;
  label: string;
  placeholder?: string; // Lo ponemos opcional con "?" por si alguna vez no lo mandas
  options: Option[];
  disabled?: boolean;   // 1. Agregamos la propiedad disabled aquí
}

// 2. Extraemos "disabled" de las props
export function SelectField({ control, name, label, placeholder, options, disabled }: SelectFieldProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          
          <Select onValueChange={field.onChange} defaultValue={field.value ? String(field.value) : ""} disabled={disabled}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((opt) => (
                <SelectItem key={opt.id} value={String(opt.id)}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}*/
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Option {
  id: string | number;
  label: string;
}

interface SelectFieldProps {
  control: any;
  name: string;
  label: string;
  placeholder?: string;
  options: Option[];
  disabled?: boolean;
}

export function SelectField({ control, name, label, placeholder, options, disabled }: SelectFieldProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-[10px] font-bold text-slate-500 uppercase">{label}</FormLabel>
          <Select 
            // EL TRUCO DEFINITIVO: Obliga a React a redibujar el Select si el valor cambia por código
            key={field.value ? String(field.value) : "empty"} 
            onValueChange={field.onChange} 
            value={field.value ? String(field.value) : ""} 
            disabled={disabled}
          >
            <FormControl>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((opt) => (
                <SelectItem key={opt.id} value={String(opt.id)}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}