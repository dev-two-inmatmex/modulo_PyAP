'use client'

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"

interface Option {
  id: string | number;
  label: string;
}

interface ComboboxFieldProps {
  control: any;
  name: string;
  label: string;
  placeholder?: string;
  options: Option[];
  disabled?: boolean;
}

export function ComboboxField({ control, name, label, placeholder, options, disabled }: ComboboxFieldProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel className="text-[10px] font-bold text-slate-500 uppercase mb-1">{label}</FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className={cn(
                    "w-full justify-between bg-white font-normal h-10 border-slate-200",
                    !field.value && "text-muted-foreground"
                  )}
                  disabled={disabled}
                >
                  <span className="truncate">
                    {field.value
                      ? options.find((opt) => String(opt.id) === String(field.value))?.label
                      : placeholder || "Seleccionar..."}
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
              <Command>
                <CommandInput placeholder={`Buscar...`} className="h-9" />
                <CommandList>
                  <CommandEmpty>No se encontraron resultados.</CommandEmpty>
                  <CommandGroup>
                    {options.map((opt) => (
                      <CommandItem
                        key={opt.id}
                        value={opt.label}
                        onSelect={() => {
                          field.onChange(String(opt.id))
                          setOpen(false)
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            String(opt.id) === String(field.value) ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {opt.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}